"use client";
import { useRouter } from "next/navigation";
import {BrowserRow} from "./types";

interface GridProps {
    items: BrowserRow[];
}
export default function Grid({items}: GridProps) {
    const router = useRouter();
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
                        onClick={() => router.push(`/lobby/${item.id}`)}
                        className="bg-blue-400 rounded text-lg px-4 font-semibold">
                        Join
                    </button>
                </div>
            ))}
        </div>
    );
}