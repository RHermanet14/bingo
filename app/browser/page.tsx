"use client";
import Grid from "./grid/Grid";
import {BrowserRow} from "./grid/types"
import { useRouter } from "next/navigation";
import {useEffect, useState} from "react"
import {supabase} from "@/lib/supabase"
import { cookies } from "next/headers";

type Room = {
  id: string;
  name: string;
  host: string;
}

export default function BrowserPage() {
  const router = useRouter();

//#region new stuff
  const [rooms, setRooms] = useState<Room[]>([]);
  const [username, setUsername] = useState("");
  useEffect(() => {
    const fetchUsername = async() => {
      const name = (await cookies()).get("username")?.value;
      setUsername(name || "unknown");
    };
    const fetchRooms = async() => {
      const {data} = await supabase.from("rooms").select("*");
      setRooms(data || []);
    };
    fetchUsername();
    fetchRooms();
  }, []);

  const createRoom = async () => {
    const res = await fetch("/api/create", {
      method: "POST",
      body: JSON.stringify({
        host: username,
      }),
    });
    const data = await res.json();
    router.push(`/lobby/${data.id}`);
  }
//#endregion

  const items: BrowserRow[] = [
    {id: 1, type: "Public", name:"hellofun404", size: 19},
    {id: 2, type:"Private", name:"secret", size: 5},
    {id: 3, type:"Public", name: "Henry50194", size:1},
  ];

  return (
    <div>
      <h1 className="text-2xl text-center p-1 bg-gray-400">Browse Lobbies</h1>
      <div className="flex bg-gray-400 p-1 gap-2">
        <p>Search</p>
        <input placeholder="Enter Lobby Code" className="bg-white"/>
        <button className="bg-gray-500 rounded">Refresh</button>
        <button onClick={() => router.push("/lobby")}
        className="ml-auto bg-gray-500 rounded">Create Lobby</button>
      </div>
      <Grid items={items}/>
    </div>
  )
}