export default function SuggestionPage() {
  return (
    <div className="text-white flex-1 flex flex-col">
      <h1 className="text-3xl text-center mb-5">Suggestion</h1>
      <h3 className="text-xl text-center mb-5">User: Unknown</h3>
      <div className="flex flex-1 flex-col">
        <div className="flex flex-1">
          <div className="h-full mx-auto aspect-video bg-white bg-opacity-5 rounded-md flex justify-center items-center">Image</div>
        </div>
        <div className="flex flex-row items-center justify-around my-5 text-2xl">
          <button className="bg-red-700 rounded-md px-4 py-1 transition-transform hover:scale-105">Remove</button>
          <button className="bg-green-700 rounded-md px-4 py-1 transition-transform hover:scale-105">Approve</button>
        </div>
      </div>
    </div>
  )
}
