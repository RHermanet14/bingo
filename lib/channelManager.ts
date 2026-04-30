import { RealtimeChannel } from "@supabase/supabase-js";
import {supabase} from "@/lib/supabase";

let channel: RealtimeChannel | null = null;
let currentRoomId: string | null = null;
let isTracking: boolean = false;

export function initChannel(roomId: string, userId: string, username: string) {
    if (!channel || currentRoomId !== roomId) {
        if (channel) {
            supabase.removeChannel(channel);
        }

        isTracking = false;

        channel = supabase.channel(`room-${roomId}`, {
            config: {
                broadcast:{self:true},
                presence:{key: userId} // or crypto.randomUUID()
            },
        });

        const ch = channel;
        ch.subscribe((status) => {
            if(status === "SUBSCRIBED" && !isTracking) {
                ch.track({userId, username});
                isTracking = true;
            }
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