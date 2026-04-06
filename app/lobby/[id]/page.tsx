import {cookies} from "next/headers";
import LobbyList from "./LobbyList";

export default async function LobbyPage() {
    const username = (await cookies()).get("username")?.value;
  return (
    <LobbyList username={username}/>
  );
}