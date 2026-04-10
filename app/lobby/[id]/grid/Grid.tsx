"use client";
import { LobbyRow } from "./types";

interface GridProps {
    items: LobbyRow[];
    username?: string
}
export default function Grid({items, username}: GridProps) {
    return (
        <div className="grid grid-cols-1 border-t border-gray-300">
            {items.map((item, i) => (
                <div key={i} className="flex items-center p-4 bg-gray-100 justify-start gap-2 border-b border-gray-300">
                    <p className="grow font-semibold truncate text-center">
                        {item.username}
                        {item.username === username ? " (you)" : ""}
                    </p>
                    <button
                        onClick={() => alert(`kicking ${item.username}...`)}
                        className="bg-blue-400 rounded text-lg px-4 font-semibold">
                        Kick Player
                    </button>
                </div>
            ))}
        </div>
    );
}