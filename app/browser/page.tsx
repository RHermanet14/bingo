"use client";
import Grid from "./grid/Grid";
import {BrowserRow} from "./grid/types"
import { useRouter } from "next/navigation";

export default function BrowserPage() {
  const router = useRouter();
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