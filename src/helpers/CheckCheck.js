import CheckMove from "./CheckMove"

export default function CheckCheck (Pieces, setWhiteCheck, setBlackCheck, setPiecesGivingCheck, currInCheck) {
    
    let whiteKingX = Pieces["king_white"]["x"]
    let whiteKingY = Pieces["king_white"]["y"]
    let blackKingX = Pieces["king_black"]["x"]
    let blackKingY = Pieces["king_black"]["y"]

    let listOfPieces = Object.entries(Pieces)
    setWhiteCheck(false)
    setBlackCheck(false)
    let piecesGivingCheck = []
    setPiecesGivingCheck(piecesGivingCheck)

    listOfPieces.map((piece) => {
        if (piece[0].includes("black")) {
            if(CheckMove(piece[0], piece[1]["x"], piece[1]["y"], whiteKingX, whiteKingY, null, Pieces)) {
                setWhiteCheck(true)
                currInCheck[0] = true
                piecesGivingCheck.push(piece[0])
                setPiecesGivingCheck(piecesGivingCheck)
            }
        }
        else {
            if(CheckMove(piece[0], piece[1]["x"], piece[1]["y"], blackKingX, blackKingY, null, Pieces)) {
                setBlackCheck(true)
                currInCheck[1] = true
                piecesGivingCheck.push(piece[0])
                setPiecesGivingCheck(piecesGivingCheck)
            }
        }
        return ""
    })
}
