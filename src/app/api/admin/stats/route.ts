import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "无权限" }, { status: 403 });
  }

  const [totalUsers, totalMaterials, pendingCount, approvedCount, rejectedCount, totalDownloads] =
    await Promise.all([
      prisma.user.count(),
      prisma.material.count(),
      prisma.material.count({ where: { status: "PENDING" } }),
      prisma.material.count({ where: { status: "APPROVED" } }),
      prisma.material.count({ where: { status: "REJECTED" } }),
      prisma.downloadLog.count(),
    ]);

  return NextResponse.json({
    totalUsers,
    totalMaterials,
    pendingCount,
    approvedCount,
    rejectedCount,
    totalDownloads,
  });
}
