import {useEffect, useState, useRef, useCallback} from 'react';

const remainingBingoNumbers: number[] = Array.from({length: 75}, (_, i) => i);

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
        const num: number = getRandomBingoNumber();
        if (num <= -1) {
            stopTimer();
        } else {
            const str: string = convertToBingoNumber(num + 1);
            setLetterNum(str);
        }
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
