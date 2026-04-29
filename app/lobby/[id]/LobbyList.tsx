"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Grid from "./grid/Grid"
import { LobbyRow } from "./grid/types";
import { RealtimeChannel } from "@supabase/supabase-js";

export default function LobbyList({username}: {username?:string}) {
  const router = useRouter();
  const { id } = useParams(); // lobby id from URL
  const [users, setUsers] = useState<LobbyRow[]>([]);
  const [isHost, setHost] = useState(false);
  const channelRef = useRef<RealtimeChannel>(null);

  // Check if it is host's lobby
  useEffect(() => {
    const checkHost = async () => {
      const res = await fetch("/api/browser", {
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
        presence: { key: sessionId },
        broadcast: {self: true},
      },
    });
    channelRef.current = channel;

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

    channel.on("broadcast", {event: "start_game"}, () => {
      router.push(`/game/${id}`);
    });

    // join lobby
    channel.subscribe(async (status) => {
      if (status === "SUBSCRIBED") {
        await channel.track({ username });
      }
    });
    const increaseSize = async() => {
      const res = await fetch("/api/validate", {
        method: "PUT",
        body: JSON.stringify({id: id, amount: 1})   
      });
      console.log("increase size count: ", res);
    }
    increaseSize();
    return () => {
      channel.unsubscribe();
      const decreaseSize = async() => {
        const res = await fetch("/api/validate", {
          method: "PUT",
          body: JSON.stringify({id: id, amount: -1})   
        });
       console.log("decrease size count: ", res);
      }
      decreaseSize();
    };
  }, [id, username, sessionId, router]);

  const start_game = async () => {
    if (!isHost) return;
    const res = await fetch("/api/browser", {
        method: "PUT",
        body: JSON.stringify({id: id, host: username}),
      });
    const data = await res.json();
    if (!data.valid) return;
    channelRef.current?.send({
      type:"broadcast",
      event:"start_game",
    });
  };

  return (
    <div>
      <div className="bg-gray-200">
        <div className="p-2 flex gap-4 text-lg bg-gray-400">
          <button onClick={() => router.replace("/browser")} className="bg-blue-400">Back To Browser</button>
          <p className="ml-auto">{users.length}/30</p>
          {
            isHost ?
            <button onClick={() => start_game()} className="bg-blue-400">Start Game</button>
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