"use client"
import { useTheme } from "next-themes";
import { Switch } from "@/components//ui/switch";
import { Label } from "@/components//ui/label";
import { useCallback } from "react";


export default function ThemeSwitcher({label=true}:{label?: boolean}){
    const { setTheme, theme } = useTheme()
    const handleChangeTheme = useCallback(() => {
        setTheme(theme === "light" ? "dark" : "light")
    }, [theme])
    return (
        <div className="flex items-center gap-2">
            <Switch checked={theme === "light"} onCheckedChange={handleChangeTheme}  />
            {label && <Label className="capitalize">{theme} </Label>}
        </div>
    )
}