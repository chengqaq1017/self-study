import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "无权限" }, { status: 403 });
  }

  const searchParams = request.nextUrl.searchParams;
  const status = searchParams.get("status") ?? "PENDING";
  const page = parseInt(searchParams.get("page") ?? "1", 10);
  const limit = 20;

  const [materials, total] = await Promise.all([
    prisma.material.findMany({
      where: { status: status as "PENDING" | "APPROVED" | "REJECTED" },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
      include: {
        uploader: { select: { name: true, email: true } },
        subject: { select: { name: true } },
        reviews: {
          orderBy: { createdAt: "desc" },
          take: 1,
          include: {
            reviewer: { select: { name: true } },
          },
        },
      },
    }),
    prisma.material.count({ where: { status: status as "PENDING" | "APPROVED" | "REJECTED" } }),
  ]);

  return NextResponse.json({
    materials,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  });
}
