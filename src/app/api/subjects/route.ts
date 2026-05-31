import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { WHUT_COLLEGES } from "@/lib/colleges";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

export async function GET() {
  const subjects = await prisma.subject.findMany({
    orderBy: { name: "asc" },
    include: {
      _count: { select: { materials: { where: { status: "APPROVED" } } } },
    },
  });
  return NextResponse.json(subjects);
}

const createSubjectSchema = z.object({
  name: z.string().trim().min(1, "请输入科目名称").max(80),
  code: z.string().trim().max(40).optional(),
  description: z.string().trim().max(500).optional(),
  college: z
    .enum(WHUT_COLLEGES, { error: "请选择有效学院" })
    .optional(),
});

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "请先登录" }, { status: 401 });
  }

  const body = await request.json();
  const parsed = createSubjectSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0].message },
      { status: 400 }
    );
  }

  const data = {
    name: parsed.data.name,
    code: parsed.data.code || undefined,
    description: parsed.data.description || undefined,
    college: parsed.data.college || undefined,
  };

  const existingSubject = await prisma.subject.findUnique({
    where: { name: data.name },
  });

  if (existingSubject) {
    if (!existingSubject.college && data.college) {
      const updatedSubject = await prisma.subject.update({
        where: { id: existingSubject.id },
        data: { college: data.college },
      });
      return NextResponse.json(updatedSubject);
    }

    return NextResponse.json(existingSubject);
  }

  const subject = await prisma.subject.create({ data });
  return NextResponse.json(subject, { status: 201 });
}
