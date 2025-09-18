"use client";
import { useState } from "react";
import { z } from "zod";


const signupSchema = z.object({
  email: z.string().email({ message: "Valid email is required" }),
  username: z.string().min(2, { message: "Username is required" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
  terms: z.literal(true, { message: "You must accept terms" }),
});

export default function SignupPage() {
  const [form, setForm] = useState({ email: "", username: "", password: "", terms: false });
  const [fieldErrors, setFieldErrors] = useState<{ [k: string]: string }>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

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
    const result = signupSchema.safeParse(form);
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
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email, username: form.username, password: form.password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Signup failed");
      setSuccess("Signup successful! You can now login.");
      setForm({ email: "", username: "", password: "", terms: false });
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
        <h1 className="text-3xl font-bold text-center text-text mb-2">Create an Account</h1>
        <p className="text-center text-muted mb-6">Create an account to continue</p>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-text mb-1">Email address <span className="text-red-500">*</span></label>
            <input name="email" type="email" value={form.email} onChange={handleChange} className={`w-full px-4 py-2 rounded-lg border ${fieldErrors.email ? 'border-red-500' : 'border-border'} bg-background text-text focus:outline-none focus:ring-2 focus:ring-primary`} placeholder="your@email.com" />
            {fieldErrors.email && <p className="text-red-500 text-xs mt-1">{fieldErrors.email}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-text mb-1">Username <span className="text-red-500">*</span></label>
            <input name="username" type="text" value={form.username} onChange={handleChange} className={`w-full px-4 py-2 rounded-lg border ${fieldErrors.username ? 'border-red-500' : 'border-border'} bg-background text-text focus:outline-none focus:ring-2 focus:ring-primary`} placeholder="Username" />
            {fieldErrors.username && <p className="text-red-500 text-xs mt-1">{fieldErrors.username}</p>}
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
            <input id="terms" name="terms" type="checkbox" checked={form.terms} onChange={handleChange} className={`mr-2 accent-primary ${fieldErrors.terms ? 'border-red-500' : ''}`} />
            <label htmlFor="terms" className="text-sm text-text">I accept terms and conditions <span className="text-red-500">*</span></label>
          </div>
          {fieldErrors.terms && <p className="text-red-500 text-xs mt-1">{fieldErrors.terms}</p>}
          <button
            type="submit"
            className="w-full py-3 rounded-lg font-extrabold text-xl shadow-lg tracking-widest uppercase border-2 border-primary hover:bg-primary-dark focus:bg-primary-dark focus:outline-none focus:ring-4 focus:ring-primary/50 transition duration-200 text-text bg-primary/90 hover:bg-primary-dark/90"
            disabled={loading}
          >
            <span className="text-text">{loading ? "Signing Up..." : "Sign Up"}</span>
          </button>
        </form>
        {error && <p className="text-red-500 text-center mt-2">{error}</p>}
        {success && <p className="text-green-600 text-center mt-2">{success}</p>}
        <p className="text-center text-sm text-muted mt-4">Already have an account? <a href="/auth/login" className="text-primary hover:underline">Login</a></p>
      </div>
    </div>
  );
}
