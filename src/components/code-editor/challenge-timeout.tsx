"use client"

import { useEffect, useState } from "react"
import { Button } from "../ui/button"

interface ChallengeTimeOutProps {
    challengeId: string,
    estimatedTime: number
}

const formatTime = (n: number) => {
    if(n < 60) return `${n}s`
    const min = Math.floor(n/60)
    if(min < 60) return `${min}m:${n%60}s`
    const hour = Math.floor(n/3600)
    return `${hour}h:${Math.floor(n%3600)}m`
}

export default function ChallengeTimeOut(props: ChallengeTimeOutProps){
    const [count, setCount] = useState(0)
    const isEnded = props.estimatedTime*60 <= count
    useEffect(() =>{
        if(isEnded) return
        const timer = setInterval(() => setCount(count+1), 1000)
        return () => clearInterval(timer)
    }, [count])


    return (
        <Button
        className={
            (props.estimatedTime - 5)*60 <= count ? "animate-pulse": "      "
        }
        variant={(props.estimatedTime - 5)*60 <= count ? "destructive": "outline"}>
            Spent time: {formatTime(count)}
        </Button>
    )
}