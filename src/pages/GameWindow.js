import Pieces from "../components/Pieces"
import {useState} from "react"
import CheckMove from "../helpers/CheckMove"
import CheckCheck from "../helpers/CheckCheck"
import FunctionWhichChecksForValidNonCheckMove from "../helpers/functionWhichChecksForValidNonCheckMove"
import _ from "lodash"

let extraPieces = [["queen_white", "bishop1_white", "knight1_white", "rook1_white"],
["queen_black", "bishop1_black", "knight1_black", "rook1_black"]] // White-QBKR, Black-QBKR
let extraPiecesCount = [[1, 1, 1, 1], [1, 1, 1, 1]] // White-QBKR, Black-QBKR

const delay = ms => new Promise(
    resolve => setTimeout(resolve, ms)
  );

function resetHasMoved(list) {
    Pieces["king_white"]["hasMoved"] = list[0]
    Pieces["rook1_white"]["hasMoved"] = list[1] 
    Pieces["rook2_white"]["hasMoved"] = list[2]
    Pieces["king_black"]["hasMoved"] = list[3] 
    Pieces["rook1_black"]["hasMoved"] = list[4]
    Pieces["rook2_black"]["hasMoved"] = list[5]
}

export default function GameWindow() {

    let horizontal = []
    let vertical = []
    let board = []
    let trial = true

    const [gameOver, setGameOver] = useState(false)
    const [stalemate, setStalemate] = useState(false)
    const [srcX, setSrcX] = useState(0)
    const [srcY, setSrcY] = useState(0)

    const [whiteCheck, setWhiteCheck] = useState(false)
    const [blackCheck, setBlackCheck] = useState(false)
    const [piecesGivingCheck, setPiecesGivingCheck] = useState([])
    const [isPawnPromoted, setIsPawnPromoted] = useState([null ,false, null])
    // const [pieceToSet, setPieceToSet] = useState(0)

    const [p1move, setP1move] = useState(true)

    const [clickCount, setClickCount] = useState(0)
    const [activePiece, setActivePiece] = useState(null)


    function pieceAtPlaceToMove (x1, y1) {
        let piece = null
        let x = Object.entries(Pieces)
        x.map((key) => {
            if(key[1]["x"] === x1 && key[1]["y"] === y1){
                piece = key
            }
            return ""
        })
        return piece
    }

    function setPromotion (x) {
        // setPieceToSet(x)
        let col = isPawnPromoted[0].includes("white") ? 0 : 1
        Pieces[isPawnPromoted[0]]["alive"] = 0
        Pieces[extraPieces[col][x]+extraPiecesCount[col][x]] = _.cloneDeep(Pieces[extraPieces[col][x]])
        Pieces[extraPieces[col][x]+extraPiecesCount[col][x]]["x"] = Pieces[isPawnPromoted[0]]["x"]
        Pieces[extraPieces[col][x]+extraPiecesCount[col][x]]["y"] = Pieces[isPawnPromoted[0]]["y"]
        Pieces[extraPieces[col][x]+extraPiecesCount[col][x]++]["alive"] = 1
        Pieces[isPawnPromoted[0]]["x"] = 0
        Pieces[isPawnPromoted[0]]["y"] = 0
        CheckCheck(Pieces, setWhiteCheck, setBlackCheck, setPiecesGivingCheck, isPawnPromoted[2])
        const endIfMate = async () => {
            let colorInCheck = isPawnPromoted[2][0] ? "white" : isPawnPromoted[2][1] ? "black" : null
            if (colorInCheck) {
                
                let isNoMovePresent = FunctionWhichChecksForValidNonCheckMove(Pieces, colorInCheck
                    , blackCheck, setBlackCheck, whiteCheck, setWhiteCheck, setPiecesGivingCheck, setClickCount,
                    p1move, setP1move)
                    // resetHasMoved(KRRWKRRB)
                if (isNoMovePresent) {
                    await delay(500)
                    setGameOver(true)
                    return
                }
            }
            else {
                
                let colorOpp = Pieces[activePiece]["color"] ? "black" : "white"
                let isNoMovePresent = FunctionWhichChecksForValidNonCheckMove(Pieces, colorOpp
                    , blackCheck, setBlackCheck, whiteCheck, setWhiteCheck, setPiecesGivingCheck, setClickCount,
                    p1move, setP1move)
                    if (isNoMovePresent) {
                    await delay(1000)
                    setStalemate(true)
                    return
                }
            }
        }

        endIfMate()

        setIsPawnPromoted(false)
    }

    function clickFunc (e, pieceName) {
        
        var x = Object.entries(Pieces)
        x.map((key) => {
            if(key[0] === pieceName){
                if(clickCount === 0) {
                    if(Pieces[pieceName]["color"] === p1move+''){
                    setClickCount(1)
                    setActivePiece(pieceName)
                    setSrcX(e.target.getAttribute("a-key")[0])
                    setSrcY(e.target.getAttribute("a-key")[3])
                }
            }
                return key
            }
            return null
        },
        )
        if(clickCount === 1) {
            let xToMoveTo = e.target.getAttribute("a-key")[0]
            let yToMoveTo = e.target.getAttribute("a-key")[3]
            let castling = false
            let moveDone = false

            trial = CheckMove(activePiece, srcX, srcY, xToMoveTo, yToMoveTo, board, Pieces)
            if(trial){
                    let pieceAtPlace = pieceAtPlaceToMove(xToMoveTo, yToMoveTo)
                    if(pieceAtPlace) {
                        if(Pieces[activePiece]["color"] !== pieceAtPlace[1]["color"]){
                        Pieces[pieceAtPlace[0]]["alive"] = 0
                        Pieces[pieceAtPlace[0]]["x"] = 0
                        Pieces[pieceAtPlace[0]]["y"] = 0
                        }else if(Pieces[activePiece]["color"] === pieceAtPlace[1]["color"]){
                            return
                        }
                        
                    }
                    Pieces[activePiece]["x"] = xToMoveTo
                    Pieces[activePiece]["y"] = yToMoveTo
                    moveDone = true

                    const KRRWKRRB = [Pieces["king_white"]["hasMoved"], Pieces["rook1_white"]["hasMoved"], 
                                    Pieces["rook2_white"]["hasMoved"], Pieces["king_black"]["hasMoved"], 
                                    Pieces["rook1_black"]["hasMoved"], Pieces["rook2_black"]["hasMoved"]]  
                    
                    if(activePiece.includes("king") || activePiece.includes("rook")) {
                        if (activePiece.includes("king") && !Pieces[activePiece]["hasMoved"]) {
                            let rookMoved = activePiece.includes("white") ? "white" : "black"
                            let isRisky = (rookMoved === 'white' && whiteCheck) || (rookMoved === 'black' && blackCheck)
                            if (yToMoveTo === '7' && !isRisky) {
                                Pieces["rook2_" + rookMoved]["hasMoved"] = true
                                castling = true
                            }
                            else if(yToMoveTo === '3' && !isRisky) {
                                Pieces["rook1_" + rookMoved]["hasMoved"] = true
                                castling = true
                            }
                        }
                        Pieces[activePiece]["hasMoved"] = true
                    }
                    
                    let currInCheck = [blackCheck, whiteCheck]
                    CheckCheck(Pieces, setWhiteCheck, setBlackCheck, setPiecesGivingCheck, currInCheck)
                
                    let activeColorWhite = activePiece.includes("white") ? true : false
                    if((activeColorWhite && currInCheck[0]) || (!activeColorWhite && currInCheck[1])) {
                        moveDone = false
                        if (pieceAtPlace && (Pieces[activePiece]["color"] !== pieceAtPlace[1]["color"])) {
                            Pieces[pieceAtPlace[0]]["alive"] = 1
                            Pieces[pieceAtPlace[0]]["x"] = xToMoveTo
                            Pieces[pieceAtPlace[0]]["y"] = yToMoveTo
                        }
                        
                        Pieces[activePiece]["x"] = srcX
                        Pieces[activePiece]["y"] = srcY
                        
                        async function revertMove() {await delay(500);CheckCheck(Pieces, setWhiteCheck, setBlackCheck, setPiecesGivingCheck, currInCheck)}
                        
                        revertMove()
                        setClickCount(0)
                    }
                    else {

                    // after move, check if piece is in checkmate or stalemate
                
                        let colorInCheck = currInCheck[0] ? "white" : currInCheck[1] ? "black" : null
                        if (colorInCheck) {
                            
                            let isNoMovePresent = FunctionWhichChecksForValidNonCheckMove(Pieces, colorInCheck
                                , blackCheck, setBlackCheck, whiteCheck, setWhiteCheck, setPiecesGivingCheck, setClickCount,
                                p1move, setP1move)
                                // resetHasMoved(KRRWKRRB)
                            if (isNoMovePresent) {
                                setGameOver(true)
                                return
                            }
                        }
                        else {
                            
                            let colorOpp = Pieces[activePiece]["color"] ? "black" : "white"
                            let isNoMovePresent = FunctionWhichChecksForValidNonCheckMove(Pieces, colorOpp
                                , blackCheck, setBlackCheck, whiteCheck, setWhiteCheck, setPiecesGivingCheck, setClickCount,
                                p1move, setP1move)
                            if (isNoMovePresent) {
                                setStalemate(true)
                                return
                            }
                        }
                }
                if (moveDone) {
                    if (((xToMoveTo === '8' && p1move) || (xToMoveTo === '1' && !p1move)) && activePiece.includes("pawn")) {
                        setIsPawnPromoted([activePiece, true, currInCheck])
                        
                    } 
                    setP1move(!p1move)
                }
                if(!moveDone) {
                    if (castling) {
                        let rookMoved = activePiece.includes("white") ? "white" : "black"
                        if (yToMoveTo === '7') {
                            Pieces["rook2_" + rookMoved]["y"] = '8'
                        }
                        else if(yToMoveTo === '3') {
                            Pieces["rook1_" + rookMoved]["y"] = '1'
                        }
                    }
                    resetHasMoved(KRRWKRRB)
                }
            }    
            setClickCount(0)
            
        }
    }

    function placePiece (i, j)  {
        let pieceImg, flag
        Object.entries(Pieces).map((piece) => {
            if((8-parseInt(piece[1]["x"]))+'' === (i+'') && (parseInt(piece[1]["y"])-1)+'' === (j+'') && (piece[1]["alive"]===1)){
                pieceImg = [piece[0], piece[1]["img"]]
                flag = true
            }
        return ""})
        return flag === true ? pieceImg : null
    }


    // Initializing board positions
    let i, j, horInd = 0, vertInd = 7;
    for(i = 0; i < 8; i++){
        horizontal.push(String.fromCharCode(i+97))
        vertical.push(i+1+'')
    }for(i = 0; i < 9; i ++){
        for(j = 0; j < 9; j ++){

            if (j===0 && i !== 8){
                board.push(<div className="square letters" key = {`${i}, ${j-1}`}>{vertical[vertInd--]}</div>) 
            }

            else if (j!==0 && i===8){
                board.push(<div className="square letters" key = {`${i}, ${j-1}`}>{horizontal[horInd++]}</div>) 
            }
            
            else if (j===0 && i===8){
                board.push(<div className="square letters" key = {`${i}, ${j-1}`}></div>) 
            }

            else {
            let x, pieceName, inCheck
            x = placePiece(i, j-1) ? placePiece(i,j-1)[1] : null
            pieceName = placePiece(i, j-1) ? placePiece(i,j-1)[0] : null
            inCheck = (pieceName === "king_white" && whiteCheck) || (pieceName === "king_black" && blackCheck)  
            if((i+j) % 2 === 0)
                board.push(
                <div className="square light" key = {`${i}, ${j-1}`} a-key = {`${8-i}, ${j}`} 
                onClick={(event) => {clickFunc(event, pieceName)}} tabIndex={[i,j-1]}
                style={{backgroundColor: inCheck ? "rgb(247, 49, 49)" : piecesGivingCheck.includes(pieceName) ? "rgb(247, 80, 80)" : ""}}>
                    {x && 
                    <img className = "chessPiece" a-key = {`${8-i}, ${j}`} src ={`${x}`} alt = "chessPiece" />}
                </div>)
            else
                board.push(
                <div className="square dark" key = {`${i}, ${j-1}`} a-key = {`${8-i}, ${j}`}
                onClick={(event) => {clickFunc(event, pieceName)}} tabIndex={[i,j-1]}
                style={{backgroundColor: inCheck ? "rgb(247, 49, 49)" : piecesGivingCheck.includes(pieceName) ? "rgb(247, 80, 80)" : ""}}>
                    {x && 
                    <img  className = "chessPiece" a-key = {`${8-i}, ${j}`} src ={`${x}`} alt = "chessPiece" />}
                </div>)
            }
        }
    }

    // Initial board insertion

  return (
    <>
    
         { !gameOver && !stalemate && 
        <div>
            <div className="chessBoard">{board}</div> 
            <div className="players">
                {/* <button className="btn btn--stripe"><span style={{color: `${p1move ? "red" : "black"}`}}>Player 1</span></button> */}
                <button className="btn btn--stripe" onClick={()=>window.location.reload()}>
                <span style={{color: `${p1move ? "red" : "black"}`}}>Player 1</span> New Game 
                <span style={{color: `${!p1move ? "red" : "black"}`}}>Player 2</span>
                </button>
                {/* <button className="btn btn--stripe"><span style={{color: `${!p1move ? "red" : "black"}`}}>Player 2</span></button> */}
            </div>
            </div>

        }
        
        {gameOver && <div class="outer">
                <div class="endText" style={{width: "42ch"}}>
                    Game Over. It Was A Check Mate. {p1move ? "White Won." : "Black Won."}
                </div>
                <button className="btn btn--stripe btn--large" onClick={()=>window.location.reload()}>New Game</button>
        </div>}
        {stalemate && 
        <div class="outer">
            <div class="endText"  style={{width: "31ch"}}> 
            Game Over. It Was A Stale Mate. 
            </div>
            <button className="btn btn--stripe btn--large" onClick={()=>window.location.reload()}>New Game</button>
        </div>}
        {isPawnPromoted[1] && <div className="selection">
            <button className="btn btn--stripe btn--large" onClick={() => setPromotion(0)}>Queen</button>
            <button className="btn btn--stripe btn--large" onClick={() => setPromotion(1)}>Bishop</button>
            <button className="btn btn--stripe btn--large" onClick={() => setPromotion(2)}>Knight</button>
            <button className="btn btn--stripe btn--large" onClick={() => setPromotion(3)}>Rook</button>
        </div>}
        
    </>
  )
}
