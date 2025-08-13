"use client"
import React ,{useState} from 'react'

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { ToastContainer, toast } from 'react-toastify';

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import useAuthStore from '@/app/store/AuthStore'
import { useRouter } from 'next/navigation'
import { BackgroundGradient } from '@/components/ui/background-gradient'
import { BackgroundLines } from '@/components/ui/background-lines'
import Link from 'next/link'

const formSchema = z.object({
  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  email: z.string().email("Invalid Email"),
  password: z.string().min(2, {
    message: "password must be at least 2 characters.",
  }),
})

 function ProfileForm() {
  const router = useRouter();
  const register = useAuthStore((s) => s.register);
  const isLoading = useAuthStore((s) => s.isLoading);
    const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  })
 
  function displayToast(error: any){
      toast.error(error)
    }

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const response = await register(values);
      if(response.success !== true){
        throw new Error("Error while registering...")
      }
      console.log(isLoading)
      router.push('/login')
    } catch (e) {
      const errorMEssgage = e instanceof Error ? e.message : "Error While registering"
       displayToast(errorMEssgage)
    } 
  }
 
  return (
    <Form {...form}>
      <div className='flex justify-center items-center h-screen bg-black'>
        <BackgroundLines className='flex flex-col justify-center items-center h-full w-full bg-black'>
                <BackgroundGradient >
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-5  p-6 rounded-2xl bg-black-100 w-96">
        <h1 className='text-2xl font-bold text-white text-center'>Sign Up</h1>
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="Enter your Username" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="Enter your Email" {...field} />
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
      
        <Button  className="cursor-pointer bg-black-50" type="submit">{isLoading ? "Loading..." : "Sign Up"}</Button>
        <p className=' flex justify-center items-center gap-6 text-sm text-white'>Already has an account <Link href="/login" className=' text-sm text-blue-700 h-0 w-0'>Login</Link></p>
      </form>
      </BackgroundGradient>
       </BackgroundLines>
      </div>
       <ToastContainer/> 
    </Form>
  )
}

export default ProfileForm