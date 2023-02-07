import Pieces from "../components/Pieces"
import {useState, useEffect} from "react"
import CheckMove from "../helpers/CheckMove"
import CheckCheck from "../helpers/CheckCheck"
import FunctionWhichChecksForValidNonCheckMove from "../helpers/functionWhichChecksForValidNonCheckMove"

const delay = ms => new Promise(
    resolve => setTimeout(resolve, ms)
  );

export default function GameWindow() {

    let horizontal = []
    let vertical = []
    let board = []
    let trial = true

    const [gameOver, setGameOver] = useState(false)
    const [srcX, setSrcX] = useState(0)
    const [srcY, setSrcY] = useState(0)

    const [whiteCheck, setWhiteCheck] = useState(false)
    const [blackCheck, setBlackCheck] = useState(false)
    const [piecesGivingCheck, setPiecesGivingCheck] = useState([])


    const [p1move, setP1move] = useState(true)

    const [clickCount, setClickCount] = useState(0)
    const [activePiece, setActivePiece] = useState(null)

    useEffect(() => {
        if(gameOver) {
            async function endGame () {await delay(3000); window.location.reload(false)}
            endGame()
        }
      }, [whiteCheck, blackCheck, piecesGivingCheck, gameOver])

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
                
                // after move, check if piece is in check
                let currInCheck = [blackCheck, whiteCheck]
                CheckCheck(Pieces, setWhiteCheck, setBlackCheck, setPiecesGivingCheck, currInCheck)
                let colorInCheck = currInCheck[0] ? "white" : currInCheck[1] ? "black" : null
                if (colorInCheck) {
                    let areValidMovesPresent = FunctionWhichChecksForValidNonCheckMove(Pieces, colorInCheck
                        , blackCheck, setBlackCheck, whiteCheck, setWhiteCheck, setPiecesGivingCheck, setClickCount,
                        p1move, setP1move)
                    if (areValidMovesPresent) {
                        setGameOver(true)
                        return
                    }
                }
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
                
                if (moveDone) {
                    setP1move(!p1move)
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
    let i, j;
    for(i = 0; i < 8; i++){
        horizontal.push(String.fromCharCode(i+97))
        vertical.push(i+1+'')
    }for(i = 0; i < 8; i ++){
        for(j = 0; j < 8; j ++){
            let x, pieceName, inCheck
            x = placePiece(i, j) ? placePiece(i,j)[1] : null
            pieceName = placePiece(i, j) ? placePiece(i,j)[0] : null
            inCheck = (pieceName === "king_white" && whiteCheck) || (pieceName === "king_black" && blackCheck)  
            if((i+j) % 2 === 0)
                board.push(
                <div className="square light" key = {`${i}, ${j}`} a-key = {`${8-i}, ${j+1}`} 
                onClick={(event) => {clickFunc(event, pieceName)}} tabIndex={[i,j]}
                style={{backgroundColor: inCheck ? "rgb(247, 49, 49)" : piecesGivingCheck.includes(pieceName) ? "rgb(247, 80, 80)" : ""}}>
                    {x && 
                    <img className = "chessPiece" a-key = {`${8-i}, ${j+1}`} src ={`${x}`} alt = "chessPiece" />}
                </div>)
            else
                board.push(
                <div className="square dark" key = {`${i}, ${j}`} a-key = {`${8-i}, ${j+1}`}
                onClick={(event) => {clickFunc(event, pieceName)}} tabIndex={[i,j]}
                style={{backgroundColor: inCheck ? "rgb(247, 49, 49)" : piecesGivingCheck.includes(pieceName) ? "rgb(247, 80, 80)" : ""}}>
                    {x && 
                    <img  className = "chessPiece" a-key = {`${8-i}, ${j+1}`} src ={`${x}`} alt = "chessPiece" />}
                </div>)

        }
    }

    // Initial board insertion


  return (
    <>
        { !gameOver &&
        <div>
            <div className="chessBoard">{board}</div> 
            <div className="players"><span style={{color: `${p1move ? "red" : "black"}`}}>Player 1</span><button onClick={()=>window.location.reload()}>New Game</button><span  style={{color: `${!p1move ? "red" : "black"}`}}>Player 2</span></div>
            <div>{trial}</div></div>
        }
        {gameOver && <div>Game Over</div>}
    </>
  )
}
