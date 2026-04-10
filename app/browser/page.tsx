"use client";
import Grid from "./grid/Grid";
import {BrowserRow} from "./grid/types"
import { useRouter } from "next/navigation";
import {useEffect, useState} from "react"
import {supabase} from "@/lib/supabase"

export default function BrowserPage() {
  const router = useRouter();
  const [rooms, setRooms] = useState<BrowserRow[]>([]);
  
  useEffect(() => {
    const fetchRooms = async() => {
      const {data} = await supabase.from("rooms").select("*");
      setRooms(data || []);
    };
    fetchRooms();
  }, []);

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
      <Grid items={rooms}/>
    </div>
  )
}