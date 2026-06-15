"use client";
import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import {useParams, useRouter} from "next/navigation";
import {getChannel, initChannel, removeChannel} from "@/lib/channelManager"
import { RealtimeChannel } from "@supabase/supabase-js";
import { buildBoard, getBoard, getuserId } from "@/lib/localVars";
import { getTimeSetting } from "@/lib/localVars";

//#region Global variables
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
const cornerConditions: number[] = [0,4,20,24];
const remainingBingoNumbers: number[] = Array.from({length: 75}, (_, i) => i); // numbers to be called by timer
const generatedNumbers: number[] = []; // list of numbers already called

let isTimerStopped: boolean = false;
//#endregion

export function Board() {
    enum Outcome {None, Lost, Won};
    const router = useRouter();
    const [outcome, setOutcome] = useState<Outcome>(Outcome.None);
    const [active, setActive] = useState<boolean[]>(
        () => Array.from({ length: 25 }, () => false)
    );
    const username = localStorage.getItem('username') ?? "unknown";
    const [winner, setWinner] = useState<string>("");
    const {id} = useParams();

    const [winSettings, setWinSettings] = useState<number>(1);
    const [mode, setMode] = useState<number>(1);
    const [boardNumbers,setBoardNumbers] = useState<number[]>([]); // represents user's board

    const placeChip = (index: number) => {
        setActive(prev => prev.map((val, i) => (i === index ? !val : val)));
    };

    function validNum(space: number): boolean {
        if (space === 12)
            return true;
        return generatedNumbers.includes(boardNumbers[space]);
    }

    const callBingo = async(): Promise<boolean> => {
        let index: number = 0;
        let isBingo: boolean = true;
        let numLines: number = 0;
        let linesNeeded: number = 1;
        switch(winSettings) {
            case 2: // two lines
                linesNeeded = 2;
                break;
            case 3: // four corners
                cornerConditions.forEach(space => {
                    if (!active[space] || !validNum(space))
                        isBingo = false
                });
                if (isBingo) {
                    setOutcome(Outcome.Won);
                    channelRef.current?.send({
                        type:"broadcast",
                        event:"winGame",
                        payload: {message: username}
                    });
                    await fetch("/apli/game", {
                        method: "PUT",
                        body: JSON.stringify({id: id})
                    });
                    return true;
                }
                setOutcome(Outcome.Lost);
                return false;
            case 4: // blackout
                linesNeeded = 12;
                break;
            default: // single line
                break;
        }
        while (winConditions.at(index) !== undefined) {
            winConditions[index].forEach(space => {
                if (!active[space] || !validNum(space))
                    isBingo = false;
            });
            if (isBingo) {
                numLines++;
            }
            if (linesNeeded === numLines) {
                setOutcome(Outcome.Won);
                channelRef.current?.send({
                    type:"broadcast",
                    event:"winGame",
                    payload: {message: username}
                });
                await fetch("/apli/game", {
                    method: "PUT",
                    body: JSON.stringify({id: id})
                });
                
                return true;
            }
            isBingo = true;
            index++;
        }
        setOutcome(Outcome.Lost);
        return false;
    }

    const displayOutcome = (): string => {
        switch (outcome) {
            case Outcome.Won:
                return `${winner} has won the game!`;
            case Outcome.Lost:
                if (winner.trim.length === 0)
                    return "You Lost";
                return `${winner} has won the game!`;
            case Outcome.None:
            default:
                return "";
        }
    }

    const channelRef = useRef<RealtimeChannel>(null);
    
    const getSettings = useCallback(async(): Promise<number> => {
        const res = await fetch("/api/lobby", {
                method: "POST",
                body: JSON.stringify({id: id})
        });
        const settings = await res.json();
        return settings.settings;
    }, [id]);

    useEffect(() => {
        const getUserBoard = async() => {
            setBoardNumbers(getBoard());
        }
        getUserBoard();
        const setSettings = async()=> {
            const settings: number = await getSettings();
            setWinSettings(Math.trunc(settings / 10) % 10);
            setMode(settings % 10);
        }
        setSettings();
    }, [getSettings]);

    useEffect(() => {
        const userId = getuserId();

        const channel = initChannel(userId, username);
        channelRef.current = channel;
        channel.on("broadcast", {event:"winGame"}, ({payload}) => {
            // set win message to name of player than won
            setWinner(payload.message);
            console.log(payload.message, " has won the game!");
            isTimerStopped = true;
        });
        channel.subscribe();
    });

    return (
        <div>
            <h1 className="flex items-center justify-center text-4xl mb-10 font-bold rounded">{displayOutcome()}</h1>
            <div className="grid grid-cols-5 gap-5 text-center text-3xl border-2 p-4 bg-gray-400">
                <p>B</p>
                <p>I</p>
                <p>N</p>
                <p>G</p>
                <p>O</p>
                {boardNumbers.map((num,i) => (
                    <button key={i} onClick={() => placeChip(i)}
                        className={active[i] ? "bg-yellow-300 opacity-75" : "bg-gray-400"}
                    >
                        {i === 12 ? "Free Space" : num}
                    </button>
                ))}
            </div>
            <div className="flex gap-10">
                <button className="bg-yellow-300 mt-1 rounded text-4xl font-bold" onClick={callBingo}>Call Bingo</button>
                { // you get three board swaps per game or somethin
                    mode === 3 ? 
                    <div>
                        <button
                            onClick={() => setBoardNumbers(buildBoard())}
                            className="bg-blue-300 mt-1 rounded text-4xl font-bold"
                        >
                            Change Board
                        </button>
                    </div>
                    : null
                }
            </div>
            
            {
                outcome === Outcome.None ? null :
                <div className="flex items-center justify-center text-4xl mt-20">
                    
                    <button 
                        onClick={() => router.replace("/browser")}
                        className="bg-blue-400 rounded"
                    >
                        Return to Browser
                    </button>
                </div>
            }
        </div>    
    );
}

export function Timer() {
    //#region timer variables
    const [letterNum, setLetterNum] = useState("");
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const {id} = useParams();
    const [bingoNumberInterval, setBingoNumberInterval] = useState<number>(3000);
    const [mode, setMode] = useState<number>(1);
    const username = localStorage.getItem('username') ?? "unknown";
    
    const enum IntervalReturns { // Return values for getRandomBingoNumber that aren't valid bingo numbers 0 - 74
        NullPayload = -2, // Return if the host hasn't send a broadcast containing the seed and start time to generate a deterministic random number
        EmptyArray = -1, // Return if the remainingBingoNumbers array is empty
    };

    type RandomNumberPayload = {
        seed: number;
        startTime: number;
    };
    const [payloadInfo, setPayloadInfo] = useState<RandomNumberPayload | null>(null);
    //#endregion

    const getRandomBingoNumber = useCallback((): number => {
        if (!payloadInfo)
        {
            console.log("Returning because null payload");
            return IntervalReturns.NullPayload;
        }
            
        if (remainingBingoNumbers.length === 0)
        {
            console.log("Returning because empty array");
            return IntervalReturns.EmptyArray;
        }
            
        const tick = Math.floor((Date.now() - payloadInfo.startTime) / bingoNumberInterval);
        const index: number = (payloadInfo.seed + tick * 17) % remainingBingoNumbers.length;
        if (mode === 2) {
            const targetIndex = generatedNumbers.indexOf(remainingBingoNumbers[index] + 1);
         if (targetIndex === -1) {
            generatedNumbers.splice(targetIndex, 1);
         } else {
            generatedNumbers.push(remainingBingoNumbers[index] + 1);
         }
         return remainingBingoNumbers[index] + 1;
        }
        const removedElement = remainingBingoNumbers.splice(index, 1);
        generatedNumbers.push(removedElement[0] + 1);
        return removedElement[0] + 1;
    }, [payloadInfo, IntervalReturns.NullPayload, IntervalReturns.EmptyArray, bingoNumberInterval, mode]);

    function convertToBingoNumber(num: number): string {
        const numString: string = num.toString();
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

    function stopTimer() {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
    }

    useEffect(() => {
        if(!id) return;
        const channel = getChannel();
        if(!channel) return;
        channel.on("broadcast", {event: "setSeed"}, (msg: {payload: RandomNumberPayload}) => {
            setPayloadInfo(msg.payload);
        });

        const generateSeed = async () => {
            const checkHostRes = await fetch("/api/browser", {
                method: "PUT",
                body: JSON.stringify({id: id, host: username}),
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
            removeChannel(); // might be too aggressive
            //channel.unsubscribe();
        };
    },[id, username]);

    
    const getSettings = useCallback(async(): Promise<number> => {
        const res = await fetch("/api/lobby", {
                method: "POST",
                body: JSON.stringify({id: id})
        });
        const settings = await res.json();
        return settings.settings;
    }, [id]);

    const [powers, setPowers] = useState<string[]>([]);
    const activatePower = (index: number) => {
        console.log(powers[index]);
    }
    const powerTypes: string[] = useMemo(() =>["Clear Chips", "Swap Boards", "Test3"], []);

    const setBingoNumber = useCallback(() => {
        const num: number = getRandomBingoNumber();
        if (num === IntervalReturns.NullPayload)
            return; // Don't stop timer if setSeed hasn't been broadcasted yet
        else if (num === IntervalReturns.EmptyArray || isTimerStopped) {
            stopTimer(); // Stop timer if no more remaining Bingo numbers or someone has called Bingo
            return;
        } else {
            //generatedNumbers.push(num);
            const str: string = convertToBingoNumber(num);
            setLetterNum(str);
        }
        const addPower = () => {
            const randInt: number = Math.floor(Math.random() * powerTypes.length);
            const powerCopy: string[] = powers;
            powerCopy.push(powerTypes[randInt]);
            setPowers(powerCopy);
        }
        addPower();
    }, [getRandomBingoNumber, IntervalReturns.NullPayload, IntervalReturns.EmptyArray, powerTypes, powers]);


    useEffect(() => {
        const setSettings = async()=> {
            const settings: number = await getSettings();
            const time = getTimeSetting(Math.trunc(settings / 100));
            setBingoNumberInterval(time);
            setMode(settings % 10);
        }
        setSettings();
        intervalRef.current = setInterval(setBingoNumber, bingoNumberInterval);
        return () => {
            if (intervalRef.current)
                clearInterval(intervalRef.current);
        };
    }, [setBingoNumber, id, bingoNumberInterval, getSettings]);

    return (
        <div>
            <h1 className="text-4xl mb-6">{letterNum}</h1>
            <div className="flex gap-2">
                {
                    mode === 4 ?
                    powers.map((name, i) => (
                        <button
                            key={i}
                            onClick={() => activatePower(i)}
                            className="">
                            {name}
                        </button>
                    ))
                    : null
                }
            </div>
            
        </div>
    );
}