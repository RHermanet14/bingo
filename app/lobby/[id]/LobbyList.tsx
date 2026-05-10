"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Grid from "./grid/Grid"
import { LobbyRow} from "./grid/types";
import { RealtimeChannel } from "@supabase/supabase-js";
import { getuserId } from "@/lib/localVars";
import { initChannel, removeChannel } from "@/lib/channelManager";

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

    const channel = initChannel(id.toString(), username);
    channelRef.current = channel;

    // listen for updates
    channel.on("presence", { event: "sync" }, () => {
      const users = Object.values(channel.presenceState() as Record<string, LobbyRow[]>).flat();
      setUsers(users);
    });
    channel.on("broadcast", {event: "start_game"}, () => {
      router.replace(`/game/${id}`);
    });
    channel.on("broadcast", {event:"kick_player"}, ({payload}) => {
      if (payload.userId === userId) {
        router.replace("/browser")
      }
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
      removeChannel();
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

  const [time, setTime] = useState("option1");
  const [boardSize, setBoardSize] = useState("option1");
  const [winConditions, setWinConditions] = useState("option1");

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
        <div>
          <h1 className="font-bold text-3xl bg-gray-300 justify-center items-center flex">Settings:</h1>
          <div className="flex flex-col">
            <h1>Time:</h1>
            <label>
              <input
                type="radio"
                name="choice"
                value="option1"
                checked={time === "option1"}
                onChange={(e) => setTime(e.target.value)}
              />
              5 Seconds
            </label>
            <label>
              <input
                type="radio"
                name="timeChoice"
                value="option2"
                checked={time === "option2"}
                onChange={(e) => setTime(e.target.value)}
              />
              10 Seconds
            </label>
            <label>
              <input
                type="radio"
                name="timeChoice"
                value="option3"
                checked={time === "option3"}
                onChange={(e) => setTime(e.target.value)}
              />
              3 Seconds
            </label>
            <label>
              <input
                type="radio"
                name="timeChoice"
                value="option4"
                checked={time === "option4"}
                onChange={(e) => setTime(e.target.value)}
              />
              1 Second
            </label>
          </div>

          <div className="flex flex-col">
            <h1>Board Size:</h1>
            <label>
              <input
                type="radio"
                name="boardChoice"
                value="option1"
                checked={boardSize === "option1"}
                onChange={(e) => setBoardSize(e.target.value)}
              />
              5 x 5
            </label>
            <label>
              <input
                type="radio"
                name="boardChoice"
                value="option2"
                checked={boardSize === "option2"}
                onChange={(e) => setBoardSize(e.target.value)}
              />
              3 x 3
            </label>
            <label>
              <input
                type="radio"
                name="boardChoice"
                value="option3"
                checked={boardSize === "option3"}
                onChange={(e) => setBoardSize(e.target.value)}
              />
              7 x 7
            </label>
            <label>
              <input
                type="radio"
                name="boardChoice"
                value="option4"
                checked={boardSize === "option4"}
                onChange={(e) => setBoardSize(e.target.value)}
              />
              9 x 9
            </label>
          </div>

          <div className="flex flex-col">
            <h1>Win Conditions:</h1>
            <label>
              <input
                type="radio"
                name="winChoice"
                value="option1"
                checked={winConditions === "option1"}
                onChange={(e) => setWinConditions(e.target.value)}
              />
              1 Line
            </label>
            <label>
              <input
                type="radio"
                name="winChoice"
                value="option2"
                checked={winConditions === "option2"}
                onChange={(e) => setWinConditions(e.target.value)}
              />
              2 Lines
            </label>
            <label>
              <input
                type="radio"
                name="winChoice"
                value="option3"
                checked={winConditions === "option3"}
                onChange={(e) => setWinConditions(e.target.value)}
              />
              Four Corners
            </label>
            <label>
              <input
                type="radio"
                name="winChoice"
                value="option4"
                checked={winConditions === "option4"}
                onChange={(e) => setWinConditions(e.target.value)}
              />
              Blackout
            </label>
          </div>

        </div>
        <div className="min-h-screen flex flex-col items-center justify-center">
        <p>Users in this lobby:</p>
        <Grid items={users} username={username} isHost={isHost}/>
        </div>
      </div>
    </div>
  );
}