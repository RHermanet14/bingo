import {supabase} from "@/lib/supabase";

export async function POST(req: Request) {
    const {host} = await req.json();

    const id = crypto.randomUUID();
    await supabase.from("rooms").insert({
        id, host,
    });
    return Response.json({id});
}