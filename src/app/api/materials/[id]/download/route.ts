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

  return new Response(fileStream as unknown as BodyInit, {
    headers: {
      "Content-Type": material.fileType || "application/octet-stream",
      "Content-Disposition": `attachment; filename*=UTF-8''${encodeURIComponent(material.fileName)}`,
    },
  });
}
