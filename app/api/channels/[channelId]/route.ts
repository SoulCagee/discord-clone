import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { MemberRole } from "@/lib/generated/prisma";
import { NextResponse } from "next/server";

export async function DELETE(req:Request , { params } : { params : Promise<{ channelId: string }> }) {
    try{
        const profile = await currentProfile();
        const { searchParams } = new URL(req.url);

        const serverId = searchParams.get('serverId')
        if(!profile){
            return new NextResponse('Unauthorized' , { status : 401})
        }

        if(!serverId){
            return new NextResponse('Server ID missing' , { status : 400})
        }

        const { channelId } = await params

        if(!channelId){
            return new NextResponse('Channel ID missing' , { status : 400})
        }
        const deletedChannel = await db.channel.delete({
            where: {
                id: channelId,
                // 确保用户有权限：要么是频道创建者，要么是服务器管理员
                OR: [
                {
                    profileId: profile.id, // 频道创建者
                },
                {
                    server: {
                    members: {
                        some: {
                        profileId: profile.id,
                        role: {
                            in: ["ADMIN", "MODERATOR"],
                        },
                        },
                    },
                    },
                },
                ],
            },
            });
        return NextResponse.json(deletedChannel)

    }catch(error){
        console.log('[CHANNEL_ID_DELETE]' , error)
        return new NextResponse('Internal Error' , { status : 500 })
    }
}

export async function PATCH(req:Request ,{ params }: { params: Promise<{ channelId: string }> }) {
    try{
        const profile = await currentProfile();
        const { name , type } = await req.json()
        const { searchParams } = new URL(req.url);

        const serverId = searchParams.get('serverId')
        if(!profile){
            return new NextResponse('Unauthorized' , { status : 401})
        }

        if(!serverId){
            return new NextResponse('Server ID missing' , { status : 400})
        }

        const { channelId } = await params

        if(!channelId){
            return new NextResponse('Channel ID missing' , { status : 400})
        }

        if(name === 'general'){
            return new NextResponse('Name cannot be "general"' , { status : 400})
        }


        const server = await db.server.update({
            where :{
                id : serverId ,
                members :{
                    some :{
                        profileId : profile.id,
                        role :{
                            in : [ MemberRole.ADMIN , MemberRole.MODERATOR ]
                        }
                    }
                }
            },
            data :{
                channels :{
                    update :{
                        where :{
                            id : channelId,
                            NOT :{
                                name : 'general'
                            }
                        },
                        data :{
                            name , type
                        }
                    }
                }
            }
        })
            
        return NextResponse.json(server)

    }catch(error){
        console.log('[CHANNEL_ID_PATCH]' , error)
        return new NextResponse('Internal Error' , { status : 500 })
    }
}