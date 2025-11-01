import { prisma } from "@/lib/db";
import { currentUser } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST (request: NextRequest){
    try {
      const user = await currentUser()
           if (!user) {
       return NextResponse.json({ error: "User not found" }, { status: 404 });
            }

       const {description, date, category, amount} = await request.json()  
       
       // Create new record 

      const record = await prisma.record.create({
        data:{
        text: description,        
        date: new Date(date),
        category,
        amount: parseFloat(amount),
        userId: user.id,     
        }

      }) 

         // Return success response

        return NextResponse.json({
         message: 'records added successfully',
        record 
        }  ,{ status: 201 } ) 
    } catch (error) {
      console.error('Error adding records:', error);
      
      return NextResponse.json({
        error: 'Failed to add records' ,
    
      }, { status: 500 })
    }
}


