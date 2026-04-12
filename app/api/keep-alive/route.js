import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";
import { createClient } from "@supabase/supabase-js";

export const dynamic = 'force-dynamic';

export async function GET(request) {
  // Optional: Verify Vercel Cron job using CRON_SECRET if it's set in your environment
  const authHeader = request.headers.get('authorization');
  if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // 1. Prisma Ping (Keeps the DB connection active)
    await db.car.findFirst({ select: { id: true } });
    
    // 2. Supabase REST API Ping (Forces Supabase's activity tracker to log it)
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    if (supabaseUrl && supabaseKey) {
      const supabase = createClient(supabaseUrl, supabaseKey);
      try {
        await supabase.from("Car").select("id").limit(1);
      } catch (e) {
        // We ignore if the table name is slightly different, hitting the API is all that matters.
        console.error("Supabase REST ping failed, but API was still hit:", e);
      }
    }
    
    return NextResponse.json({ message: "Database pinged via both Prisma and REST successfully. Supabase is awake!" }, { status: 200 });
  } catch (error) {
    console.error("Keep-alive database ping failed:", error);
    return NextResponse.json({ error: "Failed to ping database" }, { status: 500 });
  }
}
