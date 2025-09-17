"use client";
import { useState } from "react";

export default function SignupPage() {
  const [form, setForm] = useState({ email: "", username: "", password: "", terms: false });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!form.email || !form.username || !form.password || !form.terms) {
      setError("All fields are required and terms must be accepted.");
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
    } catch (err: any) {
      setError(err.message);
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
            <label className="block text-sm font-medium text-text mb-1">Email address:</label>
            <input name="email" type="email" value={form.email} onChange={handleChange} className="w-full px-4 py-2 rounded-lg border border-border bg-background text-text focus:outline-none focus:ring-2 focus:ring-primary" placeholder="your@email.com" />
          </div>
          <div>
            <label className="block text-sm font-medium text-text mb-1">Username</label>
            <input name="username" type="text" value={form.username} onChange={handleChange} className="w-full px-4 py-2 rounded-lg border border-border bg-background text-text focus:outline-none focus:ring-2 focus:ring-primary" placeholder="Username" />
          </div>
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-sm font-medium text-text">Password</label>
              <a href="#" className="text-xs text-primary hover:underline">Forget Password?</a>
            </div>
            <input name="password" type="password" value={form.password} onChange={handleChange} className="w-full px-4 py-2 rounded-lg border border-border bg-background text-text focus:outline-none focus:ring-2 focus:ring-primary" placeholder="Password" />
          </div>
          <div className="flex items-center">
            <input id="terms" name="terms" type="checkbox" checked={form.terms} onChange={handleChange} className="mr-2 accent-primary" />
            <label htmlFor="terms" className="text-sm text-text">I accept terms and conditions</label>
          </div>
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
