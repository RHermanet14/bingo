"use client";
import {Board, Timer} from "./board/Board"

export default function Page() {
  



  return (
    <div className="min-h-screen bg-gray-200 flex flex-col items-center justify-center">
      <Timer/>
      <Board/>
    </div>
  )
}