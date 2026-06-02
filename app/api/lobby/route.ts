import {supabase} from "@/lib/supabase"
export async function PUT(req: Request) {
    const {id, settings} = await req.json();
    const {error} = await supabase.from("rooms").update({settings: settings, state: 'Started'}).eq("id", id);
    return Response.json({error});
}

export async function GET(req: Request) {
    const {id} = await req.json();
    const{data} = await supabase.from("rooms").select("settings").eq("id", id).single();
    return Response.json({data});
}

export async function POST(req: Request) {
    const {id} = await req.json();
    const {data} = await supabase.from("rooms").select("settings").eq("id", id).single();
    return Response.json(data);
}

export async function DELETE(req: Request) {
    const {id} = await req.json();
    const {error} = await supabase.from("rooms").delete().eq("id", id);
    return Response.json({error});
}