import Board from "./board/Board"

export default function Page() {
  return (
    <div className="min-h-screen bg-gray-200 flex flex-col items-center justify-center">
      <h1 className="text-4xl mb-6">WOP</h1>
      <Board/>
    </div>
  )
}