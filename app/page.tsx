"use client";
import { useRouter } from "next/navigation";
import {useState} from "react"

export default function Page() {
  const [username, setUsername] = useState("");
  const router = useRouter();
  const handleSubmit = () => {
    if (username.trim().length < 1 || username.trim().length > 9) {
      alert("Invalid username");
      return
    }
    document.cookie =`username=${username}; path=/; max-age=86400`; // 1 day
    router.push("/browser");
  };

  return (
    <div className="min-h-screen bg-gray-200 flex flex-col items-center justify-center">
      <h1 className="text-4xl mb-6">Enter Username</h1>
      <input
          name="name"
          placeholder="friendly_user123"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="border border-gray-400 rounded px-3 py-1"
        />
        <button
          onClick={handleSubmit}
          className="bg-blue-600 text-white rounded px-4 py-1 hover:bg-blue-700"
        >
          Submit
        </button>
    </div>
  )
}