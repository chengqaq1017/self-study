import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "请先登录" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      createdAt: true,
      materials: {
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          title: true,
          status: true,
          downloadCount: true,
          createdAt: true,
          subject: { select: { name: true } },
        },
      },
      _count: {
        select: {
          materials: true,
          downloads: true,
        },
      },
    },
  });

  if (!user) {
    return NextResponse.json({ error: "用户不存在" }, { status: 404 });
  }

  return NextResponse.json(user);
}

const updateUserSchema = z.object({
  name: z.string().max(50).nullable().optional(),
  email: z.string().email("请输入有效邮箱"),
  currentPassword: z.string().optional(),
  newPassword: z.string().min(6, "新密码至少 6 位").optional(),
});

export async function PATCH(request: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "请先登录" }, { status: 401 });
  }

  const body = await request.json();
  const parsed = updateUserSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
  }

  const { name, email, currentPassword, newPassword } = parsed.data;
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { id: true, email: true, passwordHash: true },
  });

  if (!user) {
    return NextResponse.json({ error: "用户不存在" }, { status: 404 });
  }

  const normalizedEmail = email.trim().toLowerCase();
  if (normalizedEmail !== user.email) {
    const existing = await prisma.user.findUnique({
      where: { email: normalizedEmail },
      select: { id: true },
    });
    if (existing && existing.id !== user.id) {
      return NextResponse.json({ error: "该邮箱已被使用" }, { status: 409 });
    }
  }

  const data: { name?: string | null; email: string; passwordHash?: string } = {
    name: name ?? null,
    email: normalizedEmail,
  };

  if (newPassword) {
    if (!currentPassword) {
      return NextResponse.json({ error: "修改密码需要填写当前密码" }, { status: 400 });
    }
    const passwordMatch = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!passwordMatch) {
      return NextResponse.json({ error: "当前密码不正确" }, { status: 400 });
    }
    data.passwordHash = await bcrypt.hash(newPassword, 12);
  }

  const updated = await prisma.user.update({
    where: { id: user.id },
    data,
    select: { id: true, email: true, name: true, role: true },
  });

  return NextResponse.json(updated);
}
