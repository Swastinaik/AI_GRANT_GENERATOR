"use client"
import React ,{useState} from 'react'

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useRouter } from 'next/navigation'
import { ToastContainer, toast } from 'react-toastify';
import { Button } from "@/components/ui/button"
import { BackgroundGradient } from '@/components/ui/background-gradient'
import { BackgroundLines } from '@/components/ui/background-lines'
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
import Link from 'next/link'

const formSchema = z.object({
  email: z.string().email("Invalid Email"),
  password: z.string().min(2, {
    message: "password must be at least 2 characters.",
  }),
})

export default function ProfileForm() {
  const router = useRouter();
  const login = useAuthStore((s)=>(s.login))
  const isLoading = useAuthStore((s)=> (s.isLoading))
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
      const response = await login(values);
      if(response.success !== true){
        throw new Error("Error while login")
      }
      router.push('/main')
    }catch(error){
      const errorMEssage = error instanceof Error ? error.message : 'An unexpected error occurred'
      displayToast(errorMEssage)
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
       
        <Button className='cursor-pointer bg-black-50' type="submit">{isLoading ? "Loading..." : "Login"}</Button>
        <p className=' flex justify-center items-center gap-8 text-sm text-white'>Don't have an account <Link href="/register" className=' text-sm text-blue-700 h-0 w-0'>Register</Link></p>
      </form>
     </BackgroundGradient>
     </BackgroundLines>
      </div>
     
       <ToastContainer/> 
    </Form>
  )
}

