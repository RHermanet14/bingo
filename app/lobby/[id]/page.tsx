"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";

type PresenceUser = {
  username: string;
};

export default function LobbyPage() {
  const { id } = useParams(); // lobby id from URL

  const [username, setUsername] = useState("");
  const [users, setUsers] = useState<string[]>([]);
  const [joined, setJoined] = useState(false);

  // unique session id (important)
  const sessionId = useMemo(() => crypto.randomUUID(), []);

  useEffect(() => {
    if (!joined || !id) return;

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
  }, [joined, id, username, sessionId]);

  // UI: enter username
  if (!joined) {
    return (
      <div style={{ padding: 20 }}>
        <h2>Lobby: {id}</h2>

        <input
          placeholder="Enter username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <button
          onClick={() => {
            if (!username) return;
            setJoined(true);
          }}
        >
          Join Lobby
        </button>
      </div>
    );
  }

  // UI: lobby users
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