"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Grid from "./grid/Grid"
import { LobbyRow} from "./grid/types";
import { RealtimeChannel } from "@supabase/supabase-js";
import { buildBoard, getBoard, getuserId, setBoard } from "@/lib/localVars";
import { initChannel, removeChannel } from "@/lib/channelManager";

export default function LobbyList() {
  const username = localStorage.getItem('username') ?? "unknown";
  const router = useRouter();
  const { id } = useParams(); // lobby id from URL
  const [users, setUsers] = useState<LobbyRow[]>([]);
  const [isHost, setHost] = useState(false);
  const channelRef = useRef<RealtimeChannel>(null);

  const [time, setTime] = useState("option1");
  const [winConditions, setWinConditions] = useState("option1");
  const [mode, setMode] = useState("option1");
  const alreadyCheckedHost = useRef(false);

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
        const {data} = await res.json();
        if(data === 0) { // delete lobby if empty
          await fetch("api/lobby", {
            method: "DELETE",
            body: JSON.stringify({id: id})
          });
        }
       console.log("decrease size count: ", res);
      }
      decreaseSize();
    };
  }, [id, username, router]);
  
  // Check if it is host's lobby
  useEffect(() => {
    if (users.length === 0) return;
    if (alreadyCheckedHost.current) return;
    const userId = getuserId();
    alreadyCheckedHost.current = true;
    const checkHost = async () => {
      const res = await fetch("/api/browser", {
        method: "PUT",
        body: JSON.stringify({id: id, host: username}),
      });
      const data = await res.json();
      setHost(data.valid && users.length === 1 && users[0].userId === userId);
    }
    checkHost();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[users])

  const getSettings = (): number => {
    return ((Number(time.at(-1))*100) + (Number(winConditions.at(-1))*10) + (Number(mode.at(-1))));
  }

  const start_game = async () => {
    if (!isHost) return;
    const res = await fetch("/api/browser", {
        method: "PUT",
        body: JSON.stringify({id: id, host: username}),
      });
    const data = await res.json();
    if (!data.valid) return;
    const settings: number = getSettings();
    await fetch("/api/lobby", {
      method: "PUT",
      body: JSON.stringify({id: id, settings: settings})
    })
    channelRef.current?.send({
      type:"broadcast",
      event:"start_game",
    });
  };

  const [boardVisible, setBoardVisible] = useState<boolean>(false);
  const [boardNumbers, setBoardNumbers] = useState<number[]>([]);
  useEffect(() => {
    const initBoard = async() => {
      setBoardNumbers(getBoard);
    }
    initBoard();
  },[]);

  const changeBoard = () => {
    setBoard(buildBoard())
    setBoardNumbers(getBoard);
  }

  return (
    <div className="bg-gray-200 min-h-screen">
      <div>
        <div className="p-2 flex gap-4 text-lg bg-gray-400">
          <button onClick={() => router.replace("/browser")} className="bg-blue-400">Back To Browser</button>
          <p className="ml-auto">{users.length}/30</p>
          {
            isHost ?
            <button onClick={() => start_game()} className="bg-blue-400">Start Game</button>
            : null
          }
        </div>
        {
          isHost ?
          <div className="flex gap-10 bg-gray-300">
            <h1 className="font-bold text-3xl bg-gray-300 justify-center items-center flex">Settings:</h1>
            <div className="flex flex-col">
              <h1>Time:</h1>
              <label>
                <input
                  type="radio"
                  name="timeChoice"
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

            <div className="flex flex-col">
              <h1>Special Mode:</h1>
              <label>
                <input
                  type="radio"
                  name="boardChoice"
                  value="option1"
                  checked={mode === "option1"}
                  onChange={(e) => setMode(e.target.value)}
                />
                Default
              </label>
              <label>
                <input
                  type="radio"
                  name="boardChoice"
                  value="option2"
                  checked={mode === "option2"}
                  onChange={(e) => setMode(e.target.value)}
                />
                Unselect
              </label>
              <label>
                <input
                  type="radio"
                  name="boardChoice"
                  value="option3"
                  checked={mode === "option3"}
                  onChange={(e) => setMode(e.target.value)}
                />
                Board Swap
              </label>
              <label>
                <input
                  type="radio"
                  name="boardChoice"
                  value="option4"
                  checked={mode === "option4"}
                  onChange={(e) => setMode(e.target.value)}
                />
                Powers
              </label>
            </div>

          </div>
          : null
        }
        <div className="flex justify-center items-center">
          <button className="bg-amber-500 text-3xl p-4 m-5" onClick={() => setBoardVisible(!boardVisible)}>View Board</button>
        </div>
        {
          boardVisible ?
          <div>
            <div className="flex justify-center items-center">
              <button className="bg-blue-500 text-3xl p-4 m-5" onClick={() => changeBoard()}>Change Board</button>
            </div>
            <div className="grid grid-cols-5 gap-5 text-center text-3xl border-2 p-4 bg-gray-400">
                <p>B</p>
                <p>I</p>
                <p>N</p>
                <p>G</p>
                <p>O</p>
                {boardNumbers.map((num,i) => (
                    <p key={i}> {i === 12 ? "Free Space" : num} </p>
                ))}
            </div>
          </div>
          : null
        }
        <div className="flex flex-col items-center justify-center text-3xl">
          <p className="font-bold mt-5">Users in this lobby:</p>
          <Grid items={users} isHost={isHost}/>
        </div>
      </div>
    </div>
  );
}