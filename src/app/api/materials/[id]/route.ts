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

  const material = await prisma.material.findUnique({
    where: { id },
    include: {
      subject: { select: { id: true, name: true, college: true } },
      uploader: { select: { id: true, name: true, email: true } },
    },
  });

  if (!material) {
    return NextResponse.json({ error: "资料不存在" }, { status: 404 });
  }

  // PENDING/REJECTED 资料只有上传者和管理员可以看到
  if (material.status !== "APPROVED") {
    if (
      !session?.user ||
      (session.user.id !== material.uploaderId &&
        session.user.role !== "ADMIN")
    ) {
      return NextResponse.json({ error: "资料不存在" }, { status: 404 });
    }
  }

  return NextResponse.json(material);
}

export async function DELETE(
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
    select: { uploaderId: true, fileUrl: true },
  });

  if (!material) {
    return NextResponse.json({ error: "资料不存在" }, { status: 404 });
  }

  if (session.user.id !== material.uploaderId && session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "无权限" }, { status: 403 });
  }

  // 删除文件
  const storage = getStorage();
  await storage.delete(material.fileUrl);

  // 删除数据库记录
  await prisma.material.delete({ where: { id } });

  return NextResponse.json({ success: true });
}
