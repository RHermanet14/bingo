"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Grid from "./grid/Grid"
import { LobbyRow} from "./grid/types";
import { RealtimeChannel } from "@supabase/supabase-js";
import { getuserId } from "@/lib/localVars";
import { supabase } from "@/lib/supabase";

export default function LobbyList({username}: {username:string}) {
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

  useEffect(() => {
    if (!id) return;

    const userId = getuserId();

    const channel = supabase.channel(`room-${id}`, {
      config: {
        broadcast:{self:true},
        presence:{key: userId}
      },
    });
    channelRef.current = channel;
    
    // listen for updates
    channel.on("presence", { event: "sync" }, () => {
      const users = Object.values(channel.presenceState() as Record<string, LobbyRow[]>).flat();
      setUsers(users);
    });
    channel.on("broadcast", {event: "start_game"}, () => {
      router.push(`/game/${id}`);
    });

    channel.subscribe((status) => {
      if(status === "SUBSCRIBED") {
        channel.track({userId, username});
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
      supabase.removeChannel(channel);
      const decreaseSize = async() => {
        const res = await fetch("/api/validate", {
          method: "PUT",
          body: JSON.stringify({id: id, amount: -1})   
        });
       console.log("decrease size count: ", res);
      }
      decreaseSize();
    };
  }, [id, username, router]);

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