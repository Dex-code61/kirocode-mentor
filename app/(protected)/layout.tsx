import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { Footer } from "@/components/layout/footer";
import { PropsWithChildren } from "react";



export default function ProtectedLayout(props: PropsWithChildren){
    return(
        <div className="w-full h-full flex flex-col">
            <DashboardHeader />
            {props.children}
            <Footer />
        </div>
    )
}