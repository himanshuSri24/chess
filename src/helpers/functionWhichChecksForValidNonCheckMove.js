import CheckCheck from "./CheckCheck"
import CheckMove from "./CheckMove"


// const delay = ms => new Promise(
//     resolve => setTimeout(resolve, ms)
//   );


function resetHasMoved(list, Pieces) {
    Pieces["king_white"]["hasMoved"] = list[0]
    Pieces["rook1_white"]["hasMoved"] = list[1] 
    Pieces["rook2_white"]["hasMoved"] = list[2]
    Pieces["king_black"]["hasMoved"] = list[3] 
    Pieces["rook1_black"]["hasMoved"] = list[4]
    Pieces["rook2_black"]["hasMoved"] = list[5]
}


export const functionWhichChecksForValidNonCheckMove = (Pieces, colorInCheck, blackCheck, setBlackCheck, whiteCheck, setWhiteCheck, setPiecesGivingCheck, setClickCount, p1move, setP1move) => {

    let isCheckMate = true
    let moveDone = false

    function pieceAtPlaceToMove (x1, y1) {
        let piece = null
        let x = Object.entries(Pieces)
        x.map((key) => {
            if(key[1]["x"] === x1+'' && key[1]["y"] === y1+''){
                piece = key
            }
            return ""
        })
        return piece
    }
    
    Object.keys(Pieces).forEach(piece => {
        for(let i = 1; i < 9; i ++) {
            for(let j = 1; j < 9; j ++) {
                let castling = false
                if(piece.includes(colorInCheck) && Pieces[piece]["alive"]) {
                    let flag = true
                    let srcX = Pieces[piece]["x"]
                    let srcY = Pieces[piece]["y"]
                    const KRRWKRRB = [Pieces["king_white"]["hasMoved"], Pieces["rook1_white"]["hasMoved"], 
                                    Pieces["rook2_white"]["hasMoved"], Pieces["king_black"]["hasMoved"], 
                                    Pieces["rook1_black"]["hasMoved"], Pieces["rook2_black"]["hasMoved"]]  
                    
                    if (!(srcX === i+'' && srcY === j+'' ) && CheckMove(piece, srcX, srcY, i+'', j+'', null, Pieces)) {
                        let pieceAtPlace = pieceAtPlaceToMove(i, j)
                        if(pieceAtPlace) {
                            if(Pieces[piece]["color"] !== pieceAtPlace[1]["color"]){
                                Pieces[pieceAtPlace[0]]["alive"] = 0
                                Pieces[pieceAtPlace[0]]["x"] = 0
                                Pieces[pieceAtPlace[0]]["y"] = 0
                            }else if(Pieces[piece]["color"] === pieceAtPlace[1]["color"]){
                                flag = false
                            }
                            if (flag) {
                            Pieces[piece]["x"] = i+''
                            Pieces[piece]["y"] = j+''
                            moveDone = true
                            
                                if(piece.includes("king") || piece.includes("rook")) {
                                    if (piece.includes("king") && !Pieces[piece]["hasMoved"]) {
                                        let rookMoved = piece.includes("white") ? "white" : "black"
                                        let isRisky = (rookMoved === 'white' && whiteCheck) || (rookMoved === 'black' && blackCheck)
                                        if (j+'' === '7' && !isRisky) {
                                            Pieces["rook2_" + rookMoved]["hasMoved"] = true
                                            castling = true
                                        }
                                        else if(j+'' === '3' && !isRisky) {
                                            Pieces["rook1_" + rookMoved]["hasMoved"] = true
                                            castling = true
                                        }
                                    }
                                    Pieces[piece]["hasMoved"] = true
                                }
                            }
                        }else {
                            Pieces[piece]["x"] = i+''
                            Pieces[piece]["y"] = j+''
                            moveDone = true
                            
                            if(piece.includes("king") || piece.includes("rook")) {
                                if (piece.includes("king") && !Pieces[piece]["hasMoved"]) {
                                    let rookMoved = piece.includes("white") ? "white" : "black"
                                    let isRisky = (rookMoved === 'white' && whiteCheck) || (rookMoved === 'black' && blackCheck)
                                    if (j+'' === '7' && !isRisky) {
                                        Pieces["rook2_" + rookMoved]["hasMoved"] = true
                                        castling = true
                                    }
                                    else if(j+'' === '3' && !isRisky) {
                                        Pieces["rook1_" + rookMoved]["hasMoved"] = true
                                        castling = true
                                    }
                                }
                                Pieces[piece]["hasMoved"] = true
                            }
                        }
                        if (flag){
                        let currInCheck = [whiteCheck, blackCheck]
                        CheckCheck(Pieces, setWhiteCheck, setBlackCheck, setPiecesGivingCheck, currInCheck)

                        let isInCheck = colorInCheck === "white" ? currInCheck[0] : currInCheck[1]
                        if(isInCheck) {
                            moveDone = false 
                        }

                        if (moveDone) {
                            isCheckMate = false
                            
                        }
                        if (pieceAtPlace && (Pieces[piece]["color"] !== pieceAtPlace[1]["color"])) {
                            Pieces[pieceAtPlace[0]]["alive"] = 1
                            Pieces[pieceAtPlace[0]]["x"] = i+''
                            Pieces[pieceAtPlace[0]]["y"] = j+''
                        }
                        
                        Pieces[piece]["x"] = srcX
                        Pieces[piece]["y"] = srcY
                        if (castling) {
                            let rookMoved = piece.includes("white") ? "white" : "black"
                            if (j+'' === '7') {
                                Pieces["rook2_" + rookMoved]["y"] = '8'
                            }
                            else if(j+'' === '3') {
                                Pieces["rook1_" + rookMoved]["y"] = '1'
                            }
                        }
                        resetHasMoved(KRRWKRRB, Pieces)
                        CheckCheck(Pieces, setWhiteCheck, setBlackCheck, setPiecesGivingCheck, currInCheck)
                        setClickCount(0)
                        if (!isCheckMate) {
                            return isCheckMate
                        }
                    }
                    }
                }
            }
        }
    })
    
    return isCheckMate
}

export default functionWhichChecksForValidNonCheckMove
