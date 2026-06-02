import {supabase} from "@/lib/supabase"

export async function GET() {
    const seed = Math.floor(Math.random() * 1000000);
    const startTime = Date.now();
    return Response.json({seed, startTime});
}

export async function PUT(req: Request) {
    const {id} = await req.json();
    const {error} = await supabase.from("rooms").update({state: 'Finished'}).eq("id", id);
    return Response.json({error});
}