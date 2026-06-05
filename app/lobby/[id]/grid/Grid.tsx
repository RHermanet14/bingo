"use client";
import { useEffect, useRef } from "react";
import { LobbyRow } from "./types";
import { getChannel } from "@/lib/channelManager";
import { RealtimeChannel } from "@supabase/supabase-js";
import { getuserId } from "@/lib/localVars";

interface GridProps {
    items: LobbyRow[];
    isHost: boolean;
}

export default function Grid({items, isHost}: GridProps) {
    const userId = getuserId();
    const channelRef = useRef<RealtimeChannel>(null);
    useEffect(() => {
        const channel = getChannel();
        channelRef.current = channel;
    })
    const kick_player = (userId: string) => {
        if (channelRef.current === null) {
            console.log("Error: channelRef.current is null when kick_player is called.");
            return;
        }
        channelRef.current.send({
            type:"broadcast",
            event:"kick_player", // send the user id
            payload: {userId: userId},
        });
    }
    return (
        <div className="grid grid-cols-1 border-t border-gray-300">
            {items.map((item, i) => (
                <div key={i} className="flex items-center p-4 bg-gray-100 justify-start gap-2 border-b border-gray-300">
                    <p className="grow font-semibold truncate text-center">
                        {item.username}
                        {item.userId === userId ? " (you)" : ""}
                    </p>
                    {
                        isHost && item.userId !== userId ?
                        <button
                            onClick={() => kick_player(item.userId)}
                            className="bg-blue-400 rounded text-lg px-4 font-semibold">
                            Kick Player
                        </button>
                        : null
                    }
                </div>
            ))}
        </div>
    );
}