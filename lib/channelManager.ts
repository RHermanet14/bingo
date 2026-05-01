import { RealtimeChannel } from "@supabase/supabase-js";
import {supabase} from "@/lib/supabase";

let channel: RealtimeChannel | null = null;
let currentRoomId: string | null = null;

export function initChannel(roomId: string, userId: string) {
    if (!channel || currentRoomId !== roomId) {
        if (channel) {
            supabase.removeChannel(channel);
        }
        channel = supabase.channel(`room-${roomId}`, {
            config: {
                broadcast:{self:true},
                presence:{key: userId} // or crypto.randomUUID()
            },
        });
        currentRoomId = roomId;
    }
    return channel;
}

export function removeChannel() {
    if (channel) {
        supabase.removeChannel(channel);
        channel = null;
        currentRoomId = null;
    }
}

export function getChannel() {
    return channel;
}