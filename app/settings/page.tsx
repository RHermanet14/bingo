import { useEffect, useState } from "react"
import {cookies} from 'next/headers'

export default function Settings() {
    const [theme, setTheme] = useState<boolean>(false)
    const [username, setUsername] = useState<string>("");
    useEffect(() => {
        const loadCookies = async() => {
            const cookieStore = await cookies();
            const cookieTheme = cookieStore.get('theme')?.value;
            console.log('Converting string to boolean? =', Boolean(cookieTheme));
            setTheme(Boolean(cookieTheme));
            const cookieName = cookieStore.get('username')?.value;
            setUsername(cookieName ?? "");
        }
        loadCookies();
    })
    const saveChanges = async() => {
        const cookieStore = await cookies();
        cookieStore.set('username', username);
        cookieStore.set('theme', theme.toString());
    }
    return (
        <div>
            <button>Back to Browser</button>
            <div className="flex items-center">
                <p>Theme</p>
                <button onClick={() => setTheme(theme)}>{theme ? "Light" : "Dark"}</button>
                <p>Change Username</p>
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