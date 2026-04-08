"use client";
import Grid from "./grid/Grid";
import {BrowserRow} from "./grid/types"
import { useRouter } from "next/navigation";
import {useEffect, useState} from "react"
import {supabase} from "@/lib/supabase"

type Room = {
  id: string;
  type: string;
  host: string;
}

export default function BrowserPage() {
  const router = useRouter();

//#region new stuff
  const [rooms, setRooms] = useState<Room[]>([]);
  useEffect(() => {
    const fetchRooms = async() => {
      const {data} = await supabase.from("rooms").select("*");
      setRooms(data || []);
    };
    fetchRooms();
  }, []);

  const createRoom = async () => {
    const res = await fetch("/api/create", {
      method: "POST",
    });
    const data = await res.json();
    router.push(`/lobby/${data.id}`);
  }
//#endregion

  const items: BrowserRow[] = [
    {id: 1, type: "Public", host:"hellofun404", size: 19},
    {id: 2, type:"Private", host:"secret", size: 5},
    {id: 3, type:"Public", host: "Henry50194", size:1},
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