import {supabase} from "@/lib/supabase";
import {cookies} from "next/headers";

export async function POST(req: Request) {
    const {password} = await req.json();
    const username = (await (cookies())).get("username")?.value || "unknown";
    const id = crypto.randomUUID();
    
    if (password === null || password.trim().length === 0) {
        await supabase.from("rooms").insert({
            id, host: username, type: 'Public',
        });
    } else {
        await supabase.from("rooms").insert({
            id, host: username, type: 'Private', password: password,
        });
    }

    return Response.json({id});
}

export async function GET(){
    const {data} = await supabase.from("rooms").select("*");
    return Response.json({data});
}