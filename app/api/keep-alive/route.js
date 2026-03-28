import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";

export const dynamic = 'force-dynamic';

export async function GET(request) {
  // Optional: Verify Vercel Cron job using CRON_SECRET if it's set in your environment
  const authHeader = request.headers.get('authorization');
  if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Ping the database by requesting a single lightweight record
    await db.car.findFirst({ select: { id: true } });
    
    return NextResponse.json({ message: "Database pinged successfully. Supabase is awake!" }, { status: 200 });
  } catch (error) {
    console.error("Keep-alive database ping failed:", error);
    return NextResponse.json({ error: "Failed to ping database" }, { status: 500 });
  }
}
