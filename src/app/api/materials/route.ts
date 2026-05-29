import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { getStorage } from "@/lib/storage";
import { z } from "zod";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const subjectId = searchParams.get("subjectId");
  const semester = searchParams.get("semester");
  const q = searchParams.get("q");
  const page = parseInt(searchParams.get("page") ?? "1", 10);
  const limit = Math.min(parseInt(searchParams.get("limit") ?? "20", 10), 50);
  const sort = searchParams.get("sort") ?? "latest";

  const where: Record<string, unknown> = { status: "APPROVED" };
  if (subjectId) where.subjectId = subjectId;
  if (semester) where.semester = semester;
  if (q) {
    where.OR = [
      { title: { contains: q, mode: "insensitive" } },
      { description: { contains: q, mode: "insensitive" } },
    ];
  }

  const orderBy =
    sort === "popular"
      ? { downloadCount: "desc" as const }
      : { createdAt: "desc" as const };

  const [materials, total] = await Promise.all([
    prisma.material.findMany({
      where,
      orderBy,
      skip: (page - 1) * limit,
      take: limit,
      include: {
        subject: { select: { name: true, college: true } },
        uploader: { select: { name: true } },
      },
    }),
    prisma.material.count({ where }),
  ]);

  return NextResponse.json({
    materials,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  });
}

const createMaterialSchema = z.object({
  title: z.string().min(1, "请输入标题"),
  description: z.string().optional(),
  subjectId: z.string().min(1, "请选择科目"),
  semester: z.string().optional(),
  fileUrl: z.string().min(1),
  fileName: z.string().min(1),
  fileSize: z.number().min(0),
  fileType: z.string(),
});

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "请先登录" }, { status: 401 });
  }

  const body = await request.json();
  const parsed = createMaterialSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0].message },
      { status: 400 }
    );
  }

  const { title, description, subjectId, semester, fileUrl, fileName, fileSize, fileType } = parsed.data;

  // 移动上传文件到 materials 目录
  const storage = getStorage();
  if (!(await storage.exists(fileUrl))) {
    try {
      await storage.moveToMaterials(fileUrl);
    } catch {
      return NextResponse.json(
        { error: "文件不存在或已过期" },
        { status: 400 }
      );
    }
  }

  const material = await prisma.material.create({
    data: {
      title,
      description,
      subjectId,
      semester,
      fileUrl,
      fileName,
      fileSize,
      fileType,
      status: "PENDING",
      uploaderId: session.user.id!,
    },
    include: {
      subject: { select: { name: true } },
    },
  });

  return NextResponse.json(material, { status: 201 });
}
