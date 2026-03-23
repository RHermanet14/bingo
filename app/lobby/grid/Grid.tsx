"use client";
import {LobbyRow} from "./types";

interface GridProps {
    items: LobbyRow[];
}
export default function Grid({items}: GridProps) {
    return (
        <div className="grid grid-cols-1 border-t border-gray-300">
            {items.map((item) => (
                <div key={item.id} className="flex items-center p-4 bg-gray-100 justify-start gap-2 border-b border-gray-300">
                    <p className="flex-grow font-semibold truncate text-center">
                        {item.name}
                    </p>
                    <button
                        onClick={() => alert(`kicking ${item.name}...`)}
                        className="bg-blue-400 rounded text-lg px-4 font-semibold">
                        Kick Player
                    </button>
                </div>
            ))}
        </div>
    );
}