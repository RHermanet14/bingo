"use client";
import Board from "./board/Board"
import Timer from "./timer/Timer"

export default function Page() {
  



  return (
    <div className="min-h-screen bg-gray-200 flex flex-col items-center justify-center">
      <Timer/>
      <Board/>
    </div>
  )
}