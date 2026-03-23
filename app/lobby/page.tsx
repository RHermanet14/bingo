export default function LobbyPage() {
    return (
        <div>
            <h1 className="text-2xl text-center p-1 bg-gray-400">Lobby Code: 123456</h1>
            <div className="p-2 flex gap-4 text-lg">
                <button className="bg-blue-400">Back To Browser</button>
                <p className="ml-auto">1/30</p>
                <button className="bg-blue-400">Start Game</button>
            </div>
            <div className="min-h-screen bg-gray-200 flex flex-col items-center justify-center">
                <h1 className="text-4xl mb-6">Username and button to kick player</h1>
            </div>
        </div>
    )
}