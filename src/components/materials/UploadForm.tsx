"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { useDropzone, type FileRejection } from "react-dropzone";
import { FileText, Upload, X } from "lucide-react";
import { SubjectCombobox, type SubjectOption } from "@/components/subjects/SubjectCombobox";
import { sortSubjectsByPinyin } from "@/lib/subjects";
import { MAX_FILE_SIZE_BYTES, MAX_FILE_SIZE_LABEL } from "@/lib/upload-limits";

function titleFromFileName(fileName: string) {
  return fileName.replace(/\.[^.]+$/, "").trim();
}

async function getResponseError(response: Response, fallback: string) {
  if (response.status === 413) {
    return `文件太大，服务器当前没有放行 ${MAX_FILE_SIZE_LABEL} 上传。请检查 Nginx 或宝塔的上传大小限制。`;
  }

  try {
    const contentType = response.headers.get("content-type") ?? "";
    if (contentType.includes("application/json")) {
      const data = await response.json();
      return data.error ?? fallback;
    }

    const text = await response.text();
    if (text.toLowerCase().includes("too large")) {
      return `文件太大，服务器当前没有放行 ${MAX_FILE_SIZE_LABEL} 上传。请检查 Nginx 或宝塔的上传大小限制。`;
    }
  } catch {
    // Fall through to the friendly fallback message.
  }

  return fallback;
}

export function UploadForm({ subjects }: { subjects: SubjectOption[] }) {
  const router = useRouter();
  const [subjectOptions, setSubjectOptions] = useState(subjects);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [subjectId, setSubjectId] = useState("");
  const [subjectName, setSubjectName] = useState("");
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setFiles((current) => {
        const existing = new Set(current.map((file) => `${file.name}-${file.size}`));
        const next = acceptedFiles.filter((file) => !existing.has(`${file.name}-${file.size}`));
        return [...current, ...next];
      });
      setError("");
    }
  }, []);

  const onDropRejected = useCallback((fileRejections: FileRejection[]) => {
    const oversizedFile = fileRejections.find((rejection) =>
      rejection.errors.some((item) => item.code === "file-too-large")
    );

    setError(
      oversizedFile
        ? `单个文件最大支持 ${MAX_FILE_SIZE_LABEL}，${oversizedFile.file.name} 已超过限制。`
        : "文件不符合上传要求，请重新选择。"
    );
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    onDropRejected,
    multiple: true,
    maxSize: MAX_FILE_SIZE_BYTES,
  });

  async function resolveSubjectId() {
    if (subjectId) return subjectId;

    const trimmedName = subjectName.trim();
    if (!trimmedName) {
      throw new Error("请选择或输入课程名称");
    }

    const res = await fetch("/api/subjects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: trimmedName }),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error ?? "创建课程失败");
    }

    const subject = data as SubjectOption;
    setSubjectOptions((current) =>
      current.some((item) => item.id === subject.id)
        ? current
        : sortSubjectsByPinyin([...current, subject])
    );
    setSubjectId(subject.id);
    setSubjectName(subject.name);
    return subject.id;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!year.trim()) {
      setError("请填写资料年份");
      return;
    }
    if (!/^\d{4}$/.test(year.trim())) {
      setError("年份请填写 4 位数字，例如 2025");
      return;
    }
    if (files.length === 0) {
      setError("请选择至少一个文件");
      return;
    }

    setError("");
    setSuccess("");
    setUploading(true);

    try {
      const finalSubjectId = await resolveSubjectId();

      for (const file of files) {
        const formData = new FormData();
        formData.append("file", file);

        const uploadRes = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        if (!uploadRes.ok) {
          throw new Error(await getResponseError(uploadRes, `${file.name} 上传失败`));
        }

        const uploadData = await uploadRes.json();
        const materialTitle =
          files.length === 1 && title.trim()
            ? title.trim()
            : title.trim()
              ? `${title.trim()} - ${titleFromFileName(file.name)}`
              : titleFromFileName(file.name);

        const materialRes = await fetch("/api/materials", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: materialTitle,
            description: description.trim() || undefined,
            subjectId: finalSubjectId,
            semester: year.trim(),
            fileName: uploadData.fileName,
            fileUrl: uploadData.fileKey,
            fileSize: uploadData.fileSize,
            fileType: uploadData.fileType,
          }),
        });

        if (!materialRes.ok) {
          throw new Error(await getResponseError(materialRes, `${file.name} 创建资料记录失败`));
        }
      }

      setSuccess(`已提交 ${files.length} 个文件，等待管理员审核后公开。`);
      setTitle("");
      setDescription("");
      setSubjectId("");
      setSubjectName("");
      setYear(new Date().getFullYear().toString());
      setFiles([]);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "上传失败");
    } finally {
      setUploading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && <div className="rounded-md bg-red-50 p-3 text-sm text-red-600">{error}</div>}
      {success && <div className="rounded-md bg-green-50 p-3 text-sm text-green-700">{success}</div>}

      <div>
        <label className="block text-sm font-medium text-gray-700">资料标题</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          placeholder="可选；多个文件会自动追加文件名"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            课程 <span className="text-red-500">*</span>
          </label>
          <SubjectCombobox
            subjects={subjectOptions}
            value={subjectId}
            inputValue={subjectName}
            allowCreate
            required
            placeholder="输入课程名搜索，或添加新课程"
            onChange={(subject, typedName) => {
              setSubjectId(subject?.id ?? "");
              setSubjectName(typedName);
            }}
          />
          <p className="mt-1 text-xs text-gray-400">没有匹配项时，可直接按输入内容新增课程。</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            年份 <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            inputMode="numeric"
            required
            value={year}
            onChange={(e) => setYear(e.target.value)}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="例如：2025"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">描述</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          placeholder="可写明资料类型、适用老师或考试范围"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          文件 <span className="text-red-500">*</span>
        </label>
        <div
          {...getRootProps()}
          className={`mt-1 flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-5 transition-colors sm:p-8 ${
            isDragActive ? "border-blue-400 bg-blue-50" : "border-gray-300 hover:border-gray-400"
          }`}
        >
          <input {...getInputProps()} />
          <Upload className="mx-auto h-8 w-8 text-gray-400" />
          <p className="mt-2 text-center text-sm text-gray-500">
            {isDragActive ? "松开以添加文件" : "拖放文件到此处，或点击选择多个文件"}
          </p>
          <p className="mt-1 text-center text-xs text-gray-400">
            支持 PDF、Word、PPT、图片、压缩包，单个文件最大 {MAX_FILE_SIZE_LABEL}
          </p>
        </div>

        {files.length > 0 && (
          <div className="mt-3 space-y-2">
            {files.map((file) => (
              <div
                key={`${file.name}-${file.size}`}
                className="flex items-center gap-2 rounded-md border bg-gray-50 px-3 py-2 text-sm text-gray-700"
              >
                <FileText className="h-4 w-4 flex-shrink-0 text-primary" />
                <span className="min-w-0 flex-1 truncate">{file.name}</span>
                <span className="whitespace-nowrap text-xs text-gray-400">
                  {(file.size / 1024 / 1024).toFixed(1)} MB
                </span>
                <button
                  type="button"
                  onClick={() => setFiles((current) => current.filter((item) => item !== file))}
                  className="rounded p-1 text-gray-400 hover:bg-white hover:text-red-500"
                  aria-label={`移除 ${file.name}`}
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <button
        type="submit"
        disabled={uploading}
        className="w-full rounded-md bg-primary px-4 py-2.5 text-white hover:bg-primary-light disabled:opacity-50"
      >
        {uploading ? "上传中..." : "提交上传"}
      </button>
    </form>
  );
}
