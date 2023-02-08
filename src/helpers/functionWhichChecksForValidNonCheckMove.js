import CheckCheck from "./CheckCheck"
import CheckMove from "./CheckMove"


// const delay = ms => new Promise(
//     resolve => setTimeout(resolve, ms)
//   );

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
                if(piece.includes(colorInCheck) && Pieces[piece]["alive"]) {
                    let flag = true
                    let srcX = Pieces[piece]["x"]
                    let srcY = Pieces[piece]["y"]
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
                            }
                        }else {
                            Pieces[piece]["x"] = i+''
                            Pieces[piece]["y"] = j+''
                            moveDone = true
                        }
                        if (flag){
                        let currInCheck = [whiteCheck, blackCheck]
                        CheckCheck(Pieces, setWhiteCheck, setBlackCheck, setPiecesGivingCheck, currInCheck)

                        let isInCheck = colorInCheck === "white" ? currInCheck[0] : currInCheck[1]
                        if(isInCheck) {
                            moveDone = false 
                        }

                        if (moveDone) {
                            // console.log("Moved piece ", piece, "from ", srcX, srcY, "to ", i, j)
                            isCheckMate = false
                            
                        }
                        if (pieceAtPlace && (Pieces[piece]["color"] !== pieceAtPlace[1]["color"])) {
                            Pieces[pieceAtPlace[0]]["alive"] = 1
                            Pieces[pieceAtPlace[0]]["x"] = i+''
                            Pieces[pieceAtPlace[0]]["y"] = j+''
                        }
                        
                        Pieces[piece]["x"] = srcX
                        Pieces[piece]["y"] = srcY
                        
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
