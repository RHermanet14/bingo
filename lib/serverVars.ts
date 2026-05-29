import { cookies } from "next/headers";

export async function loadCookie(cookieName: string): Promise<string> {
    const cookieStore = await cookies();
    return cookieStore.get(cookieName)?.value ?? "Error: cookie not found";
}

export async function saveCookie(cookieName:string, cookieValue: string) {
    const cookieStore = await cookies();
    cookieStore.set(cookieName, cookieValue);
}