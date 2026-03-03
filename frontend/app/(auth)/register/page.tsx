"use client"
import React, { useState } from 'react'
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"

const formSchema = z.object({
  username: z.string().min(2, { message: "Username must be at least 2 characters." }),
  email: z.string().email("Invalid email address"),
  password: z.string().min(2, { message: "Password must be at least 2 characters." }),
})

export default function ProfileForm() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { username: "", email: "", password: "" },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsLoading(true)
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      })
      if (response.ok) {
        router.push('/login')
      } else {
        toast.error('Registration failed. Please try again.')
      }
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
      <div className="flex w-full flex-col justify-center px-6 lg:w-[45%] lg:px-20 xl:px-24 overflow-y-auto py-12 lg:py-0">
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
              Create an account
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Sign up to start accelerating your grant proposals today.
            </p>
          </div>

          <div className="mt-8">
            <form id="register-form" onSubmit={form.handleSubmit(onSubmit)} noValidate>
              <FieldGroup className="space-y-2">
                <Controller
                  name="username"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid} className="space-y-1">
                      <FieldLabel htmlFor="reg-username" className="text-sm font-medium leading-none text-foreground">
                        Username
                      </FieldLabel>
                      <Input
                        {...field}
                        id="reg-username"
                        aria-invalid={fieldState.invalid}
                        placeholder="johndoe"
                        autoComplete="username"
                        className="h-11 shadow-sm"
                      />
                      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </Field>
                  )}
                />

                <Controller
                  name="email"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid} className="space-y-1">
                      <FieldLabel htmlFor="reg-email" className="text-sm font-medium leading-none text-foreground">
                        Email address
                      </FieldLabel>
                      <Input
                        {...field}
                        id="reg-email"
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
                      <FieldLabel htmlFor="reg-password" className="text-sm font-medium leading-none text-foreground">
                        Password
                      </FieldLabel>
                      <Input
                        {...field}
                        id="reg-password"
                        type="password"
                        aria-invalid={fieldState.invalid}
                        placeholder="••••••••"
                        autoComplete="new-password"
                        className="h-11 shadow-sm"
                      />
                      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </Field>
                  )}
                />
              </FieldGroup>

              <div className="mt-8">
                <button
                  id="register-submit-btn"
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
                      Creating account...
                    </>
                  ) : 'Create account'}
                </button>
              </div>
            </form>

            <p className="mt-8 text-center text-sm text-muted-foreground">
              Already have an account?{' '}
              <Link href="/login" className="font-semibold text-primary hover:underline">
                Sign in
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
              <span className="flex h-2 w-2 rounded-full bg-emerald-500 mr-2"></span>
              Secure & Reliable
            </div>

            <h2 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl mb-6">
              Join the future of research funding.
            </h2>
            <p className="text-lg text-zinc-400 mb-10 leading-relaxed">
              Access powerful tools to discover grants, draft winning proposals, and hit your funding goals with intelligent automation and world-class features.
            </p>

            <div className="grid grid-cols-2 gap-8 border-t border-zinc-800 pt-8 mt-4">
              <div>
                <h3 className="text-3xl font-bold text-white mb-2">3x</h3>
                <p className="text-sm text-zinc-400">Faster proposal creation on average.</p>
              </div>
              <div>
                <h3 className="text-3xl font-bold text-white mb-2">99%</h3>
                <p className="text-sm text-zinc-400">Customer satisfaction score worldwide.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}