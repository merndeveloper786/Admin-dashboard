
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";


const loginSchema = z.object({
  email: z.string().email({ message: "Valid email is required" }),
  password: z.string().min(1, { message: "Password is required" }),
});

export default function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "", remember: false });
  const [fieldErrors, setFieldErrors] = useState<{ [k: string]: string }>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
    setFieldErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setFieldErrors({});
    const result = loginSchema.safeParse(form);
    if (!result.success) {
      const errors: { [k: string]: string } = {};
      (result.error.issues as Array<{ path: (string | number)[]; message: string }>).forEach((err) => {
        if (err.path[0]) errors[err.path[0] as string] = err.message;
      });
      setFieldErrors(errors);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email, password: form.password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Login failed");
      setSuccess("Login successful!");
      setForm({ email: "", password: "", remember: false });
      setTimeout(() => router.push("/dashboard"), 1000);
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-primary-light">
      <div className="bg-card rounded-xl shadow-lg p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-center text-text mb-2">Login to Account</h1>
        <p className="text-center text-muted mb-6">Please enter your email and password to continue</p>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-text mb-1">Email address <span className="text-red-500">*</span></label>
            <input name="email" type="email" value={form.email} onChange={handleChange} className={`w-full px-4 py-2 rounded-lg border ${fieldErrors.email ? 'border-red-500' : 'border-border'} bg-background text-text focus:outline-none focus:ring-2 focus:ring-primary`} placeholder="your@email.com" />
            {fieldErrors.email && <p className="text-red-500 text-xs mt-1">{fieldErrors.email}</p>}
          </div>
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-sm font-medium text-text">Password <span className="text-red-500">*</span></label>
              <a href="#" className="text-xs text-primary hover:underline">Forget Password?</a>
            </div>
            <input name="password" type="password" value={form.password} onChange={handleChange} className={`w-full px-4 py-2 rounded-lg border ${fieldErrors.password ? 'border-red-500' : 'border-border'} bg-background text-text focus:outline-none focus:ring-2 focus:ring-primary`} placeholder="Password" />
            {fieldErrors.password && <p className="text-red-500 text-xs mt-1">{fieldErrors.password}</p>}
          </div>
          <div className="flex items-center">
            <input id="remember" name="remember" type="checkbox" checked={form.remember} onChange={handleChange} className="mr-2 accent-primary" />
            <label htmlFor="remember" className="text-sm text-text">Remember Password</label>
          </div>
          <button
            type="submit"
            className="w-full bg-primary text-black py-3 rounded-lg font-extrabold text-xl shadow-lg tracking-widest uppercase border-2 border-primary hover:bg-primary-dark focus:bg-primary-dark focus:outline-none focus:ring-4 focus:ring-primary/50 transition duration-200"
            disabled={loading}
          >
              <span className="text-text">{loading ? "Signing In..." : "Sign In"}</span>
          </button>
        </form>
        {error && <p className="text-red-500 text-center mt-2">{error}</p>}
        {success && <p className="text-green-600 text-center mt-2">{success}</p>}
        <p className="text-center text-sm text-muted mt-4">Don&apos;t have an account? <a href="/auth/signup" className="text-primary hover:underline">Create Account</a></p>
      </div>
    </div>
  );
}
