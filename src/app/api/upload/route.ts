import { NextResponse } from "next/server";
import path from "path";
import { auth } from "@/auth";
import {
  ALLOWED_EXTENSIONS,
  ALLOWED_MIME_TYPES,
  MAX_FILE_SIZE,
  getStorage,
} from "@/lib/storage";
import { MAX_FILE_SIZE_LABEL } from "@/lib/upload-limits";

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "请先登录" }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: "请选择文件" }, { status: 400 });
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: `文件大小超过 ${MAX_FILE_SIZE_LABEL} 限制` },
        { status: 400 }
      );
    }

    const ext = path.extname(file.name).toLowerCase();
    if (!ALLOWED_EXTENSIONS.includes(ext)) {
      return NextResponse.json({ error: "不支持的文件类型" }, { status: 400 });
    }

    // 浏览器对 .7z/.rar/.doc 等格式可能返回空 MIME，扩展名校验已足够
    if (file.type && !ALLOWED_MIME_TYPES.includes(file.type)) {
      return NextResponse.json({ error: "不支持的 MIME 类型" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const metadata = await getStorage().save(buffer, file.name, file.type);

    return NextResponse.json(metadata, { status: 201 });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "文件上传失败" }, { status: 500 });
  }
}
