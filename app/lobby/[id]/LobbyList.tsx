"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";

type PresenceUser = {
  username: string;
};

export default function LobbyList({username}: {username?:string}) {
  const { id } = useParams(); // lobby id from URL

  
  const [users, setUsers] = useState<string[]>([]);

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
    const state = channel.presenceState() as Record<string, PresenceUser[]>;

    const allUsers: string[] = [];

    Object.values(state).forEach((entries) => {
    entries.forEach((entry) => {
        allUsers.push(entry.username);
    });
    });

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
    <div style={{ padding: 20 }}>
      <h2>Lobby: {id}</h2>

      <p>Users in this lobby:</p>

      {users.map((user, i) => (
        <div key={i}>
          {user}
          {user === username ? " (you)" : ""}
        </div>
      ))}
    </div>
  );
}