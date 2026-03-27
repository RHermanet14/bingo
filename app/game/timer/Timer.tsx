import {useEffect} from 'react';

const generatedNumbers: number[] = [];

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
function getRandomBingoNumber() {
    generatedNumbers.push(5);
}

export default function Timer() {
    useEffect(() => {
        const interval = setInterval(getRandomBingoNumber, 1000);
        return () => {
            clearInterval(interval);
        };
    }, []);
    return (
        <div>
            <h1 className="text-4xl mb-6">{generatedNumbers}</h1>
        </div>
    );
}
