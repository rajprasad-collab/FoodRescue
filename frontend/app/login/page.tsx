"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin(
    event: React.FormEvent
  ) {
    event.preventDefault();

    setLoading(true);
    setError("");

    const { error } =
      await supabase.auth.signInWithPassword({
        email,
        password,
      });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    router.push("/");
    router.refresh();
  }

  return (
    <div className="flex min-h-[calc(100vh-10rem)] items-center justify-center">
      <div className="w-full max-w-md rounded-xl border border-[#e5e3dd] bg-white p-8">
        <div className="mb-8">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#173f35] font-bold text-white">
            F
          </div>

          <h1 className="mt-5 text-2xl font-semibold text-[#26352f]">
            Sign in to FoodRescue
          </h1>

          <p className="mt-2 text-sm leading-6 text-[#7b817a]">
            Access the food redistribution operations
            dashboard.
          </p>
        </div>

        <form
          onSubmit={handleLogin}
          className="space-y-5"
        >
          <label className="block">
            <span className="mb-2 block text-xs font-semibold text-[#59615a]">
              Email
            </span>

            <input
              type="email"
              value={email}
              onChange={(event) =>
                setEmail(event.target.value)
              }
              className="input"
              required
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-xs font-semibold text-[#59615a]">
              Password
            </span>

            <input
              type="password"
              value={password}
              onChange={(event) =>
                setPassword(event.target.value)
              }
              className="input"
              required
            />
          </label>

          {error && (
            <div className="rounded-lg border border-[#ead3d0] bg-[#fdf1ef] px-4 py-3 text-sm text-[#9a4038]">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-[#173f35] px-5 py-3 text-sm font-medium text-white hover:bg-[#245748] disabled:opacity-50"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}