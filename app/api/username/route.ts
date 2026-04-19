import {cookies} from "next/headers"
export async function GET() {
    const username = (await cookies()).get("username")?.value;
    return Response.json({username});
}