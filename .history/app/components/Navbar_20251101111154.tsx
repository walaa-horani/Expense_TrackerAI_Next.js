import { prisma } from "@/lib/db";
import { currentUser } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    // Get current user from Clerk
    const clerkUser = await currentUser();
    
    if (!clerkUser) {
      return NextResponse.json(
        { error: "Not authenticated" }, 
        { status: 401 }
      );
    }

    // Check if user exists in database
    let user = await prisma.user.findUnique({
      where: { clerkUserId: clerkUser.id }
    });

    // If user doesn't exist, create them
    if (!user) {
      user = await prisma.user.create({
        data: {
          clerkUserId: clerkUser.id,
          email: clerkUser.emailAddresses[0]?.emailAddress || '',
          name: `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim(),
        }
      });
      
      console.log("New user created:", user.id);
    }

    return NextResponse.json({
      message: 'User check successful',
      user
    }, { status: 200 });

  } catch (error) {
    console.error('Error in check-user:', error);
    
    return NextResponse.json({
      error: 'Failed to check/create user',
      details: process.env.NODE_ENV === 'development' ? String(error) : undefined
    }, { status: 500 });
  }
}
```

## 7. Get the correct Neon connection strings

In your Neon dashboard:

1. Go to your project
2. Click **Connection Details**
3. Copy **both**:
   - `DATABASE_URL` (for Prisma Migrate)
   - `DIRECT_URL` (for Prisma Client)

Add to Vercel:
```
DATABASE_URL=postgresql://user:pass@host/db?sslmode=require&pgbouncer=true
DIRECT_URL=postgresql://user:pass@host/db?sslmode=require