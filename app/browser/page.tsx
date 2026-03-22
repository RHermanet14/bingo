import Grid from "./grid/Grid";
import {Lobby} from "./grid/types"

export default function BrowserPage() {
  const items: Lobby[] = [
    {id: 1, type: "Public", name:"hellofun404", size: 19},
    {id: 2, type:"Private", name:"secret", size: 5},
    {id:3, type:"Public", name: "Henry50194", size:1},
  ];
  return (
    <div>
      <h1 className="text-2xl bg-gray-400 p-4">Browse Lobbies</h1>
      <Grid items={items}/>
    </div>
  )
}