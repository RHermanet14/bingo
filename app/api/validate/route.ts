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
// checks if lobby password = user submitted password
// use later
