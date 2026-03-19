export default function Page() {
  return (
    <div className="min-h-screen bg-gray-200 flex flex-col items-center justify-center">
      <h1 className="text-4xl mb-6">Enter Username</h1>
      <form action="/search" className="flex space-x-2">
        <input
          name="query"
          type="text"
          placeholder="Search"
          className="border border-gray-400 rounded px-3 py-1"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white rounded px-4 py-1 hover:bg-blue-700"
        >
          Submit
        </button>
      </form>
    </div>
  )
}