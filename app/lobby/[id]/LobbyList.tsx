"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Grid from "./grid/Grid"
import { LobbyRow } from "./grid/types";

export default function LobbyList({username}: {username?:string}) {
  const router = useRouter();
  const { id } = useParams(); // lobby id from URL
  const [users, setUsers] = useState<LobbyRow[]>([]);
  const [isHost, setHost] = useState(false);

  // Check if it is host's lobby
  useEffect(() => {
    const checkHost = async () => {
      const res = await fetch("/api/validate", {
        method: "PUT",
        body: JSON.stringify({id: id, host: username}),
      });
      const data = await res.json();
      setHost(data.valid);
    }
    checkHost();
  },[id, username])
  
  // unique session id (important)
  const sessionId = useMemo(() => crypto.randomUUID(), []);

  useEffect(() => {
    if (!id) return;
    const channel = supabase.channel(`lobby:${id}`, {
      config: {
        presence: {
          key: sessionId,
        },
      },
    });

    // listen for updates
    channel.on("presence", { event: "sync" }, () => {
      const state = channel.presenceState() as Record<string, LobbyRow[]>;
      const allUsers: LobbyRow[] = Object.values(state).flatMap((entries) =>
        entries.map((entry) => ({
          username: entry.username,
        }))
      );
      setUsers(allUsers);
    });

    // join lobby
    channel.subscribe(async (status) => {
      if (status === "SUBSCRIBED") {
        await channel.track({ username });
      }
    });

    return () => {
      channel.unsubscribe();
    };
  }, [id, username, sessionId]);

  return (
    <div>
      <h1 className="text-2xl text-center p-1 bg-gray-400">Lobby Code: 123456</h1>
      <div className="bg-gray-200">
        <div className="p-2 flex gap-4 text-lg">
          <button onClick={() => router.replace("/browser")} className="bg-blue-400">Back To Browser</button>
          <p className="ml-auto">1/30</p>
          {
            isHost ?
            <button onClick={() => router.replace("/game")} className="bg-blue-400">Start Game</button>
            : null
          }
          </div>
        <div className="min-h-screen flex flex-col items-center justify-center">
        <p>Users in this lobby:</p>
        <Grid items={users} username={username} isHost={isHost}/>
        </div>
      </div>
    </div>
  );
}