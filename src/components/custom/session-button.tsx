"use client"
import { ComponentProps } from "react";
import { Button } from "../ui/button";
import { useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";


export default function SessionButton(props: ComponentProps<typeof Button>){
    const {data: session, isPending, error} = useSession()
    const router = useRouter();

    const {onClick, ...rest} = props
    if(isPending) return <Button {...props} disabled />
    if(error) return <Button {...rest} onClick={(e) => {
        e.preventDefault()
        router.refresh()
    }} />
    if(session) return <Button {...props} />
    return <Button {...rest} onClick={(e) => {
            e.preventDefault()
            router.push("/auth/signin")
        }} />
}