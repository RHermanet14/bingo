export function getuserId() {
    let userId = localStorage.getItem("userId");
    if (!userId) {
        userId = crypto.randomUUID();
        localStorage.setItem("userId", userId)
    }
    return userId;
}

export function getTimeSetting(option: number): number {
    switch (option) {
        case 2:
            return 10000;
        case 3:
            return 3000;
        case 4:
            return 1000;
        default:
            return 5000
    }
}

function generateBoardNumber(letter: number): number {
        return Math.floor(Math.random() * 15) + (letter * 15) + 1;
    };

export function buildBoard(): number[] {
    const boardNumbers: number[] = [];
    for (let i: number = 0; i < 25; i++) {
        let space: number = generateBoardNumber(i%5);
        while(boardNumbers.includes(space)) {space = generateBoardNumber(i%5);}
        boardNumbers.push(space);
    }
    return boardNumbers;
}

export function setBoard(board: number[]) {
    let localBoard: string = "";
    board.forEach(space => {
        localBoard += space.toString() + ' ';
    });
    console.log(localBoard);
    localStorage.setItem("board", localBoard);
}

export function getBoard(): number [] {
    let board = localStorage.getItem("board");
    let numBoard: number[];
    if (!board) {
        board = "";
        numBoard = buildBoard();
        setBoard(numBoard);
        console.log(numBoard);
        return numBoard;
    }
    numBoard = board.split(' ').map(Number);
    console.log(numBoard);
    return numBoard;
}

export function getBoardSetting(option: number): number {
 return option;
}

export function getWinSetting(option: number): number {
    return option;
}