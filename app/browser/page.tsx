"use client";
import Grid from "./grid/Grid";
import {BrowserRow} from "./grid/types"
import { useRouter } from "next/navigation";
import {useCallback, useEffect, useState} from "react"

export default function BrowserPage() {
  const router = useRouter();
  const [rooms, setRooms] = useState<BrowserRow[]>([]);
  const [search, setSearch] = useState<string>("");

  const fetchRooms = useCallback(async(): Promise<BrowserRow[]> => {
      const res = await fetch("/api/browser", {
        method:"GET"
      });
      const data = await res.json();
      return data ?? [];
  }, []);

  useEffect(() => {
    fetchRooms().then(setRooms);
  }, [fetchRooms]);

  const searchRooms = async() => {
    const params = new URLSearchParams({
      name: search
    });
    const res = await fetch(`/api/browser?${params.toString()}`, {
      method:"GET"
    });
    const data = await res.json();
    setRooms(data);
  }
  
  return (
    <div>
      <h1 className="text-2xl text-center p-1 bg-gray-400">Browse Lobbies</h1>
      <div className="flex bg-gray-400 p-1 gap-2">
        <button onClick={() => searchRooms()}className="bg-orange-400 rounded">Search</button>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search Host Name"
          className="bg-white"
        />
        <button className="bg-gray-500 rounded" onClick={async() => {
          const newRooms: BrowserRow[] = await fetchRooms();
          setRooms(newRooms);
          setSearch("");
        }}>Refresh</button>
        <div className="flex ml-auto gap-2">
          <button onClick={() => router.push("/settings")} className="bg-gray-500 rounded">Settings</button>
          <button onClick={() => router.push("/lobby")}
        className="bg-gray-500 rounded">Create Lobby</button>
        </div>
        
        
      </div>
      <Grid items={rooms}/>
    </div>
  )
}