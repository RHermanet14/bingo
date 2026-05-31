"use client"
import { useEffect, useState } from "react"
import { loadVar, saveVar } from "@/lib/localVars";
import { useRouter } from "next/navigation";

export default function Settings() {
    const router = useRouter()
    const [theme, setTheme] = useState<string>("Light")
    const [username, setUsername] = useState<string>("");
    useEffect(() => {
        const loadCookies = async() => {
            setTheme(loadVar('theme'));
            setUsername(loadVar('username'));
        }
        loadCookies();
    }, [])
    const saveChanges = async() => {
        saveVar('username', username);
        saveVar('theme', theme.toString());
        window.alert('Changes successfully saved.');
    }

    return (
        <div className={`min-h-screen ${theme === "Light" ? "bg-amber-50" : "bg-gray-700"}`}>
            <button className="bg-blue-500 text-white rounded p-3 text-2xl" onClick={() => router.replace("/browser")}>Back to Browser</button>
            <div className="flex flex-col items-center gap-5 px-4 py-1 text-3xl">
                
                <div className="flex">
                    <p className="bg-orange-500 text-white px-4 py-1 rounded mr-5">Theme</p>
                    <button className="border-2 boarder-amber-500 bg-gray-400 text-amber-50 rounded px-4 py-1" onClick={() => setTheme('Dark')}>Dark</button>
                    <button className="border-2 border-black bg-amber-50 text-black rounded px-4 py-1" onClick={() => setTheme('Light')}>Light</button>
                </div>
                <div className="flex">
                    <p className="bg-orange-500 text-white px-4 py-1 rounded mr-5">Change Username</p>
                    <input
                        name="name"
                        placeholder="friendly_user123"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className={`border border-gray-400 rounded px-3 py-1 ${theme === "Light" ? "text-black" : "text-white"}`}
                    />
                </div>
                
                <button
                    onClick={saveChanges}
                    className="bg-blue-600 text-white rounded px-4 py-1 mt-5 hover:bg-blue-700"
                >
                    Save Changes
                </button>
            </div>
        </div>
    )
}