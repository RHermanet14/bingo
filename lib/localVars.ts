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

export function setBoard(board: number[]) {
    let localBoard: string = "";
    board.forEach(space => {
        localBoard += space.toString() + ' ';
    });
    console.log(localBoard);
    localStorage.setItem("board", localBoard);
}

export function getBoard() {
    let board = localStorage.getItem("board");
    if (!board) {
        board = "";
        for (let i: number = 1; i < 26; i++) {
            board += i.toString() + ' ';
        }
    }
    console.log(board);
    return board;
}

export function getBoardSetting(option: number): number {
 return option;
}

export function getWinSetting(option: number): number {
    return option;
}