"use client";
import { useState } from "react";

const numArr: number[] = [];

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
    

    return (
        <div className="grid grid-cols-5 gap-5 text-center text-3xl border-2 p-4 bg-gray-400">
            <p>B</p>
            <p>I</p>
            <p>N</p>
            <p>G</p>
            <p>O</p>
            {bingoNumbers.map((num,i) => (
                    <button
                        key={i}
                        onClick={() => placeChip(i)}
                        className={active[i] ? "bg-yellow-300 opacity-75" : "bg-gray-400"}
                    >
                        {i === 12 ? "Free Space" : num}
                    </button>
            ))}
        </div>
    );
}