"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import {useParams} from "next/navigation";
import {supabase} from "@/lib/supabase"

//#region Global variables
const boardNumbers: number[] = []; // represents user's board
const winConditions: number[][] = [ // list of win conditions
    [0,1,2,3,4], // rows
    [5,6,7,8,9],
    [10,11,12,13,14],
    [15,16,17,18,19],
    [20,21,22,23,24],
    [0,5,10,15,20], // columns
    [1,6,11,16,21],
    [2,7,12,17,22],
    [3,8,13,18,23],
    [4,9,14,19,24],
    [0,6,12,18,24], // Diagonals
    [20,16,12,8,4],
];
const remainingBingoNumbers: number[] = Array.from({length: 75}, (_, i) => i); // numbers to be called by timer
const generatedNumbers: number[] = []; // list of numbers already called

let isTimerStopped: boolean = false;
const bingoNumberInterval: number = 3000;
//#endregion

function generateBoardNumber(letter: number): number {
    return Math.floor(Math.random() * 15) + (letter * 15) + 1;
};

function buildBoard(index: number): number {
        let space: number = generateBoardNumber(index%5);
        while(boardNumbers.includes(space)) {space = generateBoardNumber(index%5);}
        boardNumbers.push(space);
        return space;
}

export function Board() {
    enum Outcome {None, Lost, Won};
    const [outcome, setOutcome] = useState<Outcome>(Outcome.None);
    const [active, setActive] = useState<boolean[]>(
        () => Array.from({ length: 25 }, () => false)
    );
    
    const [bingoNumbers] = useState<number[]>(
        () => Array.from({length: 25}, (_, i) => buildBoard(i))
    );

    const placeChip = (index: number) => {
        setActive(prev => prev.map((val, i) => (i === index ? !val : val)));
    };
    
    const callBingo = (): boolean => {
        let index: number = 0;
        let isBingo: boolean = true;
        while (winConditions.at(index) !== undefined) {
            winConditions[index].forEach(space => {
                if (!active[space] || !generatedNumbers.includes(space))
                    isBingo = false;
            });
            if (isBingo) {
                isTimerStopped = true;
                setOutcome(Outcome.Won);
                //alert("you won");
                return true;
            }
            isBingo = true;
            index++;
        }
        //alert("you lost");
        setOutcome(Outcome.Lost);
        return false;
    }

    const displayOutcome = (): string => {
        switch (outcome) {
            case Outcome.Won:
                return "You Won!";
            case Outcome.Lost:
                return "You Lost";
            case Outcome.None:
            default:
                return "";
        }
    }

    return (
        <div>
            {displayOutcome()}
            <div className="grid grid-cols-5 gap-5 text-center text-3xl border-2 p-4 bg-gray-400">
                <p>B</p>
                <p>I</p>
                <p>N</p>
                <p>G</p>
                <p>O</p>
                {bingoNumbers.map((num,i) => (
                    <button key={i} onClick={() => placeChip(i)}
                        className={active[i] ? "bg-yellow-300 opacity-75" : "bg-gray-400"}
                    >
                        {i === 12 ? "Free Space" : num}
                    </button>
                ))}
            </div>
            <button onClick={callBingo}>Call Bingo</button>
        </div>    
    );
}

export function Timer() {
    const [letterNum, setLetterNum] = useState("");
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const {id} = useParams();
    const enum IntervalReturns { // Return values for getRandomBingoNumber that aren't valid bingo numbers 0 - 74
        NullPayload = -2, // Return if the host hasn't send a broadcast containing the seed and start time to generate a deterministic random number
        EmptyArray = -1, // Return if the remainingBingoNumbers array is empty
    };

    type RandomNumberPayload = {
        seed: number;
        startTime: number;
    };
    const [payloadInfo, setPayloadInfo] = useState<RandomNumberPayload | null>(null);

    const getRandomBingoNumber = useCallback((): number => {
        if (!payloadInfo)
            return IntervalReturns.NullPayload;
        if (remainingBingoNumbers.length === 0)
            return IntervalReturns.EmptyArray;
        const tick = Math.floor((Date.now() - payloadInfo.startTime) / bingoNumberInterval);
        const index: number =  (payloadInfo.seed + tick * 17) % remainingBingoNumbers.length;
        const removedElement = remainingBingoNumbers.splice(index, 1);
        return removedElement[0];
    }, [payloadInfo, IntervalReturns.NullPayload, IntervalReturns.EmptyArray]);

    function convertToBingoNumber(num: number): string {
        const numString: string = (num + 1).toString(); // Add 1 to make num = 1 - 75
        if (num < 16)
            return "B" + numString; 
        else if (num < 31)
            return "I" + numString;
        else if (num < 46)
            return "N" + numString;
        else if (num < 61)
            return "G" + numString;
        else
            return "O" + numString;
    }

    useEffect(() => {
        if(!id) return;
        const channel = supabase.channel(`game:${id}`, {
            config: {
                broadcast:{self:true},
            },
        });
        channel.on("broadcast", {event: "setSeed"}, (msg: {payload: RandomNumberPayload}) => {
            setPayloadInfo(msg.payload);
        });
        channel.subscribe();

        const generateSeed = async () => {
            const usernameRes = await fetch("/api/username", {
                method: "GET"
            });
            const usernameData = await usernameRes.json();

            const checkHostRes = await fetch("/api/browser", {
                method: "PUT",
                body: JSON.stringify({id: id, host: usernameData.username}),
            });
            const checkHostData = await checkHostRes.json();
            if (!checkHostData.valid) return; // return if not host

            const res = await fetch("/api/game", {
                method: "GET"
            });
            const data = await res.json();
            const payload: RandomNumberPayload = {seed:data.seed, startTime: data.startTime};
            channel.send({
                type: "broadcast",
                event: "setSeed",
                payload: payload,
            });
        }
        generateSeed();
        return () => {
            supabase.removeChannel(channel);
        };
    },[id]);

    function stopTimer() {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
    }

    const setBingoNumber = useCallback(() => {
        const num: number = getRandomBingoNumber();
        if (num === IntervalReturns.NullPayload)
            return; // Don't stop timer if setSeed hasn't been broadcasted yet
        if (num === IntervalReturns.EmptyArray || isTimerStopped) {
            stopTimer(); // Stop timer if no more remaining Bingo numbers or someone has called Bingo
        } else {
            generatedNumbers.push(num);
            const str: string = convertToBingoNumber(num);
            setLetterNum(str);
        }
    }, [getRandomBingoNumber, IntervalReturns.NullPayload, IntervalReturns.EmptyArray]);

    useEffect(() => {
        intervalRef.current = setInterval(setBingoNumber, bingoNumberInterval);
        return () => {
            if (intervalRef.current)
                clearInterval(intervalRef.current);
        };
    }, [setBingoNumber]);

    return (
        <div>
            <h1 className="text-4xl mb-6">{letterNum}</h1>
        </div>
    );
}