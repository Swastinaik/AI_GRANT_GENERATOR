"use client"
import React, { useState } from 'react'
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import { z } from "zod"
import { useRouter } from 'next/navigation'
import { FileText } from 'lucide-react'
import { toast } from "sonner"
import Link from 'next/link'
import useAuthStore from '@/app/store/AuthStore'
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"

const formSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(2, { message: "Password must be at least 2 characters." }),
})

export default function LoginPage() {
  const setAccessToken = useAuthStore((state) => state.setAccessToken)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: "", password: "" },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsLoading(true)
      const formData = new URLSearchParams()
      formData.append("username", values.email)
      formData.append("password", values.password)
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
        method: 'POST',
        body: formData,
        credentials: 'include',
      })
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.detail || 'Login failed')
      }
      const data = await response.json()
      setAccessToken(data.access_token)
      router.push('/me')
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'An unexpected error occurred'
      toast.error(msg)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen w-full bg-background">
      {/* Left Form Section */}
      <div className="flex w-full flex-col justify-center px-6 lg:w-[45%] lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm lg:max-w-md">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
              <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-3-3v6M3 12a9 9 0 1 0 18 0 9 9 0 0 0-18 0z" />
              </svg>
            </div>
            <span className="text-2xl font-bold tracking-tight text-foreground">Doc4All</span>
          </div>

          <div className="mt-10">
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              Sign in to your account
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Welcome back. Please enter your details to access your dashboard.
            </p>
          </div>

          <div className="mt-8">
            <form id="login-form" onSubmit={form.handleSubmit(onSubmit)} noValidate>
              <FieldGroup className="space-y-2">
                <Controller
                  name="email"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid} className="space-y-1">
                      <FieldLabel htmlFor="login-email" className="text-sm font-medium leading-none text-foreground">
                        Email address
                      </FieldLabel>
                      <Input
                        {...field}
                        id="login-email"
                        type="email"
                        aria-invalid={fieldState.invalid}
                        placeholder="name@example.com"
                        autoComplete="email"
                        className="h-11 shadow-sm"
                      />
                      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </Field>
                  )}
                />

                <Controller
                  name="password"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid} className="space-y-1">
                      <div className="flex items-center justify-between">
                        <FieldLabel htmlFor="login-password" className="text-sm font-medium leading-none text-foreground">
                          Password
                        </FieldLabel>
                      </div>
                      <Input
                        {...field}
                        id="login-password"
                        type="password"
                        aria-invalid={fieldState.invalid}
                        placeholder="••••••••"
                        autoComplete="current-password"
                        className="h-11 shadow-sm"
                      />
                      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </Field>
                  )}
                />
              </FieldGroup>

              <div className="mt-8">
                <button
                  id="login-submit-btn"
                  type="submit"
                  disabled={isLoading}
                  className="inline-flex h-11 w-full items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                >
                  {isLoading ? (
                    <>
                      <svg className="mr-2 h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                      </svg>
                      Signing in...
                    </>
                  ) : 'Sign in'}
                </button>
              </div>
            </form>

            <p className="mt-8 text-center text-sm text-muted-foreground">
              Don&apos;t have an account?{' '}
              <Link href="/register" className="font-semibold text-primary hover:underline">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Right Visual Section */}
      <div className="relative hidden w-0 flex-1 lg:flex flex-col bg-zinc-950">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none"></div>

        <div className="relative z-10 flex flex-col h-full justify-center px-12 lg:px-20 xl:px-24">
          <div className="max-w-xl">
            <div className="inline-flex items-center rounded-full border border-zinc-800 bg-zinc-900/50 px-3 py-1 text-sm font-medium text-zinc-300 backdrop-blur-sm mb-8">
              <span className="flex h-2 w-2 rounded-full bg-blue-500 mr-2"></span>
              Enterprise Grade Platform
            </div>

            <h2 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl mb-6">
              Streamline your grant lifecycle.
            </h2>
            <p className="text-lg text-zinc-400 mb-10 leading-relaxed">
              Accelerate proposal creation, manage applications, and secure funding faster with our AI-driven insights and enterprise-ready tools. Built for ambitious research teams.
            </p>

            <div className="flex items-center gap-4 border-t border-zinc-800 pt-8">
              <div className="flex -space-x-3">
                <div className="inline-flex h-10 w-10 rounded-full ring-2 ring-zinc-950 bg-zinc-800 flex items-center justify-center text-xs font-bold text-zinc-400">
                  <FileText className=" w-5 h-5" />
                </div>
              </div>
              <div className="text-sm font-medium text-zinc-400">
                Trusted by leading organizations
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
