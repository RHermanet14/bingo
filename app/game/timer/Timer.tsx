import {useEffect, useState, useRef, useCallback} from 'react';

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
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

    function stopTimer() {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
        
    }

    const setBingoNumber = useCallback(() => {
        let num: number = getRandomBingoNumber();
        while (generatedNumbers.includes(num) && generatedNumbers.length < 75) {num = getRandomBingoNumber();}
        if (generatedNumbers.length >= 75)
            stopTimer();
        generatedNumbers.push(num);
        const str: string = convertToBingoNumber(num);
        setLetterNum(str);
    }, []);

    useEffect(() => {
        intervalRef.current = setInterval(setBingoNumber, 5000);
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
