// export const runtime = "nodejs";

import { prisma } from "@/lib/db";
import { currentUser } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    // Get current user
    const user = await currentUser();
    
    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" }, 
        { status: 401 }
      );
    }

    console.log("Fetching records for user:", user.id); // Debug log

    // Fetch records
    const records = await prisma.record.findMany({
      where: { userId: user.id },
      orderBy: { date: 'desc' }
    });

    console.log("Found records:", records.length); // Debug log

    return NextResponse.json({
      message: 'Records fetched successfully',
      records
    }, { status: 200 });

  } catch (error) {
    console.error('Error fetching records:', error);
    
    // Return more detailed error in development
    return NextResponse.json({
      error: 'Failed to fetch records',
      details: process.env.NODE_ENV === 'development' ? String(error) : undefined
    }, { status: 500 });
  }
}