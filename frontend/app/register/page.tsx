"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowRight, Loader2, Check } from "lucide-react";
import { motion } from "framer-motion";

export default function RegisterPage() {
  const router = useRouter();
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      
      const payload = {
        fullname,
        email,
        password,
      };

      const response = await fetch(`${baseUrl}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.detail || "Registration sequence failed");
      }

      setSuccess(true);
      setTimeout(() => {
        router.push("/login");
      }, 2000);
      
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-background selection:bg-primary selection:text-primary-foreground font-sans">
      
      {/* Left Graphic Section (Swapped side compared to login) */}
      <div className="hidden lg:flex flex-1 bg-foreground text-background relative border-r-[2px] border-foreground overflow-hidden">
        {/* Subtle grid pattern overlay for completely dark sections */}
        <div className="absolute inset-0 opacity-20 pointer-events-none" style={{
            backgroundImage: "linear-gradient(to right, #F8F5EE 1px, transparent 1px), linear-gradient(to bottom, #F8F5EE 1px, transparent 1px)",
            backgroundSize: "60px 60px"
        }} />
        
        <div className="m-12 border-[2px] border-background/20 w-full flex flex-col justify-between p-12 relative z-10 bg-foreground/80 backdrop-blur-sm">
          <div className="flex gap-4">
             <span className="text-xs font-bold uppercase tracking-widest text-primary">System Enrollment</span>
             <div className="h-[2px] w-12 bg-primary self-center" />
          </div>

          <div className="max-w-xl">
            <h2 className="text-6xl xl:text-7xl font-heading font-black leading-none mb-8 text-background">
              Encode <span className="text-primary italic font-light">Identity</span>
            </h2>
            <p className="text-xl text-background/80 font-sans leading-relaxed">
              Initialize a secure organizational profile. Access unprecedented computational resources for proposal generation and discovery.
            </p>
          </div>

          {/* Decorative architecture pattern */}
          <div className="flex gap-2 self-start opacity-70">
            {[1, 2, 3, 4, 5].map((i) => (
              <div 
                key={i} 
                className="w-1 h-12 bg-primary transform" 
                style={{ height: `${20 + i * 15}px`, opacity: 1 - i * 0.15 }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Right Form Section */}
      <div className="flex-1 flex flex-col px-4 py-12 overflow-y-auto sm:px-12 lg:flex-none lg:w-1/2 lg:px-24 bg-grid-pattern relative">
        <div className="w-full max-w-sm mx-auto lg:w-96 my-auto py-8">
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Link href="/" className="flex items-center gap-3 mb-16 hover:opacity-80 transition-opacity w-fit">
              <div className="h-4 w-4 bg-primary" />
              <span className="font-heading font-black text-sm uppercase tracking-widest text-foreground">Grant Toolkit</span>
            </Link>

            <h1 className="text-4xl sm:text-5xl font-heading font-black leading-tight text-foreground mb-4">
              Initialize<br />Profile.
            </h1>
            <p className="text-secondary font-sans text-sm mb-8 leading-relaxed max-w-sm">
              Establish your credentials within the framework. All fields are rigorously required.
            </p>

            {success ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="border-[2px] border-primary p-8 bg-primary/5 text-center"
              >
                <div className="w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto mb-6">
                  <Check className="h-8 w-8" />
                </div>
                <h3 className="font-heading font-black text-2xl mb-2 text-foreground">Record Established</h3>
                <p className="text-secondary text-sm">Redirecting to authentication portal...</p>
              </motion.div>
            ) : (
              <form onSubmit={handleRegister} className="space-y-6">
                {error && (
                  <div className="border-[2px] border-destructive p-4 bg-destructive/10 text-destructive text-sm font-bold tracking-wide uppercase">
                    Error: {error}
                  </div>
                )}
                
                <div className="space-y-4">
                  <div className="group">
                    <label className="block text-xs font-bold uppercase tracking-widest text-foreground mb-2">
                      Full Designation
                    </label>
                    <input
                      type="text"
                      required
                      value={fullname}
                      onChange={(e) => setFullname(e.target.value)}
                      className="w-full px-4 h-12 border-[2px] border-foreground bg-transparent text-foreground placeholder:text-foreground/40 focus:outline-none focus:border-primary transition-colors rounded-none"
                      placeholder="Jane Doe"
                    />
                  </div>

                  <div className="group">
                    <label className="block text-xs font-bold uppercase tracking-widest text-foreground mb-2">
                      Email Address
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
                      minLength={6}
                    />
                  </div>
                </div>

                <div className="pt-4">
                  <Button 
                    type="submit" 
                    disabled={isLoading}
                    className="w-full h-14 rounded-none text-sm font-bold uppercase tracking-widest bg-primary text-primary-foreground hover:bg-foreground hover:text-background transition-all shadow-[6px_6px_0px_0px_rgba(19,42,27,1)] active:shadow-none active:translate-x-[6px] active:translate-y-[6px]"
                  >
                    {isLoading ? <Loader2 className="animate-spin h-5 w-5" /> : "Commit Record"}
                    {!isLoading && <ArrowRight className="ml-2 h-5 w-5" />}
                  </Button>
                </div>
              </form>
            )}

            {!success && (
              <div className="mt-10 pt-6 border-t-[2px] border-foreground/20">
                <p className="text-sm text-secondary">
                  Credentials exist?{" "}
                  <Link href="/login" className="font-bold underline decoration-primary decoration-2 underline-offset-4 text-foreground hover:text-primary transition-colors">
                    Access System
                  </Link>
                </p>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
