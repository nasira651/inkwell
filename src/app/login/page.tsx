import { connectDB } from "@/db/connect";
import { UserModel } from "@/db/models/User";
import { toUserDTO } from "@/lib/users/serialize";

import { LoginForm } from "@/components/auth/login-form";

type LoginPageProps = {
  searchParams: Promise<{ from?: string }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const { from } = await searchParams;
  await connectDB();
  const users = await UserModel.find().sort({ name: 1 });

  return (
    <div className="flex min-h-screen items-center justify-center bg-paper p-8">
      <main className="w-full max-w-md rounded-2xl border border-border bg-white p-8 shadow-sm">
        <div className="mb-8 text-center">
          <h1 className="font-serif text-2xl font-semibold text-ink">Sign in to Inkwell</h1>
        </div>

        {users.length === 0 ? (
          <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
            <p>No users found. Seed the database first:</p>
            <code className="mt-2 block rounded bg-white px-2 py-1 font-mono text-xs">
              npm run db:seed
            </code>
          </div>
        ) : (
          <LoginForm users={users.map(toUserDTO)} redirectTo={from} />
        )}
      </main>
    </div>
  );
}
