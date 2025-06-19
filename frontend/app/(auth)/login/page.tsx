"use client"
import React ,{useState} from 'react'

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { BackgroundGradient } from '@/components/ui/background-gradient'
import { BackgroundLines } from '@/components/ui/background-lines'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import AuthStore from '@/app/store/AuthStore'
import Link from 'next/link'

const formSchema = z.object({
  email: z.string().min(2, {
    message: "Email must be at least 2 characters.",
  }),
  password: z.string().min(2, {
    message: "password must be at least 2 characters.",
  }),
})

export default function ProfileForm() {
  const router = useRouter();
  const { login } = AuthStore.getState()
  const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      
      email: "",
      password: "",
    },
  })
 
  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    try {
      const response = await login(values);
      if(response.success !== true){
        throw new Error("Erro while login")
      }
      console.log('Login successful:');
      router.push('/generate-grant')
    }catch(error){
      console.log(error)
      setError(error instanceof Error ? error.message : 'An unexpected error occurred');
    }
    finally{
      setLoading(false);
    }
  }
 
  return (
    <Form {...form} >
      
      <div  className='flex justify-center items-center h-screen bg-black' >
        <BackgroundLines className='flex flex-col justify-center items-center h-full w-full bg-black'>
        <BackgroundGradient >
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-5  p-6 rounded-2xl bg-black-100 w-96 h-96">
        <h1 className='text-3xl font-bold text-white text-center'>Login</h1>
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="Enter your Email" {...field}  className='w-full'/>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input placeholder="Enter your password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {error && <p className='text-red-500 text-center'>{error}</p>
        }
        <Button className='cursor-pointer bg-black-50' type="submit">{loading ? "Loading..." : "Login"}</Button>
        <p className=' flex justify-center items-center gap-8 text-sm text-white'>Don't have an account <Link href="/register" className=' text-sm text-blue-700 h-0 w-0'>Register</Link></p>
      </form>
     </BackgroundGradient>
     </BackgroundLines>
      </div>
    </Form>
  )
}

