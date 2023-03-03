
export default function Home() {
  let text = ["Welcome to this Chess game made by Himanshu Srivastava.", "To start the game, click the button below."]
  let textLen = []
  text.forEach(line => {
    textLen.push(line.length)
  })
  let i = 0
  let animation = [`typing 3s steps(${textLen[i++]}) forwards, blink1 .5s step-end infinite alternate, removeBorder1 2s forwards 5s`, 
                `typing 3s steps(${textLen[i++]}) forwards 3s, blink2 .5s step-end infinite alternate, removeBorder2 2s forwards 5s`]

  return (
    <>
    <div class="outer">
            <div class="endText1"  style={{width: `${textLen[0]}ch`, animation: `${animation[0]}`}}> 
            {text[0]}
            </div>
            <div class="endText2"  style={{width: `${textLen[1]}ch`, animation: `${animation[1]}`}}> 
            {text[1]}
            </div>
            <button className="btn btn--stripe btn--large" onClick={()=>window.location.replace("/newGame")}>New Game</button>
        </div>
  </>
  )
}
