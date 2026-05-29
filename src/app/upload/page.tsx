import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { UploadForm } from "@/components/materials/UploadForm";

export default async function UploadPage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/login?callbackUrl=/upload");
  }

  const subjects = await prisma.subject.findMany({
    orderBy: { name: "asc" },
    select: { id: true, name: true },
  });

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-6 text-2xl font-bold text-gray-900">上传资料</h1>
      <div className="rounded-lg border bg-white p-6 shadow-sm">
        <UploadForm subjects={subjects} />
      </div>
    </div>
  );
}
