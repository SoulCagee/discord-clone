import ChatHeader from "@/components/chat/chat-header";
import { ChatInput } from "@/components/chat/chat-input";
import { ChatMessages } from "@/components/chat/chat-message";
import { MediaRoom } from "@/components/media-room";
import { getOrCreateConversation } from "@/lib/conversation";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";

interface MemberIdPageProps { 
    params : {
        memberId : string ;
        serverId : string
    },
    searchParams :{
        video? : boolean
    }
}

const MemberIdPage = async({
    params , searchParams
}:MemberIdPageProps) => {

    const profile = await currentProfile();

    if(!profile){
        return redirect('sign-in')
    }

    const { memberId , serverId } = await params

    const currenMember = await db.member.findFirst({
        where : {
            serverId ,
            profileId : profile.id
        },
        include : {
            profile : true
        }
    })

    if(!currenMember){
        return redirect('/')
    }

    const conversation = await getOrCreateConversation(currenMember.id , memberId )

    if(!conversation){
        return redirect(`/servers/${params.serverId}`)
    }

    const { memberOne , memberTwo } = conversation

    const otherMember = memberOne.profileId === profile.id ? memberTwo : memberOne

    const {video} = await searchParams

    return ( 
        <div className = 'bg-white dark:bg-[#313338] flex flex-col h-full'>
            <ChatHeader 
                imageUrl={otherMember.profile.imageUrl}
                name={otherMember.profile.name}
                serverId={serverId}
                type = 'conversation'
            />
            {video && (
                <MediaRoom 
                    chatId={conversation.id}
                    video={true}
                    audio={true}
                />
            )}
            {!video && (
                <>
                    <ChatMessages 
                        member={currenMember}
                        name={otherMember.profile.name}
                        chatId={conversation.id}
                        type='conversation'
                        apiUrl="/api/direct-messages"
                        paramKey="conversationId"
                        paramValue={conversation.id}
                        socketUrl="/api/socket/direct-messages"
                        socketQuery={{
                            conversationId : conversation.id
                        }}
                    />
                    <ChatInput 
                        name={otherMember.profile.name}
                        type='conversation'
                        apiUrl="/api/socket/direct-messages"
                        query={{
                            conversationId : conversation.id
                        }}
                    />
                </>
            )}
            
        </div>
     );
}
 
export default MemberIdPage;