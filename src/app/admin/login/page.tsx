"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (res.ok) {
        router.push("/admin/dashboard");
      } else {
        const data = await res.json();
        setError(data.error || "Login failed");
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="card max-w-md w-full">
        <h1 className="text-3xl font-display text-center mb-2">Admin Login</h1>
        <p className="text-text-warm/50 text-center text-sm mb-8">Enter your password to access the dashboard</p>
        
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-mono mb-2 uppercase tracking-wider text-text-warm/70">
              Password
            </label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-field" 
              placeholder="••••••••"
              required
            />
          </div>
          
          {error && (
            <div className="bg-error/10 border border-error text-error p-3 text-sm">
              {error}
            </div>
          )}
          
          <button 
            type="submit" 
            className="btn-primary w-full disabled:opacity-50 flex items-center justify-center gap-2"
            disabled={loading || !password}
          >
            {loading ? "Authenticating..." : "Login"}
          </button>
        </form>
      </div>
    </main>
  );
}
