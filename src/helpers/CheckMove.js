
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

function kingMove (srcX, srcY, destX, destY) {
    let distY = Math.abs(parseInt(srcY) - parseInt(destY))
        let distX = Math.abs(parseInt(srcX) - parseInt(destX))
        return distX <= 1 && distY <= 1
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

function rookMove (pieces, srcX, srcY, destX, destY) {
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
        
        return (srcX === destX || srcY === destY) 
}

function pawnMove (piece, pieces, srcX, srcY, destX, destY) {
    var forwardMove, firstMove
    firstMove = false
    
    if(pieces[piece]["color"] === "true") {
        forwardMove = -1
        if(srcX === '2') {
            firstMove = parseInt(srcX) === (parseInt(destX) + forwardMove - 1)
        }
    }
    
    else{
        forwardMove = 1
        if(srcX === '7') {
            firstMove = parseInt(srcX) === (parseInt(destX) + forwardMove + 1)
        }
    }

    let normalMove = parseInt(srcX) === (parseInt(destX) + forwardMove)
    let diagMove = ((parseInt(srcY) === (parseInt(destY) + 1)) || (parseInt(srcY) === (parseInt(destY) - 1))) && normalMove

    return ((firstMove || normalMove) && (srcY === destY) && (!CheckPieceAt(pieces, destX, destY))) || (diagMove && CheckPieceAt(pieces, destX, destY)) 
}


export default function CheckMove(piece, srcX, srcY, destX, destY, board, pieces) {

    if(piece.includes("king")){
        return kingMove(srcX, srcY, destX, destY)
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
        return rookMove (pieces, srcX, srcY, destX, destY)
    }
    
    
    else if(piece.includes("pawn")){
        return pawnMove (piece, pieces, srcX, srcY, destX, destY)
    }
    return false
}
