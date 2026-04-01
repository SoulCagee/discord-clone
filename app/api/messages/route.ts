import { currentProfile } from "@/lib/current-profile"
import { db } from "@/lib/db";
import { Message } from "@/lib/generated/prisma";
import { NextResponse } from "next/server"

const MESSAGES_BATCH = 10

export async function GET(req : Request) {
    try{
        const profile = await currentProfile();
        const { searchParams } = new URL(req.url)

        const cursor = searchParams.get('cursor')
        const channelId = searchParams.get('channelId')

        if(!profile){
            return new NextResponse('Unauthorized' , { status : 401})
        }

        if(!channelId){
            return new NextResponse('Channel ID missing' , { status : 400})
        }

        let messages : Message[] = []

        if(cursor && cursor!='0'){
            // console.log('1')
            messages = await db.message.findMany({
                take : MESSAGES_BATCH ,
                skip : 1 ,
                cursor : {
                    id : cursor
                },
                where :{
                    channelId
                },
                include : {
                    member : {
                        include :{
                            profile : true 
                        }
                    }
                },
                orderBy : {
                    createdAt : 'desc'
                }
            })
        }else {
            // console.log('2')
            messages = await db.message.findMany({
                take : MESSAGES_BATCH ,
                where : {
                    channelId 
                },
                include : {
                    member : {
                        include : {
                            profile :true
                        }
                    }
                },
                orderBy : {
                    createdAt : 'desc'
                }
            })
        }

        let nextCursor = null ;

        // console.log('messages : ' + messages)
        
        if(messages.length === MESSAGES_BATCH){
            nextCursor = messages[MESSAGES_BATCH - 1].id ;
        }

        return NextResponse.json({
            items : messages ,
            nextCursor
        })
 
    }catch(error){
        console.log('[MESSAGES_GET]' , error)
        return new NextResponse('Internal Error' , {status : 500})
    }
}