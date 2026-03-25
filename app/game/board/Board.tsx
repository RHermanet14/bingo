"use client";

const getBingoNumber = (letter: number): number => {
        switch(letter) {
            case 0:
                return Math.floor(Math.random() * 15) + 1;
            case 1:
                return Math.floor(Math.random() * 15) + 15;
            case 2:
                return Math.floor(Math.random() * 15) + 30;
            case 3:
                return Math.floor(Math.random() * 15) + 45;
            case 4:
                return Math.floor(Math.random() * 15) + 60;
            default:
                return -1;
        }
    };

export default function Board() {
    const board = [];
    const numArr: number[] = [];
    for (let i: number = 0; i < 25; i++) {
        let space: number = getBingoNumber(i%5);
        while(numArr.includes(space)) {space = getBingoNumber(i%5);}
        board.push(<div key={i} onClick={() => alert(`putting chip down on space`)}>{space}</div>);
        numArr.push(space);
    }

    return (
        <div className="grid grid-cols-5 gap-5 text-center text-3xl border-2 p-4 bg-gray-400">
            <p>B</p>
            <p>I</p>
            <p>N</p>
            <p>G</p>
            <p>O</p>
            {board}
        </div>
    );
}