"use client";
import { useState, useEffect, useRef, useCallback } from "react";

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
                if (!active[space] || !generatedNumbers.includes(space)) // just for now, check if space is active
                    isBingo = false;
            });
            if (isBingo) {
                isTimerStopped = true;
                alert("you win")
                return true;
            }
            isBingo = true;
            index++;
        }
        alert("you lose");
        return false;
    }

    return (
        <div>
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

function getRandomBingoNumber(): number {
    if (remainingBingoNumbers.length === 0)
        return -1;
    const index: number =  Math.floor(Math.random() * remainingBingoNumbers.length);
    const removedElement = remainingBingoNumbers.splice(index, 1);
    return removedElement[0];
}

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

export function Timer() {
    const [letterNum, setLetterNum] = useState("");
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

    function stopTimer() {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
    }

    const setBingoNumber = useCallback(() => {
        const num: number = getRandomBingoNumber() + 1;
        if (num <= 0 || isTimerStopped) {
            stopTimer();
        } else {
            generatedNumbers.push(num);
            const str: string = convertToBingoNumber(num);
            setLetterNum(str);
        }
    }, []);

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