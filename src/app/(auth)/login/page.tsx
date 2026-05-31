import { LoginForm } from "@/components/auth/LoginForm";

export default function LoginPage() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center py-6 sm:min-h-[80vh]">
      <div className="w-full max-w-md rounded-lg bg-white p-5 shadow-md sm:p-8">
        <h1 className="mb-6 text-center text-2xl font-bold text-gray-900">
          登录
        </h1>
        <LoginForm />
      </div>
    </div>
  );
}
