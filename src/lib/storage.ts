import { promises as fs, createReadStream } from "fs";
import crypto from "crypto";
import path from "path";

const STORAGE_ROOT = process.env.STORAGE_ROOT
  ?? (process.env.VERCEL
    ? path.join("/tmp", "storage")
    : path.join(process.cwd(), "storage"));

export interface FileMetadata {
  fileKey: string;
  fileName: string;
  fileSize: number;
  fileType: string;
}

export interface StorageProvider {
  save(buffer: Buffer, fileName: string, fileType: string): Promise<FileMetadata>;
  moveToMaterials(fileKey: string): Promise<string>;
  delete(fileKey: string): Promise<void>;
  exists(fileKey: string): Promise<boolean>;
  getReadableStream(fileKey: string): Promise<ReadableStream>;
}

class LocalDiskStorage implements StorageProvider {
  private uploadsDir = path.join(STORAGE_ROOT, "uploads");
  private materialsDir = path.join(STORAGE_ROOT, "materials");

  async save(buffer: Buffer, fileName: string, fileType: string): Promise<FileMetadata> {
    await fs.mkdir(this.uploadsDir, { recursive: true });
    const ext = path.extname(fileName);
    const id = crypto.randomUUID();
    const fileKey = `${id}${ext}`;

    await fs.writeFile(path.join(this.uploadsDir, fileKey), buffer);

    return {
      fileKey,
      fileName,
      fileSize: buffer.length,
      fileType,
    };
  }

  async moveToMaterials(fileKey: string): Promise<string> {
    await fs.mkdir(this.materialsDir, { recursive: true });
    const src = path.join(this.uploadsDir, fileKey);
    const dest = path.join(this.materialsDir, fileKey);
    await fs.rename(src, dest);
    return dest;
  }

  async delete(fileKey: string): Promise<void> {
    const filePath = path.join(this.materialsDir, fileKey);
    try {
      await fs.unlink(filePath);
    } catch {
      // 文件可能已被删除
    }
  }

  async exists(fileKey: string): Promise<boolean> {
    const filePath = path.join(this.materialsDir, fileKey);
    try {
      await fs.access(filePath);
      return true;
    } catch {
      return false;
    }
  }

  getReadableStream(fileKey: string): Promise<ReadableStream> {
    const filePath = path.join(this.materialsDir, fileKey);
    // Node ReadStream -> Web ReadableStream
    const stream = createReadStream(filePath);
    return Promise.resolve(stream as unknown as ReadableStream);
  }
}

let storageInstance: LocalDiskStorage;

export function getStorage(): StorageProvider {
  if (!storageInstance) {
    storageInstance = new LocalDiskStorage();
  }
  return storageInstance;
}

// 文件类型白名单
export const ALLOWED_MIME_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-powerpoint",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  "application/zip",
  "application/x-rar-compressed",
  "application/x-7z-compressed",
  "image/png",
  "image/jpeg",
  "image/webp",
  "text/plain",
];

export const ALLOWED_EXTENSIONS = [
  ".pdf", ".doc", ".docx", ".ppt", ".pptx",
  ".zip", ".rar", ".7z",
  ".png", ".jpg", ".jpeg", ".webp",
  ".txt",
];

export const MAX_FILE_SIZE = parseInt(process.env.MAX_FILE_SIZE_MB ?? "50", 10) * 1024 * 1024;
