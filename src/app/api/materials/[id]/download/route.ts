import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { getStorage } from "@/lib/storage";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json({ error: "请先登录" }, { status: 401 });
  }

  const material = await prisma.material.findUnique({
    where: { id },
    select: {
      id: true,
      status: true,
      fileUrl: true,
      fileName: true,
      fileType: true,
      fileSize: true,
      uploaderId: true,
    },
  });

  if (!material) {
    return NextResponse.json({ error: "资料不存在" }, { status: 404 });
  }

  // 只有已审核通过的资料才能下载，或者上传者本人和管理员可以下载
  if (material.status !== "APPROVED") {
    if (
      session.user.id !== material.uploaderId &&
      session.user.role !== "ADMIN"
    ) {
      return NextResponse.json({ error: "该资料尚未审核通过" }, { status: 403 });
    }
  }

  const storage = getStorage();

  if (!(await storage.exists(material.fileUrl))) {
    return NextResponse.json(
      { error: "文件不存在或已被删除" },
      { status: 404 }
    );
  }

  // 获取文件实际大小（优先用数据库记录，回退到文件系统查询）
  let fileSize = material.fileSize;
  if (!fileSize || fileSize <= 0) {
    try {
      fileSize = await storage.getFileSize(material.fileUrl);
    } catch {
      fileSize = 0;
    }
  }

  // 更新下载计数和下载日志
  await Promise.all([
    prisma.material.update({
      where: { id },
      data: { downloadCount: { increment: 1 } },
    }),
    prisma.downloadLog.create({
      data: {
        materialId: id,
        userId: session.user.id!,
      },
    }),
  ]);

  // 流式传输文件
  const fileStream = await storage.getReadableStream(material.fileUrl);

  // 编码文件名（兼容中英文及各种浏览器）
  const encodedFilename = encodeURIComponent(material.fileName);

  const headers: Record<string, string> = {
    // application/octet-stream 强制浏览器下载而非预览，手机端弹出保存对话框
    "Content-Type": "application/octet-stream",
    // Content-Disposition 使用 attachment 强制下载，同时提供 RFC 5987 编码和普通文件名双保险
    "Content-Disposition": `attachment; filename="${encodedFilename}"; filename*=UTF-8''${encodedFilename}`,
  };

  if (fileSize > 0) {
    headers["Content-Length"] = String(fileSize);
  }

  return new Response(fileStream, { headers });
}
