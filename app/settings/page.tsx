"use client"
import { useEffect, useState } from "react"
import { loadVar, saveVar } from "@/lib/localVars";
import { useRouter } from "next/navigation";

export default function Settings() {
    const router = useRouter()
    const [theme, setTheme] = useState<boolean>(false)
    const [username, setUsername] = useState<string>("");
    useEffect(() => {
        const loadCookies = async() => {
            setTheme(Boolean(loadVar('theme')));
            setUsername(loadVar('username'));
        }
        loadCookies();
    }, [])
    const saveChanges = async() => {
        saveVar('username', username);
        saveVar('theme', theme.toString());
    }
    return (
        <div>
            <button className="bg-blue-500 rounded p-3 text-2xl" onClick={() => router.replace("/browser")}>Back to Browser</button>
            <div className="flex flex-col items-center gap-5 px-4 py-1 text-3xl">
                <p className="bg-orange-500 px-4 py-1">Theme</p>
                <button className="bg-gray-800 text-amber-50 rounded px-4 py-1" onClick={() => setTheme(!theme)}>{theme ? "Light" : "Dark"}</button>
                <p className="bg-orange-500 px-4 py-1">Change Username</p>
                <input
                    name="name"
                    placeholder="friendly_user123"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="border border-gray-400 rounded px-3 py-1"
                />
                <button
                    onClick={saveChanges}
                    className="bg-blue-600 text-white rounded px-4 py-1 hover:bg-blue-700"
                >
                    Save
                </button>
            </div>
        </div>
    )
}