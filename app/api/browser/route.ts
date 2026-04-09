import {supabase} from "@/lib/supabase";
import {cookies} from "next/headers";

export async function POST() {
    const username = (await (cookies())).get("username")?.value || "unknown";

    const id = crypto.randomUUID();
    await supabase.from("rooms").insert({
        id, host: username, type: 'Public',
    });
    return Response.json({id});
}

export async function GET(){
    const {data} = await supabase.from("rooms").select("*");
    return Response.json({data});
}