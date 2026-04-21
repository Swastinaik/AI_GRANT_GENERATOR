"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowRight, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const formData = new URLSearchParams();
      formData.append("username", email);
      formData.append("password", password);

      // Using environment variable or default local backend
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

      const response = await fetch(`${baseUrl}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: formData.toString(),
        credentials: "include",
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.detail || "Authentication sequence failed");
      }

      await response.json();
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-background selection:bg-primary selection:text-primary-foreground font-sans">
      {/* Left Form Section */}
      <div className="flex-1 flex flex-col px-4 py-12 overflow-y-auto sm:px-12 lg:flex-none lg:w-1/2 lg:px-24">
        <div className="w-full max-w-sm mx-auto lg:w-96 my-auto py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Link href="/" className="flex items-center gap-3 mb-16 hover:opacity-80 transition-opacity w-fit">
              <div className="h-4 w-4 bg-primary" />
              <span className="font-heading font-black text-sm uppercase tracking-widest text-foreground">Grant Toolkit</span>
            </Link>

            <h1 className="text-4xl sm:text-5xl font-heading font-black leading-tight text-foreground mb-4">
              System<br />Access.
            </h1>
            <p className="text-secondary font-sans text-sm mb-8 leading-relaxed max-w-sm">
              Please authenticate to enter the protected workspace. Authorized personnel only.
            </p>

            <form onSubmit={handleLogin} className="space-y-6">
              {error && (
                <div className="border-[2px] border-destructive p-4 bg-destructive/10 text-destructive text-sm font-bold tracking-wide uppercase">
                  Error: {error}
                </div>
              )}

              <div className="space-y-4">
                <div className="group">
                  <label className="block text-xs font-bold uppercase tracking-widest text-foreground mb-2">
                    Email Designation
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 h-12 border-[2px] border-foreground bg-transparent text-foreground placeholder:text-foreground/40 focus:outline-none focus:border-primary transition-colors rounded-none"
                    placeholder="user@institution.edu"
                  />
                </div>

                <div className="group">
                  <label className="block text-xs font-bold uppercase tracking-widest text-foreground mb-2">
                    Security Key
                  </label>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 h-12 border-[2px] border-foreground bg-transparent text-foreground placeholder:text-foreground/40 focus:outline-none focus:border-primary transition-colors rounded-none"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <div className="pt-4">
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-14 rounded-none text-sm font-bold uppercase tracking-widest bg-primary text-primary-foreground hover:bg-foreground hover:text-background transition-all shadow-[6px_6px_0px_0px_rgba(19,42,27,1)] active:shadow-none active:translate-x-[6px] active:translate-y-[6px]"
                >
                  {isLoading ? <Loader2 className="animate-spin h-5 w-5" /> : "Authenticate"}
                  {!isLoading && <ArrowRight className="ml-2 h-5 w-5" />}
                </Button>
              </div>
            </form>

            <div className="mt-10 pt-6 border-t-[2px] border-foreground/20">
              <p className="text-sm text-secondary">
                Missing credentials?{" "}
                <Link href="/register" className="font-bold underline decoration-primary decoration-2 underline-offset-4 text-foreground hover:text-primary transition-colors">
                  Initialize Registration
                </Link>
              </p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Right Graphic Section */}
      <div className="hidden lg:flex flex-1 bg-secondary text-secondary-foreground relative border-l-[2px] border-foreground overflow-hidden">
        {/* Subtle grid pattern overlay for dark sections */}
        <div className="absolute inset-0 opacity-20 pointer-events-none" style={{
          backgroundImage: "linear-gradient(to right, #F8F5EE 1px, transparent 1px), linear-gradient(to bottom, #F8F5EE 1px, transparent 1px)",
          backgroundSize: "60px 60px"
        }} />

        <div className="m-12 border-[2px] border-secondary-foreground/20 w-full flex flex-col justify-between p-12 relative z-10 bg-secondary/80 backdrop-blur-sm">
          <div className="w-16 h-16 border-[2px] border-primary flex items-center justify-center rounded-full self-end animate-[spin_20s_linear_infinite]">
            <div className="w-8 h-8 rounded-full border border-secondary-foreground/50 absolute" />
            <div className="w-2 h-2 bg-primary rounded-full absolute top-2" />
          </div>

          <div className="max-w-xl">
            <h2 className="text-6xl xl:text-7xl font-heading font-black leading-none mb-8 text-background">
              The <span className="text-primary italic font-light">Calculus</span><br />of Validation
            </h2>
            <p className="text-xl text-background/80 font-sans leading-relaxed">
              Every authorized entry strengthens the underlying dataset. We employ zero-trust cryptographic protocols to secure foundation data.
            </p>
          </div>

          <div className="flex gap-4">
            <div className="h-[2px] w-12 bg-primary self-center" />
            <span className="text-xs font-bold uppercase tracking-widest text-primary">Secure Channel Active</span>
          </div>
        </div>
      </div>
    </div>
  );
}
