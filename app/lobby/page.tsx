"use client";
import Grid from "./grid/Grid";
import {LobbyRow} from "./grid/types"
import { useRouter } from "next/navigation";

export default function LobbyPage() {
    const router = useRouter();
      const items: LobbyRow[] = [
        {id: 1, name:"john"},
        {id: 2, name:"kelly"},
        {id: 3, name: "crazypineapple808974"},
        {id: 4, name:"meter"}
      ];
    
    return (
        <div>
            <h1 className="text-2xl text-center p-1 bg-gray-400">Lobby Code: 123456</h1>
            <div className="bg-gray-200">
                <div className="p-2 flex gap-4 text-lg">
                    <button onClick={() => router.replace("/browser")} className="bg-blue-400">Back To Browser</button>
                    <p className="ml-auto">1/30</p>
                    <button onClick={() => router.replace("/game")} className="bg-blue-400">Start Game</button>
                </div>
                <div className="min-h-screen flex flex-col items-center justify-center">
                    <p>Users in this lobby:</p>
                    <Grid items={items}/>
                </div>
            </div>
        </div>
    )
}