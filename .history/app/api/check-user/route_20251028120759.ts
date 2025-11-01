import { prisma } from "@/lib/db";
import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET(){
    try {
        const user = await currentUser()
      if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    let existingUser  = await prisma.user.findUnique({
        where: {clerkUserId:user.id}

    })

    if(!existingUser){
      existingUser=  await prisma.user.create({
            data:{
            clerkUserId: user.id,
          name: `${user.firstName || ""} ${user.lastName || ""}`.trim(),
          email: user.emailAddresses[0]?.emailAddress ?? "",
          imageUrl: user.imageUrl,    
            }
        })
    }
      return NextResponse.json({user : {
     id: existingUser.id,
      name: existingUser.name,
      email: existingUser.email,
      imageUrl: existingUser.imageUrl,
      createdAt: existingUser.createdAt,   
      }});
    } catch (error) {
      console.error(error);
       return NextResponse.json({ error: "Internal server error" }, { status: 500 });

    }
}