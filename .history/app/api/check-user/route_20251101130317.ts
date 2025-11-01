export const runtime = "nodejs";

import { prisma } from "@/lib/db";
import { currentUser } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const clerkUser = await currentUser();
    
    if (!clerkUser) {
      return NextResponse.json(
        { error: "Not authenticated" }, 
        { status: 401 }
      );
    }

    // Check if user exists
    let user = await prisma.user.findUnique({
      where: { clerkUserId: clerkUser.id }
    });

    // Create user if doesn't exist
    if (!user) {
      user = await prisma.user.create({
        data: {
          clerkUserId: clerkUser.id,
          email: clerkUser.emailAddresses[0]?.emailAddress || '',
          name: `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim() || 'User',
        }
      });
    }

    return NextResponse.json({
      success: true,
      message: 'User check successful',
      user: {
        id: user.id,
        email: user.email,
        name: user.name
      }
    }, { status: 200 });

  } catch (error: any) {
    console.error('Error in check-user:', error);
    
    return NextResponse.json({
      error: 'Internal server error',
      message: error?.message || 'Unknown error'
    }, { status: 500 });
  }
}