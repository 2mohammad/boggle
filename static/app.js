

class BoardView {
    constructor(x, y, boardLetters){
        this.x = x
        this.y = y
        this.boardLetters = boardLetters

    }
    boardBuilder(x, y, boardLetters){
        for(let yy = 0; yy < y; yy++){
            let para = $(`<div class="align-self-center row><div class="col-6"><div class="btn-group btn-group-lg" role="group" aria-label=""></div></div></div>`)
            for(let xx = 0; xx < x; xx++){
                let id = yy.toString()+xx.toString()
                let button = $(`<button id="${id}" type="button" class="btn btn-success text-white col-1 rounded-0 game-button">${boardLetters[yy][xx]}</button>`)
                para.append(button)
            }
            $("#game").append(para)
        }
        let letterBox = $(`<p><div class="align-self-center row><div class="mb-2"><div class="alert alert-success" id="box" role="alert">Select Words To Start</div></div></div></p>`)
        $("#game").append(letterBox)
    }
    boardButtons(){
        let para = $(`<div class="row"></div>`)
        let buttonSUBMIT = $(`<div id="word" class="col" role="group" aria-label="Third group"><button type="button" class="btn btn-success col-auto my-1">SUBMIT</button></div>`)
        let buttonSUBMIT2 = $(`<div id="score" class="col" role="group" aria-label="Second group"><button type="button" class="btn btn-success col-auto my-1">Score: </button></div>`)
        let buttonSUBMIT3 = $(`<div id="played" class="col" role="group" aria-label="Second group"><button type="button" class="btn btn-success col-auto my-1">Played: </button></div>`)
        para.append(buttonSUBMIT2)
        para.append(buttonSUBMIT)
        para.append(buttonSUBMIT3)
        $("#game").append(para)

    }
}

class GameLogic {
    constructor(gameDiv){
        this.gameDiv = gameDiv
    }
    initiateFeatures(gameDiv){
        console.log(gameDiv)
        const docSelect = document.getElementById(gameDiv)
        console.log(docSelect)
        docSelect.addEventListener("click", (e)=>{
            const textBox = document.getElementById("box")
            const arrayNum = [-9, -10, -11, -1, +1, 9, 10, 11]
            if (e.target.classList.contains("game-button")){
                //console.log(e.target.innerText)
                //console.log(e.target.id)
                let lastLetterId = sessionStorage.getItem("lastLetterId")
                let currentWord = sessionStorage.getItem("currentWord")
                if(lastLetterId === null) {
                    sessionStorage.setItem("lastLetterId", e.target.id)
                    lastLetterId = sessionStorage.getItem("lastLetterId")
                    sessionStorage.setItem("currentWord", e.target.innerText)
                    currentWord = sessionStorage.getItem("currentWord")
                    let idsArray = []
                    idsArray.pop()
                    idsArray.push(lastLetterId)
                    sessionStorage.setItem("idsArray", JSON.stringify(idsArray))
                    textBox.innerText = e.target.innerText

                }
                //console.log(lastLetterId)
                function itemFunc(item, index){
                    //console.log(parseInt(e.target.id))
                    //console.log(parseInt(sessionStorage.getItem("lastLetterId")) + item)
                    if (parseInt(e.target.id) === parseInt(sessionStorage.getItem("lastLetterId")) + item && findElement(e.target.id) === null){
                            sessionStorage.setItem("lastLetterId", e.target.id)
                            currentWord = currentWord + e.target.innerText
                            sessionStorage.setItem("currentWord", currentWord)
                            console.log(currentWord)
                            let array = JSON.parse(sessionStorage.getItem("idsArray"))
                            console.log(array)
                            array.push(e.target.id)
                            array = [... new Set(array)]
                            sessionStorage.setItem("idsArray", JSON.stringify(array))
                            textBox.innerText = ""
                            textBox.innerText = currentWord
                    } 
                }
                function findElement(item){
                    const array = JSON.parse(sessionStorage.getItem("idsArray"))
                    console.log(array)
                    for (const element of array) {
                        if (element === item){
                            console.log(1)
                            return 1
                        }
                    }
                    return null
                }
                arrayNum.forEach(itemFunc)
            }
        })
    }
}

class SubmissionControls {
    constructor(name){
        this.name = name
    }
    initiateFeatures(name){
        submitFunction(name)
        function submitFunction(name){
            const textBox = document.getElementById("box")
            let submitButton = document.getElementById(name)
            submitButton.addEventListener("click", (e) => {
                e.preventDefault()
                let word = sessionStorage.getItem("currentWord")
                sessionStorage.clear()
                textBox.innerText = "Select Words To Start"
                submitToFlask(word)

            })
        }
        async function submitToFlask(word){
            const response = await axios({
                method: 'get',
                url: '/word', 
                params: {
                    word: word
                }
            })
            sessionStorage.setItem("gameInfo", JSON.stringify(response))
            let tm = JSON.parse(sessionStorage.getItem("gameInfo"))
            document.getElementById("played").innerText = "Times Played: " + tm.data.times_played
            document.getElementById("score").innerText = "Current Score: " + tm.data.score
                
        }
    }
}

// async function apiGetter(){
//     const response = await axios({
//         method: 'get',
//         url: '/home',
//         headers:{
//             'Accept': 'application/json'
//         }
//     })
//     console.log(response)
// }

 async function apiGetter(){
    const response = await axios({
        method: 'get',
        url: '/api'
    })
    return response
}

async function boardMaker(){
    const start = new BoardView()
    const clickControls = new GameLogic()
    let boardLetters = await apiGetter()
    let gameDiv = "game"
    boardLetters = boardLetters.data
    console.log(boardLetters)
    start.boardBuilder(7,7, boardLetters)
    start.boardButtons()
    clickControls.initiateFeatures(gameDiv)
    const submissions = new SubmissionControls()
    submissions.initiateFeatures("word") 
}
boardMaker()




