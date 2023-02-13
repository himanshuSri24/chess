import CheckCheck from "./CheckCheck"

const delay = ms => new Promise(
    resolve => setTimeout(resolve, ms)
  );

function CheckPieceAt (pieces, x, y) {
    let isPieceThere = false
    let xx = Object.entries(pieces)
    
    xx.map((key) => {
        if(key[1]["x"] === x+'' && key[1]["y"] === y+''){
            isPieceThere = true
        }
        return ""
    })
    return isPieceThere
}

function kingMove (srcX, srcY, destX, destY, piece, Pieces, whiteCheck, blackCheck
    , setWhiteCheck, setBlackCheck, setPiecesGivingCheck, currInCheck) {
    let distY = Math.abs(parseInt(srcY) - parseInt(destY))
    let distX = Math.abs(parseInt(srcX) - parseInt(destX))
    let col = Pieces[piece]["hasMoved"] ? null : !piece.includes("white") ? ["black", "white"] : ["white", "black"]
    let kingCastle = col && !Pieces["rook2_" + col[0]]["hasMoved"] && !CheckPieceAt(Pieces, srcX, 6) && !CheckPieceAt(Pieces, srcX, 7)
    let queenCastle = col && !Pieces["rook1_" + col[0]]["hasMoved"] && !CheckPieceAt(Pieces, srcX, 4) && !CheckPieceAt(Pieces, srcX, 3) && !CheckPieceAt(Pieces, srcX, 2)
    let castlingCondition1 = col && ((destY === '3' && destX === srcX && queenCastle) || (destY === '7' && destX === srcX && kingCastle))
    
    if (col && col[0] === 'white') {
        castlingCondition1 =  castlingCondition1 && !whiteCheck
        // move king to places and check, then revert
        if (castlingCondition1 && kingCastle) {
            Pieces["king_white"]["y"] = '6'
            CheckCheck(Pieces, setWhiteCheck, setBlackCheck, setPiecesGivingCheck, currInCheck)
            if (currInCheck[0]) {
                castlingCondition1 = false
                const goodLooks = async () => {
                    await delay(500)
                    Pieces["king_white"]["y"] = '5'
                    CheckCheck(Pieces, setWhiteCheck, setBlackCheck, setPiecesGivingCheck, currInCheck)
                }
                goodLooks()
            }
            else {
                Pieces["king_white"]["y"] = '7'
                CheckCheck(Pieces, setWhiteCheck, setBlackCheck, setPiecesGivingCheck, currInCheck)
                if (currInCheck[0]) {
                    castlingCondition1 = false
                    const goodLooks = async () => {
                        await delay(500)
                        Pieces["king_white"]["y"] = '5'
                        CheckCheck(Pieces, setWhiteCheck, setBlackCheck, setPiecesGivingCheck, currInCheck)
                    }
                    goodLooks()
                }
            }
            Pieces["king_white"]["y"] = '5'
        }
        else if (castlingCondition1 && queenCastle) {
            Pieces["king_white"]["y"] = '4'
            CheckCheck(Pieces, setWhiteCheck, setBlackCheck, setPiecesGivingCheck, currInCheck)
            if (currInCheck[0]) {
                castlingCondition1 = false
                const goodLooks = async () => {
                    await delay(500)
                    Pieces["king_white"]["y"] = '5'
                    CheckCheck(Pieces, setWhiteCheck, setBlackCheck, setPiecesGivingCheck, currInCheck)
                }
                goodLooks()
            }
            else {
                Pieces["king_white"]["y"] = '3'
                CheckCheck(Pieces, setWhiteCheck, setBlackCheck, setPiecesGivingCheck, currInCheck)
                if (currInCheck[0]) {
                    castlingCondition1 = false
                    const goodLooks = async () => {
                        await delay(500)
                        Pieces["king_white"]["y"] = '5'
                        CheckCheck(Pieces, setWhiteCheck, setBlackCheck, setPiecesGivingCheck, currInCheck)
                    }
                    goodLooks()
                }
            }
            Pieces["king_white"]["y"] = '5'
        }
    }
    else if (col && col[0] === 'black') {
        castlingCondition1 =  castlingCondition1 && !blackCheck
        // move king to places and check, then revert
        if (castlingCondition1 && kingCastle) {
            Pieces["king_black"]["y"] = '6'
            CheckCheck(Pieces, setWhiteCheck, setBlackCheck, setPiecesGivingCheck, currInCheck)
            if (currInCheck[1]) {
                castlingCondition1 = false
                const goodLooks = async () => {
                    await delay(500)
                    Pieces["king_black"]["y"] = '5'
                    CheckCheck(Pieces, setWhiteCheck, setBlackCheck, setPiecesGivingCheck, currInCheck)
                }
                goodLooks()
            }
            else {
                Pieces["king_black"]["y"] = '7'
                CheckCheck(Pieces, setWhiteCheck, setBlackCheck, setPiecesGivingCheck, currInCheck)
                if (currInCheck[1]) {
                    castlingCondition1 = false
                    const goodLooks = async () => {
                        await delay(500)
                        Pieces["king_black"]["y"] = '5'
                        CheckCheck(Pieces, setWhiteCheck, setBlackCheck, setPiecesGivingCheck, currInCheck)
                    }
                    goodLooks()
                }
            }
            Pieces["king_black"]["y"] = '5'
        }
        else if (castlingCondition1 && queenCastle) {
            Pieces["king_black"]["y"] = '4'
            CheckCheck(Pieces, setWhiteCheck, setBlackCheck, setPiecesGivingCheck, currInCheck)
            if (currInCheck[1]) {
                castlingCondition1 = false
                const goodLooks = async () => {
                    await delay(500)
                    Pieces["king_black"]["y"] = '5'
                    CheckCheck(Pieces, setWhiteCheck, setBlackCheck, setPiecesGivingCheck, currInCheck)
                }
                goodLooks()
            }
            else {
                Pieces["king_black"]["y"] = '3'
                CheckCheck(Pieces, setWhiteCheck, setBlackCheck, setPiecesGivingCheck, currInCheck)
                if (currInCheck[1]) {
                    castlingCondition1 = false
                    const goodLooks = async () => {
                        await delay(500)
                        Pieces["king_black"]["y"] = '5'
                        CheckCheck(Pieces, setWhiteCheck, setBlackCheck, setPiecesGivingCheck, currInCheck)
                    }
                    goodLooks()
                }
            }
            Pieces["king_black"]["y"] = '5'
        }       
    }
    
    if (castlingCondition1) {
        if (queenCastle) {
            Pieces["rook1_"+col[0]]["y"] = '4'
        } else {
            Pieces["rook2_"+col[0]]["y"] = '6'
        }
    }
    
    if ((distX <= 1 && distY <= 1) || (castlingCondition1)) {
        return true
    }
        
    return false
}

function bishopMove (pieces, srcX, srcY, destX, destY) {
    if (Math.abs(parseInt(srcX) - parseInt(destX)) === Math.abs(parseInt(srcY) - parseInt(destY))) {
        let sX = parseInt(srcX)
        let dX = parseInt(destX)
        let sY = parseInt(srcY)
        let dY = parseInt(destY)
        if (sX < dX) {
            if (sY < dY) {
                let j = sY
                for(let i = sX + 1; i < dX; i ++) {
                    j = j+1
                    if (CheckPieceAt(pieces, i, j)) {
                        return false
                    }
                }
                return true
            }
            else {
                let j = sY
                for(let i = sX + 1; i < dX; i ++) {
                    j = j-1
                        if (CheckPieceAt(pieces, i, j)) {
                            return false
                        }
                    
                }
            }
        }
        else {
            if (sY < dY) {
                let j = sY
                for(let i = sX - 1; i > dX; i --) {
                    j = j + 1
                        if (CheckPieceAt(pieces, i, j)) {
                            return false
                        }
                    
                }
            }
            else {
                let j = sY
                for(let i = sX - 1; i > dX; i --) {
                    j = j -1
                        if (CheckPieceAt(pieces, i, j)) {
                            return false
                        }
                    
                }
            }
        }
        return true
    }
    return false
}

function knightMove (srcX, srcY, destX, destY) {
    if (Math.abs(parseInt(srcX) - parseInt(destX)) === 2) {
        if (Math.abs(parseInt(srcY) - parseInt(destY)) === 1) {
            return true
        }
    }
    else if (Math.abs(parseInt(srcY) - parseInt(destY)) === 2) {
        if (Math.abs(parseInt(srcX) - parseInt(destX)) === 1) {
            return true
        }
    }
    else {
        return false
    }
}

function rookMove (pieces, srcX, srcY, destX, destY, piece) {
    
    if (srcX !== destX && srcY !== destY)
            return false
    
            let xVal, yVal
        xVal = parseInt(srcX) < parseInt(destX) ? [srcX, destX] : [destX, srcX]
        yVal = parseInt(srcY) < parseInt(destY) ? [srcY, destY] : [destY, srcY]
    
        for(let i = parseInt(xVal[0])+1; i < parseInt(xVal[1]); i ++){
            if (CheckPieceAt(pieces, i, parseInt(yVal[0])))
                return false
        }
        for(let i = parseInt(yVal[0])+1; i < parseInt(yVal[1]); i ++){
            if (CheckPieceAt(pieces, parseInt(xVal[0]), i))
                return false
        }
        
        if ((srcX === destX || srcY === destY) && pieces[piece]) {
            // pieces[piece]["hasMoved"] = true
            
        }

        return (srcX === destX || srcY === destY) 
}

function pawnMove (piece, pieces, srcX, srcY, destX, destY) {
    var forwardMove, firstMove
    firstMove = false
    if(pieces[piece]["color"] === "true") {
        forwardMove = -1
        if(srcX === '2') {
            firstMove = parseInt(srcX) === (parseInt(destX) + forwardMove - 1) && !CheckPieceAt(pieces, parseInt(srcX)+1, parseInt(srcY))
        }
    }
    
    else{
        forwardMove = 1
        if(srcX === '7') {
            firstMove = parseInt(srcX) === (parseInt(destX) + forwardMove + 1) && !CheckPieceAt(pieces, parseInt(srcX)-1, parseInt(srcY))
        }
    }

    let normalMove = parseInt(srcX) === (parseInt(destX) + forwardMove)
    let diagMove = ((parseInt(srcY) === (parseInt(destY) + 1)) || (parseInt(srcY) === (parseInt(destY) - 1))) && normalMove

    return ((firstMove || normalMove) && (srcY === destY) && (!CheckPieceAt(pieces, destX, destY))) || (diagMove && CheckPieceAt(pieces, destX, destY)) 
}


export default function CheckMove(piece, srcX, srcY, destX, destY, board, pieces, whiteCheck, blackCheck
    , setWhiteCheck, setBlackCheck, setPiecesGivingCheck, currInCheck) {

    if(piece.includes("king")){
        return kingMove(srcX, srcY, destX, destY, piece, pieces, whiteCheck, blackCheck, setWhiteCheck, setBlackCheck, setPiecesGivingCheck, currInCheck)
    }
    

    else if(piece.includes("queen")){
        return bishopMove(pieces, srcX, srcY, destX, destY) || rookMove (pieces, srcX, srcY, destX, destY)
    }
    

    else if(piece.includes("bishop")){
        return bishopMove(pieces, srcX, srcY, destX, destY)
    }
    

    else if(piece.includes("knight")){
        return knightMove (srcX, srcY, destX, destY)
    }
    

    else if(piece.includes("rook")){
        return rookMove (pieces, srcX, srcY, destX, destY, piece)
    }
    
    
    else if(piece.includes("pawn")){
        return pawnMove (piece, pieces, srcX, srcY, destX, destY)
    }
    return false
}
