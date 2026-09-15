"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import Button from "@/components/ui/Button";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next");
  const redirectTo = next && next.startsWith("/") ? next : "/";

  const [mode, setMode] = useState<"sign-in" | "sign-up">("sign-in");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const { error: authError } =
      mode === "sign-in"
        ? await authClient.signIn.email({ email, password })
        : await authClient.signUp.email({ email, password, name });

    setLoading(false);
    if (authError) {
      setError(authError.message ?? "Something went wrong");
      return;
    }
    router.push(redirectTo);
    router.refresh();
  }

  return (
    <main className="relative flex min-h-screen justify-center overflow-hidden bg-brand-navy/[0.02] px-6 py-12 sm:py-16">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-[-12rem] h-[28rem] bg-[radial-gradient(ellipse_at_top,_rgba(52,184,240,0.16),_transparent_60%)]"
      />

      <div className="relative flex w-full max-w-sm flex-col">
        <Link
          href="/"
          className="mb-8 inline-flex w-fit items-center gap-1.5 text-sm font-medium text-brand-navy/60 transition-colors hover:text-brand-navy"
        >
          <ArrowLeft className="h-4 w-4" strokeWidth={2} />
          Back to site
        </Link>

        <div className="rounded-2xl border border-brand-navy/10 bg-white p-6 shadow-[0_20px_50px_-25px_rgba(10,17,48,0.35)] sm:p-8">
          <Link href="/" className="mb-8 flex justify-center">
            <img src="/images/logo.png" alt="Nafsy Travels" className="h-10 w-auto" />
          </Link>

          <div className="relative mb-6 flex rounded-lg bg-brand-navy/[0.04] p-1 text-sm font-medium">
            <span
              className={`absolute inset-y-1 left-1 w-[calc(50%-4px)] rounded-md bg-brand-navy transition-transform duration-200 ease-out ${
                mode === "sign-up" ? "translate-x-[calc(100%+4px)]" : "translate-x-0"
              }`}
              aria-hidden="true"
            />
            <button
              type="button"
              onClick={() => setMode("sign-in")}
              className={`relative z-10 flex-1 rounded-md py-2 transition-colors ${
                mode === "sign-in" ? "text-white" : "text-brand-navy/60"
              }`}
            >
              Sign in
            </button>
            <button
              type="button"
              onClick={() => setMode("sign-up")}
              className={`relative z-10 flex-1 rounded-md py-2 transition-colors ${
                mode === "sign-up" ? "text-white" : "text-brand-navy/60"
              }`}
            >
              Sign up
            </button>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div
              className="grid transition-[grid-template-rows] duration-200 ease-out"
              style={{ gridTemplateRows: mode === "sign-up" ? "1fr" : "0fr" }}
            >
              <div className="overflow-hidden">
                <label className="flex flex-col gap-1 pb-4 text-sm">
                  Full name
                  <input
                    required={mode === "sign-up"}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="rounded-lg border border-brand-navy/20 px-3 py-2 text-sm outline-none transition-colors focus:border-brand-blue-light"
                  />
                </label>
              </div>
            </div>

            <label className="flex flex-col gap-1 text-sm">
              Email
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="rounded-lg border border-brand-navy/20 px-3 py-2 text-sm outline-none transition-colors focus:border-brand-blue-light"
              />
            </label>
            <label className="flex flex-col gap-1 text-sm">
              Password
              <input
                type="password"
                required
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="rounded-lg border border-brand-navy/20 px-3 py-2 text-sm outline-none transition-colors focus:border-brand-blue-light"
              />
            </label>

            {error && <p className="text-sm text-red-600">{error}</p>}

            <Button type="submit" disabled={loading} className="mt-2 w-full">
              {loading ? "Please wait…" : mode === "sign-in" ? "Sign in" : "Create account"}
            </Button>
          </form>
        </div>
      </div>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
