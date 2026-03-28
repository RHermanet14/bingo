import {useEffect, useState} from 'react';

const generatedNumbers: number[] = [];

function getRandomBingoNumber(): number {
    return Math.floor(Math.random() * 75) + 1;
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

export default function Timer() {
    const [letterNum, setLetterNum] = useState("");

    function setBingoNumber() {
        const num: number = getRandomBingoNumber();
        generatedNumbers.push(num);
        const str: string = convertToBingoNumber(num);
        setLetterNum(str);
    }

    useEffect(() => {
        const interval = setInterval(setBingoNumber, 5000);
        return () => {
            clearInterval(interval);
        };
    }, []);
    
    return (
        <div>
            <h1 className="text-4xl mb-6">{letterNum}</h1>
        </div>
    );
}
