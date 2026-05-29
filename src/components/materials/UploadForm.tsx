"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useDropzone } from "react-dropzone";
import { Upload, FileText, X } from "lucide-react";

interface Subject {
  id: string;
  name: string;
}

export function UploadForm({ subjects }: { subjects: Subject[] }) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [subjectId, setSubjectId] = useState("");
  const [semester, setSemester] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
      setError("");
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
    maxSize: 50 * 1024 * 1024,
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!file) {
      setError("请选择文件");
      return;
    }

    setError("");
    setUploading(true);

    try {
      // Step 1: 上传文件
      const formData = new FormData();
      formData.append("file", file);

      const uploadRes = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!uploadRes.ok) {
        const data = await uploadRes.json();
        throw new Error(data.error ?? "文件上传失败");
      }

      const uploadData = await uploadRes.json();

      // Step 2: 创建材料记录
      const materialRes = await fetch("/api/materials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description: description || undefined,
          subjectId,
          semester: semester || undefined,
          fileName: uploadData.fileName,
          fileUrl: uploadData.fileKey,
          fileSize: uploadData.fileSize,
          fileType: uploadData.fileType,
        }),
      });

      if (!materialRes.ok) {
        const data = await materialRes.json();
        throw new Error(data.error ?? "创建资料失败");
      }

      setSuccess("资料上传成功！等待管理员审核后即可公开。");
      setTitle("");
      setDescription("");
      setSubjectId("");
      setSemester("");
      setFile(null);

      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "上传失败");
    } finally {
      setUploading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <div className="rounded-md bg-red-50 p-3 text-sm text-red-600">
          {error}
        </div>
      )}
      {success && (
        <div className="rounded-md bg-green-50 p-3 text-sm text-green-600">
          {success}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700">
          资料标题 <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          placeholder="如：2024年高等数学期末真题"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          科目 <span className="text-red-500">*</span>
        </label>
        <select
          required
          value={subjectId}
          onChange={(e) => setSubjectId(e.target.value)}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        >
          <option value="">请选择科目</option>
          {subjects.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          学期
        </label>
        <input
          type="text"
          value={semester}
          onChange={(e) => setSemester(e.target.value)}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          placeholder="如：2024-2025-1"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          描述
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          placeholder="补充说明这份资料的内容"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          文件 <span className="text-red-500">*</span>
        </label>
        <div
          {...getRootProps()}
          className={`mt-1 flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-8 transition-colors ${
            isDragActive
              ? "border-blue-400 bg-blue-50"
              : "border-gray-300 hover:border-gray-400"
          }`}
        >
          <input {...getInputProps()} />
          {file ? (
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <FileText className="h-5 w-5 text-primary" />
              <span>{file.name}</span>
              <span className="text-gray-400">
                ({(file.size / 1024 / 1024).toFixed(1)} MB)
              </span>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setFile(null);
                }}
                className="ml-2 text-gray-400 hover:text-red-500"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <div className="text-center">
              <Upload className="mx-auto h-8 w-8 text-gray-400" />
              <p className="mt-2 text-sm text-gray-500">
                {isDragActive
                  ? "放开以添加文件"
                  : "拖放文件到此处，或点击选择"}
              </p>
              <p className="mt-1 text-xs text-gray-400">
                支持 PDF、Word、PPT、图片、压缩包，最大 50MB
              </p>
            </div>
          )}
        </div>
      </div>

      <button
        type="submit"
        disabled={uploading}
        className="w-full rounded-md bg-primary px-4 py-2.5 text-white hover:bg-primary-light disabled:opacity-50"
      >
        {uploading ? "上传中..." : "提交上传"}
      </button>
    </form>
  );
}
