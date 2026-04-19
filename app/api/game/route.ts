//import {supabase} from "@/lib/supabase"
export async function GET() {
    const seed = Math.floor(Math.random() * 1000000);
    const startTime = Date.now();
    return Response.json({seed, startTime});
}