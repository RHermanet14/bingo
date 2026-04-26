import { supabase } from "@/lib/supabase";
export async function POST(req: Request) {
    const {id, password} = await req.json();
    const {data} = await supabase
        .from("rooms")
        .select("password")
        .eq("id", id)
        .single();
    return Response.json({valid: data?.password === password});
}

export async function PUT(req: Request) {
    const {id, amount} = await req.json();
    const {error} = await supabase
        .rpc('increment', {row_id: id, amount: amount});
    return Response.json({error});
}