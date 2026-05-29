import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const subject = await prisma.subject.findUnique({
    where: { id },
    include: {
      _count: { select: { materials: { where: { status: "APPROVED" } } } },
    },
  });

  if (!subject) {
    return NextResponse.json({ error: "科目不存在" }, { status: 404 });
  }

  return NextResponse.json(subject);
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "无权限" }, { status: 403 });
  }

  const { id } = await params;
  const body = await request.json();

  const subject = await prisma.subject.update({
    where: { id },
    data: {
      name: body.name,
      code: body.code,
      description: body.description,
      college: body.college,
    },
  });

  return NextResponse.json(subject);
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "无权限" }, { status: 403 });
  }

  const { id } = await params;
  await prisma.subject.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
