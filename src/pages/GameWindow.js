import Pieces from "../components/Pieces"
import {useState} from "react"
import CheckMove from "../components/CheckMove"

export default function GameWindow() {

    let horizontal = []
    let vertical = []
    let board = []

    let srcX = 0, srcY = 0

    const [p1move, setP1move] = useState(true)

    const [clickCount, setClickCount] = useState(0)
    const [activePiece, setActivePiece] = useState(null)

    function pieceAtPlaceToMove (x1, y1) {
        let piece = null
        let x = Object.entries(Pieces)
        x.map((key) => {
            if(key[1]["x"] == x1 && key[1]["y"] == y1){
                piece = key
            }
            return ""
        })
        return piece
    }

    function clickFunc (e, pieceName, srcX, srcY) {
        
        var x = Object.entries(Pieces)
        x.map((key) => {
            if(key[0] === pieceName){
                if(clickCount === 0) {
                    if(Pieces[pieceName]["color"] === p1move+''){
                    setClickCount(1)
                    setActivePiece(pieceName)
                    srcX = e.target.getAttribute("a-key")[0]
                    srcY = e.target.getAttribute("a-key")[3]
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
            setClickCount(0)
            setP1move(!p1move)
            CheckMove(activePiece, srcX, srcY, xToMoveTo, yToMoveTo, board, Pieces)
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
            let x, pieceName
            x = placePiece(i, j) ? placePiece(i,j)[1] : null
            pieceName = placePiece(i, j) ? placePiece(i,j)[0] : null
            if((i+j) % 2 === 0)
                board.push(
                <div className="square light" key = {`${i}, ${j}`} a-key = {`${8-i}, ${j+1}`} 
                onClick={(event) => {clickFunc(event, pieceName, srcX, srcY)}} tabIndex={[i,j]}>
                    {x && 
                    <img className = "chessPiece" a-key = {`${8-i}, ${j+1}`} src ={`${x}`} alt = "chessPiece" />}
                </div>)
            else
                board.push(
                <div className="square dark" key = {`${i}, ${j}`} a-key = {`${8-i}, ${j+1}`}
                onClick={(event) => {clickFunc(event, pieceName, srcX, srcY)}} tabIndex={[i,j]}>
                    {x && 
                    <img  className = "chessPiece" a-key = {`${8-i}, ${j+1}`} src ={`${x}`} alt = "chessPiece" />}
                </div>)

        }
    }

    // Initial board insertion


  return (
    <>
    <div className="chessBoard">{board}</div>
    <div className="players"><span style={{color: `${p1move ? "red" : "black"}`}}>Player 1</span><span  style={{color: `${!p1move ? "red" : "black"}`}}>Player 2</span></div>
    </>
  )
}
