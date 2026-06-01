import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "无权限" }, { status: 403 });
  }

  const users = await prisma.user.findMany({
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      createdAt: true,
      _count: { select: { materials: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(users);
}

const updateRoleSchema = z.object({
  userId: z.string().min(1),
  role: z.enum(["ADMIN", "STUDENT"]),
});

export async function PATCH(request: NextRequest) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "无权限" }, { status: 403 });
  }

  const body = await request.json();
  const parsed = updateRoleSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "参数错误" }, { status: 400 });
  }

  const { userId, role } = parsed.data;

  // 不能修改自己的角色
  if (userId === session.user.id) {
    return NextResponse.json({ error: "不能修改自己的角色" }, { status: 400 });
  }

  const target = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true },
  });

  if (!target) {
    return NextResponse.json({ error: "用户不存在" }, { status: 404 });
  }

  const updated = await prisma.user.update({
    where: { id: userId },
    data: { role },
    select: { id: true, email: true, name: true, role: true },
  });

  return NextResponse.json(updated);
}
