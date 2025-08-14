"use client"
import { ComponentProps } from "react";
import { Button } from "../ui/button";
import { useSession } from "@/lib/auth-client";
import { Skeleton } from "../ui/skeleton";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";


export default function SessionButton(props: ComponentProps<typeof Button>){
    const {data: session, isPending, error} = useSession()
    const router = useRouter();

    if(isPending){
        return (
<Skeleton className={cn("h-10 w-24", props.className)} />
        )
    }


    if(error){
        return (
            <Button onClick={() => router.refresh()}>
                {props.children}
            </Button>
        )
    
    }

    if(session){
        return (
            <Button {...props} >
                {props.children}
            </Button>
        )
    }
    
    return (
        <Button {...props} onClick={(e) => {
            e.preventDefault()
            router.push("/auth/signin")
        }}>
            {props.children}
            
        </Button>
    )
}