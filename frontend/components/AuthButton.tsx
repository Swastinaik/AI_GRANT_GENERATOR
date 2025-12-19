"use client"
import { useEffect } from "react"
import useAuthStore from '@/app/store/AuthStore';
import Link from "next/link";
import { Button } from "./ui/button";
export const AuthButton = () => {
    const accessToken = useAuthStore((state) => state.accessToken)
    const setAccessToken = useAuthStore((state) => state.setAccessToken)

    useEffect(() => {
        if (accessToken) return;

        const refreshToken = async () => {
            try {
                const res = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL ?? "api"}/auth/refresh`,
                    {
                        method: "POST",
                        credentials: "include",
                    }
                )

                if (!res.ok) {
                    setAccessToken(null)
                    return
                }

                const data = await res.json()
                setAccessToken(data.access_token)
            } catch (err) {
                console.error("Refresh token failed", err)
                setAccessToken(null)
            }
        }
        refreshToken()



    }, [accessToken, setAccessToken])

    return (
        <Link href={`${accessToken ? '/me' : '/login'}`} >
            <Button variant='secondary' >{accessToken ? 'Dashboard' : 'Login'}</Button>
        </Link>
    )
}