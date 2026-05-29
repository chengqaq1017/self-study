import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const reviewSchema = z.object({
  status: z.enum(["APPROVED", "REJECTED"]),
  comment: z.string().optional(),
});

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = await auth();

  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "无权限" }, { status: 403 });
  }

  const body = await request.json();
  const parsed = reviewSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0].message },
      { status: 400 }
    );
  }

  const { status, comment } = parsed.data;

  // 更新资料状态并创建审核记录
  const [material, review] = await Promise.all([
    prisma.material.update({
      where: { id },
      data: { status },
      include: {
        uploader: { select: { name: true, email: true } },
        subject: { select: { name: true } },
      },
    }),
    prisma.review.create({
      data: {
        materialId: id,
        reviewerId: session.user.id!,
        status,
        comment,
      },
    }),
  ]);

  return NextResponse.json({ material, review });
}
