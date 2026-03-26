"use client";
import { useState } from "react";

const numArr: number[] = [];
const winConditions: number[][] = [
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

function getBingoNumber(letter: number): number {
    return Math.floor(Math.random() * 15) + (letter * 15) + 1;
};

function buildBoard(index: number): number {
        let space: number = getBingoNumber(index%5);
        while(numArr.includes(space)) {space = getBingoNumber(index%5);}
        numArr.push(space);
        return space;
}

export default function Board() {
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
                if (!active[space]) // just for now, check if space is active
                    isBingo = false;
            });
            if (isBingo) {
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