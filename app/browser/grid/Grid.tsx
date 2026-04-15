"use client";
import { useRouter } from "next/navigation";
import {BrowserRow} from "./types";
import { useState } from "react";

interface GridProps {
    items: BrowserRow[];
}

function checkNeedPassword(type: string): boolean {
    return type === "Private";
}

export default function Grid({items}: GridProps) {
    const router = useRouter();
    const [needPassword, setNeedPassword] = useState<number>();
    const [password, setPassword] = useState("");
    const [invalid, setInvalid] = useState(false);

    const onJoinButtonClick = (item: BrowserRow) => {
        const check: boolean = checkNeedPassword(item.type);
        if (!check) {
            router.push(`/lobby/${item.id}`);
        } else {
            setNeedPassword(item.id);
        }
    }

    const checkPassword = async() => {
        const res = await fetch("api/validate", {
            method: "POST",
            body: JSON.stringify({id:needPassword, password: password}),
        });
        const data = await res.json();
        if (data.valid) {
            setInvalid(false);
            router.push(`/lobby/${needPassword}`);
        } else {
            setInvalid(true);
        }
    }

    if (needPassword) {
        return (
            <div>
                <button className="rounded bg-blue-400" onClick={() => setNeedPassword(undefined)}>Back</button>
                <div className="min-h-screen gap-2 flex flex-col items-center justify-center">
                    <h1>Enter Lobby Password</h1>
                    <input
                        name="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="border border-gray-400 rounded px-3 py-1"
                    />
                    <button className="bg-blue-400 rounded" onClick={checkPassword}>Submit</button>
                    {invalid ? <p>Error, Wrong Password</p> : null}
                </div>
                
            </div>
        );
    }
    return (
        <div className="grid grid-cols-1 border-t border-gray-300">
            {items.map((item) => (
                <div key={item.id} className="flex items-center p-4 bg-gray-100 justify-start gap-2 border-b border-gray-300">
                    <p className="grow font-semibold truncate text-center">
                        {item.host}
                    </p>
                    <p>{item.type}</p>
                    <div className="w-px h-6 bg-gray-300 mx-2"></div>
                    <p>{item.size}/30</p>
                    <div className="w-px h-6 bg-gray-300 mx-2"></div>
                    <button
                        onClick={() => onJoinButtonClick(item)}
                        className="bg-blue-400 rounded text-lg px-4 font-semibold">
                        Join
                    </button>
                </div>
            ))}
        </div>
    );
}