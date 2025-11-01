// export const runtime = "nodejs";

import { prisma } from "@/lib/db";
import { currentUser } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const { description, date, category, amount } = await request.json();

    const record = await prisma.record.create({
      data: {
        text: description,
        date: new Date(date),
        category,
        amount: parseFloat(amount),
        userId: user.id,
      },
    });

    return NextResponse.json(
      {
        message: "Record added successfully",
        record,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("🔴 Error adding record:", error);

    // طباعة التفاصيل ضمن الرد
    return NextResponse.json(
      {
        error: "Failed to add record",
        message: error.message || "Unknown error",
        stack: error.stack || null, // تفاصيل أكثر إذا بدك
      },
      { status: 500 }
    );
  }
}
