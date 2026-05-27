import {supabase} from "@/lib/supabase";
import {cookies} from "next/headers";
import { NextRequest } from "next/server";

export async function POST(req: Request) {
    const {password} = await req.json();
    const username = (await (cookies())).get("username")?.value || "unknown";
    const id = crypto.randomUUID();

    if (password === null || password.trim().length === 0) {
        await supabase.from("rooms").insert({
            id, host: username, type: 'Public', size: 0,
        });
    } else {
        await supabase.from("rooms").insert({
            id, host: username, type: 'Private', password: password, size: 0,
        });
    }

    return Response.json({id});
}

export async function GET(req: NextRequest){
    const params = req.nextUrl.searchParams
    const name = params.get('name');
    if (!name) {
        const {data} = await supabase.from("rooms").select("id, host, type, size").eq('state','Pending');
        return Response.json(data);
    } else {
        const {data} = await supabase.from("rooms").select("id, host, type, size").eq('state','Pending').eq('host', name);
        return Response.json(data);
    }
}

export async function PUT(req: Request) {
    const {id, host} = await req.json();
    const {data} = await supabase
        .from("rooms")
        .select("host")
        .eq("id", id)
        .single();
    return Response.json({valid: data?.host === host})     
}