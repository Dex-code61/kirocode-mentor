"use client"
import { ComponentProps } from "react";
import { Button } from "../ui/button";
import { useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";


export default function SessionButton2(props: ComponentProps<typeof Button>){
    const {data: session, isPending, error} = useSession()
    const router = useRouter()
    const {variant, onClick, ...rest} = props
    if(isPending) return <Button {...props} disabled />
    if(!session) return <Button {...props} />
    if(error) return <Button variant="destructive" {...rest} onClick={(e) => {
        e.preventDefault()
        router.refresh()
    }}  />

    return null
}