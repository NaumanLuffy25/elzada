"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Shield, Loader2, AlertCircle, CheckCircle, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button, Input, Field } from "@/components/admin/ui";

export default function AdminAccessPage() {
  const [key, setKey] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/admin/verify-key", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: key.trim() }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Invalid admin key");
        return;
      }
      if (data.token) {
        localStorage.setItem("elzada_admin_token", data.token);
      }
      setSuccess(true);
      setTimeout(() => (window.location.href = "/admin"), 500);
    } catch {
      setError("Failed to verify key. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      {/* Subtle animated background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <div
          className="absolute -top-1/2 -right-1/2 w-[500px] h-[500px] rounded-full bg-gradient-to-br from-primary/10 via-transparent to-violet-500/10 blur-3xl animate-pulse-slow"
        />
        <div
          className="absolute -bottom-1/2 -left-1/2 w-[400px] h-[400px] rounded-full bg-gradient-to-tr from-violet-500/10 via-transparent to-primary/10 blur-3xl animate-pulse-slow delay-1000"
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full max-w-md z-10"
      >
        {/* Login Card */}
        <div className="rounded-2xl border border-white/10 bg-navy-900/80 backdrop-blur-xl shadow-2xl shadow-black/50 p-8 sm:p-10">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br from-primary to-violet-500 shadow-lg shadow-primary/25 mb-5">
              <Shield className="size-7 text-white" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              Admin Access
            </h1>
            <p className="text-slate-300 mt-2 text-base leading-relaxed">
              Enter your admin key to access the dashboard
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            {/* Error state */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-start gap-3 rounded-lg border border-red-500/30 bg-red-500/10 text-red-400 p-4"
                role="alert"
              >
                <AlertCircle className="size-5 shrink-0 mt-0.5" aria-hidden />
                <div className="min-w-0">
                  <p className="text-sm font-medium text-red-300">Invalid key</p>
                  <p className="text-sm text-red-400/80 mt-0.5">{error}</p>
                </div>
              </motion.div>
            )}

            {/* Success state */}
            {success && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-start gap-3 rounded-lg border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 p-4"
              >
                <CheckCircle className="size-5 shrink-0 mt-0.5" aria-hidden />
                <div className="min-w-0">
                  <p className="text-sm font-medium text-emerald-300">Access granted</p>
                  <p className="text-sm text-emerald-400/80 mt-0.5">
                    Redirecting to admin dashboard…
                  </p>
                </div>
              </motion.div>
            )}

            {/* Input Field */}
            <Field
              label="Admin Key"
              htmlFor="admin-key"
              hint="Enter the ADMIN_DASHBOARD_KEY from your environment configuration"
            >
              <Input
                id="admin-key"
                type="password"
                autoComplete="off"
                value={key}
                onChange={(e) => setKey(e.target.value)}
                placeholder="•••••••••••••••"
                disabled={loading || success}
                className={cn(
                  error && "border-red-500/50 focus:border-red-500 focus:ring-red-500/20"
                )}
                aria-invalid={Boolean(error)}
                aria-describedby={error ? "admin-key-error" : undefined}
              />
            </Field>

            {/* Submit Button */}
            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full"
              loading={loading}
              disabled={success}
            >
              {loading ? (
                <>
                  <Loader2 className="size-4 animate-spin mr-2" aria-hidden />
                  Verifying…
                </>
              ) : (
                "Enter Dashboard"
              )}
            </Button>
          </form>

          {/* Back link */}
          <div className="mt-6 text-center">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-primary transition-colors"
            >
              <ArrowLeft className="size-4" aria-hidden />
              Back to public site
            </Link>
          </div>
        </div>

        {/* Footer note */}
        <p className="mt-6 text-center text-xs text-slate-500/60">
          Secured by admin key authentication
        </p>
      </motion.div>
    </div>
  );
}