import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs/server";

import { db } from '@/lib/db'

export const initialProfile = async() =>{
     // 在服务端获取当前用户
    const user = await currentUser();

    // 如果用户未登录，使用 redirect 函数重定向到登录页
    if (!user) {
        redirect("/sign-in"); // 替换为您的登录页路径
    }

    // 用户已登录，继续查询或创建 profile
    const profile = await db.profile.findUnique({
        where: {
            userId: user.id
        }
    });

    if (profile) {
        return profile
    }

    const newProfile = await db.profile.create({
        data : {
            userId : user.id ,
            name : `${user.firstName} ${user.lastName}`,
            imageUrl : user.imageUrl,
            email : user.emailAddresses[0].emailAddress
        }
    })

    return newProfile
}