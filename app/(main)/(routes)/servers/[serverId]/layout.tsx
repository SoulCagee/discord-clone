import ServerSidebar from "@/components/server/server-sidebar";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";

const ServerIdLayout = async ({
    children ,
    params
}:{
    children:React.ReactNode;
    params : {serverId : string}
}) =>{

    const profile = await currentProfile();

    // 关键修改：使用 await 解包 params
    const { serverId } = await params;
    
    // 现在可以安全地使用 serverId
    if (!serverId) {
        return redirect('/');
    }


    const server = await db.server.findUnique({
            where : {
                id : serverId ? serverId : '' ,
                members : {
                    some : {
                        profileId : profile?.id
                    }
                }
            }
        })

    if(!server){
        return redirect('/')
    }

    return (
        <div className="h-full flex">
            <div className=" md:flex h-full w-60 z-20 flex-col inset-y-0 max-md:hidden">
                <ServerSidebar 
                    serverId = {serverId}
                />
            </div>
            <main className="h-full w-full">

                {children}
            </main>
        </div>
    )
}

export default ServerIdLayout