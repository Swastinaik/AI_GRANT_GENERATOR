"use client"
import React ,{use, useState} from 'react'

import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import { z } from "zod"
import { useRouter } from 'next/navigation'

import { BackgroundGradient } from "@/components/ui/background-gradient";
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  InputGroupTextarea,
} from "@/components/ui/input-group"
import useAuthStore from '@/app/store/AuthStore'
import Link from 'next/link'

const formSchema = z.object({
  email: z.string().email("Invalid Email"),
  password: z.string().min(2, {
    message: "password must be at least 2 characters.",
  }),
})

export default function ProfileForm() {
  const setAccessToken = useAuthStore((state)=>state.setAccessToken)
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  
    const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })
  
  function displayToast(errorMEssage: string){
    toast.error(errorMEssage)
  }
  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsLoading(true);
      const formData = new URLSearchParams()
      formData.append("username", values.email)
      formData.append("password", values.password)
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
        method: 'POST',
        body: formData,
        credentials: 'include',
        })
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Login failed');
      }
      const data = await response.json();
      console.log("Access Token:", data.access_token);
      setAccessToken(data.access_token);
      router.push('/me');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
      displayToast(errorMessage);
    }
    finally{
      setIsLoading(false);
    }
   
    
  }
 
  return (
    <div className='min-h-screen flex justify-center items-center'>
    <BackgroundGradient className='w-96 sm:max-w-md"'>
    <Card className="w-full sm:max-w-md">
      <h2 className='text-2xl text-center font-semibold'>Sign In</h2>
      <CardContent>
        <form id="form-rhf-demo" onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
             <Controller
              name="email"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="email">
                    Email
                  </FieldLabel>
                  <Input
                    {...field}
                    id="email"
                    aria-invalid={fieldState.invalid}
                    placeholder="Enter your email"
                    autoComplete="off"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="password"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="password">
                    Password
                  </FieldLabel>
                  <Input
                    {...field}
                    id="password"
                    aria-invalid={fieldState.invalid}
                    placeholder="Enter your password"
                    autoComplete="off"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            </FieldGroup>
        </form>
      </CardContent>
      <CardFooter className='flex items-center justify-center'>
       
          <Button type="submit" form="form-rhf-demo" className="w-full" disabled={isLoading}>
            {isLoading ? 'Signing In...' : 'Sign In'}
          </Button>
   
      </CardFooter>
       <CardDescription className='text-center'>
          Already have an account? <Link href="/register" className='text-blue-500 hover:underline'>Sign Up</Link>
        </CardDescription>
    </Card>
    </BackgroundGradient>
    </div>
  )
}

