export type Lobby = {
    id: number;
    type: "Public" | "Private";
    name: string;
    size: number;
};