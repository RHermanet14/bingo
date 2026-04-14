"use client";

import { useRouter } from "next/navigation";
import {useState} from "react"

export default function LobbyPage() {
    const router = useRouter();
    const [password, setPassword] = useState("");

    const createRoom = async () => {
        const res = await fetch("/api/browser", {
            method: "POST",
            body: JSON.stringify({password: password}),
        });
        const data = await res.json();
        router.replace(`/lobby/${data.id}`);
    }

    return (
        <div>
            <h1 className="text-center text-2xl p-1 bg-gray-400">Create room</h1>
            <button onClick={() => router.replace("/browser")} className="bg-blue-400 rounded">Back To Browser</button>
            <div className="min-h-screen gap-2 flex flex-col items-center justify-center">
                <p>{`Password (optional)`}</p>
                <input
                    name="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="border border-gray-400 rounded px-3 py-1"
                />
                <button className="bg-blue-400 rounded" onClick={createRoom}>Create room</button>
            </div>
            
        </div>
    )
}