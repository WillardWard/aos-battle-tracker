const baseURL = `http://localhost:4004/api/battletracker`
const errCallback = err => console.log(err.response.data);

let p1NameInput = document.getElementById('p1-name');
let p1ArmySelect = document.getElementById('p1-army-select')
let p2ArmySelect = document.getElementById('p2-army-select')
let p1GrandStrat = document.getElementById('p1-grand-strat')

const playerForms = document.getElementById('player-forms')
const p1SubmitBtn = document.getElementById('get-p1-info')
const p2SubmitBtn= document.getElementById('get-p2-info')
const p1Form = document.getElementById('p1-form')
const p2Form = document.getElementById('p2-form')
const p1TotalLabel = document.getElementById('p1-score-total-label')
const p2TotalLabel = document.getElementById('p2-score-total-label')
let p1TotalValue = document.getElementById('p1-score-total-value')
let p2TotalValue = document.getElementById('p2-score-total-value')
const roundNavBtns = document.getElementById('round-nav-btns')
const round1Btn = document.getElementById('round-1')
const round2Btn = document.getElementById('round-2')
const round3Btn = document.getElementById('round-3')
const round4Btn = document.getElementById('round-4')
const round5Btn = document.getElementById('round-5')
const scoreTotalCard = document.getElementById('score-totals')
const clearDataBtn = document.getElementById('clear-data')
const fetchDataBtn = document.getElementById('fetch-data')
const p1ScoreTotalCard = document.getElementById('p1-score-total')
const p2ScoreTotalCard = document.getElementById('p2-score-total')
const fetchedData = document.getElementById('fetch-data-section')

fetchedData.hidden = false;


// let roundData = {
//   p1Name : "Player 1",
//   p2Name : "Player 2",
//   p1Army : "P1 Army",
//   p2Army : "P2 Army",
//   p1GrandStrat : "P1 Grand",
//   p2GrandStrat : "P2 Grand",
//   battlePlan : "Battle Plan 1",
//   p1TotalScore : 0,
//   p2TotalScore : 0,
// }



const armySelect = (armyList, armyClick) => {
  for(let i = 0; i < armyList.length; i++) {
    let option = document.createElement('option');
    option.value = armyList[i];
    option.text = armyList[i];
    armyClick.appendChild(option);
  }
}

const grandSelect = (grandList, parent) => {
  for(let i = 0; i < grandList.length; i++) {
    let option = document.createElement('option');
    option.value = grandList[i];
    option.text = grandList[i];
    parent.appendChild(option)
  }
}

const battleTacticSelect = (battleTacticList, parent) => {
  if(Array.isArray(battleTacticList)){
    for(let i = 0; i < battleTacticList.length; i++) {
      let option = document.createElement('option');
      option.value = battleTacticList[i];
      option.text = battleTacticList[i];
      parent.appendChild(option)
    }
  }else{
    let option = document.createElement('option')
    option.value = battleTacticList
    option.text = battleTacticList
    parent.appendChild(option)
  }
}

const submitForm = (e) => {
  // console.log('SubmitForm')
  const eventPath = e.composedPath()
  let btnArr = eventPath[1]

  
  let playerInfo = {
    playerName : btnArr[0].value,
    playerArmy : btnArr[1].value,
    playerGrand : [],
    player1 : true
  }
  if(btnArr[0].value === ''){
    playerInfo.playerName = 'Player 1';
  }
  if(btnArr.id == 'p2-form'){
    playerInfo.player1 = false;
    if(btnArr[0].value === ''){
      playerInfo.playerName = 'Player 2';
    }
  }
  
  axios
  .post(baseURL, playerInfo)
  .then((res)=> {
    displayPlayerInfo(res.data);
  })
  .catch(errCallback)
  
  e.preventDefault();
}

const selectArmy = (e) => {
  let armyClick = e.target.id
  if(armyClick == 'p1-army-select') {
    armyClick = p1ArmySelect;
    p1SubmitBtn.hidden = false;
    p1SubmitBtn.addEventListener('click', submitForm);
  }else if(armyClick == 'p2-army-select'){
    armyClick = p2ArmySelect;
    p2SubmitBtn.hidden = false;
    p2SubmitBtn.addEventListener('click', submitForm);
  }else{
    alert('You have to choose an army!')
    console.log('something went wrong clicking armies')
  }
  axios
    .get(baseURL)
    .then((res) => {
      armySelect(res.data, armyClick)
    })
    .catch(errCallback)
  e.preventDefault();
}

const confirmInfo = (e) => {
  path = e.composedPath()
  let btnPath = path[2]

  playerInfo = {
    playerName : btnPath[0].value,
    playerArmy : btnPath[1].value,
    playerGrand : btnPath[3].value,
    player1 : true
  }
  if(btnPath[0].value === ''){
    playerInfo.playerName = 'Player 1';
  }
    
  if(btnPath.id == 'p2-form'){
    playerInfo.player1 = false
    if(btnPath[0].value === ''){
     playerInfo.playerName = 'Player 2';
    }
  }
  console.log('This is the confirmInfo:')
  console.log(playerInfo)

  axios
    .put(baseURL, playerInfo)
    .then((res) => {
      promptBattle(res.data)
    })
  e.preventDefault();
}

const promptBattle = (bodyObj) =>{
  let { playerName, playerArmy, playerGrand, player1 } = bodyObj;
  console.log(playerName)
  const promptSection = document.createElement('div')
  const promptText = document.createElement('p')
  promptSection.className = 'prompt-section'
  promptText.className = 'prompt-section-text'
  promptSection.id = `${playerName}-info-card`
  promptText.id = `${playerName}-prompt-text`

  let p1Msg = false;
  let p2Msg = false;

  player1 ?
  promptText.innerHTML = `${playerName}'s ${playerArmy} will attempt ${playerGrand} against`:
  promptText.innerHTML = `${playerName}'s ${playerArmy} while they attempt ${playerGrand}`

  if(player1 == true){
    p1Form.replaceChildren(promptSection)
    promptSection.append(promptText);
    p1TotalLabel.innerHTML = `${playerName}'s Total Score:`
    p1Msg = true;
    console.log(p1Msg)
  }else if(player1 == false) {
    p2Form.replaceChildren(promptSection)
    promptSection.append(promptText);
    p2TotalLabel.innerHTML = `${playerName}'s Total Score:`
    p2Msg = true;
    console.log(p2Msg)
  }else {
    console.log('Something went wrong prompting the messages')
  }

  if((p1Msg = true) && (p2Msg == true)){
    fetchedData.hidden = true;
    const beginGameBtn = document.createElement('button')
    beginGameBtn.id = 'begin-game-btn'
    beginGameBtn.innerHTML = 'Begin Game'
    playerForms.append(beginGameBtn);
    beginGameBtn.addEventListener('click', createBattleRoundCard)
  }

}


const displayRound = (bodyObj) => {
  let { round, p1Name, p2Name, p1Army, p2Army, p1GrandStrat,
    p2GrandStrat, p1BattleTactic, p2BattleTactic,
    battlePlan, p1Score,p2Score, p1TotalScore, p2TotalScore, p1GoesFirst } = bodyObj;

  
  p1ScoreTotalCard.hidden = false;
  p2ScoreTotalCard.hidden = false;
  

console.log(`The P1TotalScore: ${p1TotalScore}`)
console.log(`The P2TotalScore: ${p2TotalScore}`)

const nextRound = round + 1

/// create battle round card and buttons
  const battleCard = document.createElement('div')
  const nextRoundBtn = document.createElement('button')
  const deleteRoundBtn = document.createElement('button')
  const finishGameBtn = document.createElement('button')

  battleCard.id = 'battle-card';
  nextRoundBtn.id = 'next-round-btn';
  deleteRoundBtn.id = 'delete-round-btn'
  finishGameBtn.id = 'finish-game-btn'

  battleCard.innerHTML = `<h1>BattleRound ${bodyObj.round}</h1>`
  nextRoundBtn.innerHTML = `Go To Round ${nextRound}`;
  deleteRoundBtn.innerHTML = `Delete Round ${round}`
  finishGameBtn.innerHTML = 'Finish Game'

/// set p1 and p2 scores to display  
  p1TotalValue.textContent = p1TotalScore;
  p2TotalValue.textContent = p2TotalScore;

/// create p1 round card
  const p1RoundCard = document.createElement('form')
  const p1ScoreLabel = document.createElement('label')
  const p1ScoreInput = document.createElement('input')
  const p1BattleTacticSelect = document.createElement('select')
  const p1BattleTacticLabel = document.createElement('label')
  
  p1RoundCard.className = 'player-round-card'
  p1RoundCard.id = 'p1-round-card'
  p1ScoreInput.id = 'p1-score-input'
  p1ScoreInput.type = 'number'
  p1ScoreInput.min = 0
  p1ScoreInput.value = p1Score
  p1ScoreLabel.htmlFor = 'p1-score-input'
  p1BattleTacticSelect.id = 'p1-battle-tactic-select'
  p1BattleTacticLabel.htmlFor = 'p1-battle-tactic-select'

  p1ScoreLabel.innerHTML = `${p1Name}'s Score:`
  p1BattleTacticLabel.innerHTML = `${p1Army} BattleTactic:`

  battleTacticSelect(p1BattleTactic, p1BattleTacticSelect)

/// create p2 round card
  const p2RoundCard = document.createElement('form')
  const p2ScoreLabel = document.createElement('label')
  const p2ScoreInput = document.createElement('input')
  const p2BattleTacticSelect = document.createElement('select')
  const p2BattleTacticLabel = document.createElement('label')

  p2RoundCard.className = 'player-round-card'
  p2RoundCard.id = 'p2-round-card'
  p2ScoreInput.id = 'p2-score-input'
  p2ScoreInput.type = 'number'
  p2ScoreInput.min = 0
  p2ScoreInput.value = p2Score
  p2ScoreLabel.htmlFor = 'p2-score-input'
  p2BattleTacticSelect.id = 'p2-battle-tactic-select'
  p2BattleTacticLabel.htmlFor = 'p2-battle-tactic-select'

  p2ScoreLabel.innerHTML = `${p2Name}'s Score:`
  p2BattleTacticLabel.innerHTML = `${p2Army} BattleTactic:`

  battleTacticSelect(p2BattleTactic, p2BattleTacticSelect)
  
  
  p1RoundCard.append(p1ScoreLabel, p1ScoreInput, p1BattleTacticLabel, p1BattleTacticSelect);
  // p1RoundCard.append(p1ScoreTotalCard)
  p2RoundCard.append(p2ScoreLabel, p2ScoreInput, p2BattleTacticLabel, p2BattleTacticSelect);
  // p2RoundCard.prepend(p2ScoreTotalCard)
  

  
  battleCard.append(p1RoundCard, p2RoundCard)
  // battleCard.prepend(p2RoundCard)
  createCmdPtCard(p1Name, 'p1', battleCard)
  createCmdPtCard(p2Name, 'p2', battleCard)
  // battleCard.prepend(p1ScoreTotalCard, p2ScoreTotalCard)

  
/// update score totals
  p1ScoreInput.addEventListener('input', (e) => {
    p1TotalValue.textContent = parseInt(e.target.value) + parseInt(p1TotalScore)
  })
  p2ScoreInput.addEventListener('input', (e) => {
    p2TotalValue.textContent = parseInt(e.target.value) + parseInt(p2TotalScore)
  })

/// un-hide round buttons
  roundNavBtns.hidden = false
  roundBtnArr = [round1Btn, round2Btn, round3Btn, round4Btn, round5Btn]

  for(i = 0; i <= round-1; i++){
    roundBtnArr[i].hidden = false
  }


  playerForms.replaceChildren(battleCard);
  if(round != 5){
    battleCard.append(nextRoundBtn)
    nextRoundBtn.addEventListener('click', createBattleRoundCard)
  }else if(round === 5){
    battleCard.append(finishGameBtn)
    finishGameBtn.addEventListener('click', createBattleRoundCard)
  }
  
  
  battleCard.append(deleteRoundBtn)
  deleteRoundBtn.addEventListener('click', deleteRound)
  
}

// const priorityClick = (player) => player = true;

const clearRoundData = (event) => {
  // console.log(event.target)
  let path = event.target.id
  if(path === 'clear-data'){
    console.log('Front-end clearing data..')
    if(fetchedData.lastElementChild.innerHTML != 'Fetch'){
      fetchedData.lastElementChild.remove()
      axios
      .delete(baseURL)
      .then((res) => {
        console.log('Data cleared')
      })
    }else{
      alert(`There's nothing left to clear!`)
      console.log(`There's nothing left to clear!`)
    }
  }else {
    axios
      .delete(baseURL)
      .then((res) => {
        createBattleRoundCard();
      })
  }
}

const updateRound = (round) => {
  path = round.composedPath()

  // console.log(path);
  let roundPath = ''
  let p1BattleTacticPath = ''
  let p2BattleTacticPath = ''
  let p1ScorePath = ''
  let p2ScorePath = ''
  
  if(path[0].id === 'next-round-btn' || path[0].id === 'finish-game-btn'){
    roundPath = path[1].children[2].innerHTML.charAt(12);
    
    let p1Path = path[1].children[3]
    p1ScorePath = Number(p1Path[0].value)
    p1BattleTacticPath = p1Path[1].value
    
    let p2Path = path[1].children[4]
    p2ScorePath = Number(p2Path[0].value)
    p2BattleTacticPath = p2Path[1].value
  }else if(path[0].id){

  }else {
    roundPath = Number(path[0].innerHTML)

    let playerPath = path[2].children[0].children[0]

    let p1Path = playerPath.children[3]
    p1ScorePath = Number(p1Path[0].value)
    p1BattleTacticPath = p1Path[1].value
    
    let p2Path = playerPath.children[4]
    p2ScorePath = Number(p2Path[0].value)
    p2BattleTacticPath = p2Path[1].value
  }
  
  let roundInfo = {
    round : Number(roundPath),
    p1BattleTactic : p1BattleTacticPath,
    p2BattleTactic : p2BattleTacticPath,
    p1Score : p1ScorePath,
    p2Score : p2ScorePath,
  }

  console.log(`updateRound: `)
  console.log(roundInfo)
  
  axios
    .put(`${baseURL}/${roundPath}`, roundInfo)
    .then(res => {
      // console.log(res)
      console.log('Updating complete')
      // storePlayerInfo(res.data)
      // let newRoundData = Object.assign(roundData, res.data);
    })
}

// const storePlayerInfo = (objInfo) => {
//   roundData = Object.assign(objInfo)
//   // console.log(roundData)
// }

const makeRounds = () => {
  axios
    .post('http://localhost:4004/api/start')
    .then((res) => {
      console.log(`makeRounds: `)
      console.log(res.data)
    })
    .catch(errCallback)
}

const createBattleRoundCard = (e) => {
  console.log(`createBattleRoundCard: `)
  const btnCheck = e.target.innerHTML
  // console.log(btnCheck)
  let round = btnCheck.charAt(12);

  if(btnCheck === 'Begin Game'){
    console.log(`createBRC btnCheck: Begin Game`)
    // clearRoundData(e);
    makeRounds();
    round = 1
    axios
    .put(`http://localhost:4004/api/battleround`, {round})
    .then((res) => {
      displayRound(res.data);
    })
  }else{
    console.log(`createBRC else statement(round): ${round}`)
    updateRound(e);
    // let playerInfo = storePlayerInfo()
    axios
    .put(`http://localhost:4004/api/battleround`, {round})
    .then((res) => {
      // console.log(round.target.textContent)
      if((e.target.textContent) == 'Finish Game'){
        displayResults(res.data)
      }else{
        displayRound(res.data);
      }
    })
  } 
}

const getBattleRound = (roundBtn) => {
  console.log(`getBattleRound: `);
  let path = roundBtn.target.id
  let round = roundBtn.target.innerHTML;
  if(path === 'fetch-data') {
    console.log(`getBR path is 'fetch-data': `)
    axios
      .get(`http://localhost:4004/api/allrounds`)
      .then((res) => {
        showFetchedData(res.data)
      })
  }else {
    console.log(`getBR else statement(roundBtn): ${roundBtn}`)
    updateRound(roundBtn)
    axios
      .get(`${baseURL}/${round}`)
      .then((res) => {
        displayRound(res.data);
      })
  }
}

const showFetchedData = (objArr) => {
  objArr.forEach(element => console.log(element))

  const dataTable = document.createElement('table')
  dataTable.id = 'data-table'
  
  objArr.forEach(element => {
    let tableRow1 = document.createElement('tr')
    let tableRow2 = document.createElement('tr')
    
    for (const [key, value] of Object.entries(element)) {
      let tableHeader = document.createElement('th')
      let tableCell = document.createElement('td')
      tableHeader.textContent = `${key}`
      tableRow1.appendChild(tableHeader)
      tableCell.textContent = `${value}`
      tableRow2.appendChild(tableCell)
    }
    dataTable.appendChild(tableRow1)
    dataTable.appendChild(tableRow2)
  })
  
  if ((fetchedData.lastElementChild.id) == 'data-table'){
    fetchedData.removeChild(fetchedData.lastElementChild)
    fetchedData.appendChild(dataTable)
  }else {
    fetchedData.appendChild(dataTable)
  }
}



const deleteRound = (currRound) => {
  let thisRound = currRound.target.innerHTML
  // console.log(thisRound.charAt(13))
  let round = thisRound.charAt(13);
  roundBtnArr = [round1Btn, round2Btn, round3Btn, round4Btn, round5Btn]
  // roundBtnArr[round-1].hidden = true;

  axios
    .delete(`${baseURL}/${round}`)
    .then((res) => {
      displayRound(res.data)
    })
}


const displayResults = (bodyObj) => {
  let { p1Name, p2Name, p1Army, p2Army, p1GrandStrat, 
        p2GrandStrat, battlePlan, p1TotalScore, p2TotalScore } = bodyObj;

  const resultsPage = document.createElement('div')
  const p1ResultsSection = document.createElement('section')
  const p2ResultsSection = document.createElement('section')
  const p1ResultsText = document.createElement('p')
  const p2ResultsText = document.createElement('p')
  const winnerText = document.createElement('p')
  const p1GrandCheck = document.createElement('input')
  const p2GrandCheck = document.createElement('input')
  const p1GrandLabel = document.createElement('label')
  const p2GrandLabel = document.createElement('label')
  resultsPage.id = 'results-page'
  p1ResultsSection.id = 'p1-results-section'
  p2ResultsSection.id = 'p2-results-section'
  p1ResultsText.id = 'p1-results-text'
  p2ResultsText.id = 'p2-results-text'
  winnerText.id = 'winner-text'
  p1GrandCheck.id = 'p1-grand-check'
  p2GrandCheck.id = 'p2-grand-check'
  p1GrandLabel.htmlFor = 'p1-grand-check'
  p2GrandLabel.htmlFor = 'p2-grand-check'
  p1GrandCheck.type ='checkbox'
  p2GrandCheck.type = 'checkbox'
  p1GrandLabel.innerHTML = `Did ${p1Name} complete ${p1GrandStrat}?`
  p2GrandLabel.innerHTML = `Did ${p2Name} complete ${p2GrandStrat}?`

  
  p1GrandCheck.addEventListener('click', () => {
    if(p1GrandCheck.checked){
      p1TotalValue.textContent = p1TotalScore + 2
      p1ResultsText.innerHTML = `${p1Name}'s ${p1Army} scored ${p1TotalValue.textContent} this game`
    }else{
      p1TotalValue.textContent = p1TotalScore
      p1ResultsText.innerHTML = `${p1Name}'s ${p1Army} scored ${p1TotalValue.textContent} this game`
    }
    if(p1TotalValue.textContent > p2TotalValue.textContent){
      winnerText.innerHTML = `${p1Name} is Victorious!`
    }else if(p1TotalValue.textContent < p2TotalValue.textContent){
      winnerText.innerHTML = `${p2Name} is Victorious!`
    }else if(p1TotalValue.textContent == p2TotalValue.textContent){
      winnerText.innerHTML = `This game ends in a draw!`
    }else{
      winnerText.innerHTML = `These scores just aren't adding up!`
    }
  })

  p2GrandCheck.addEventListener('click', () => {
    if(p2GrandCheck.checked){
      p2TotalValue.textContent = p2TotalScore + 2
      p2ResultsText.innerHTML = `${p2Name}'s ${p2Army} scored ${p2TotalValue.textContent} this game`
    }else{
      p2TotalValue.textContent = p2TotalScore
      p2ResultsText.innerHTML = `${p2Name}'s ${p2Army} scored ${p2TotalValue.textContent} this game`
    }
    if(p1TotalValue.textContent > p2TotalValue.textContent){
      winnerText.innerHTML = `${p1Name} is Victorious!`
    }else if(p1TotalValue.textContent < p2TotalValue.textContent){
      winnerText.innerHTML = `${p2Name} is Victorious!`
    }else if(p1TotalValue.textContent == p2TotalValue.textContent){
      winnerText.innerHTML = `This game ends in a draw!`
    }else{
      winnerText.innerHTML = `These scores just aren't adding up!`
    }
  })

  playerForms.replaceChildren(resultsPage);
  resultsPage.append(p1ResultsSection,p2ResultsSection)
  p1ResultsSection.appendChild(p1GrandLabel)
  p2ResultsSection.appendChild(p2GrandLabel)
  p1ResultsSection.appendChild(p1GrandCheck)
  p2ResultsSection.appendChild(p2GrandCheck)
  p1ResultsSection.appendChild(p1ResultsText)
  p2ResultsSection.appendChild(p2ResultsText)
  resultsPage.append(winnerText)
}





const displayPlayerInfo = (bodyObj) => {
  let { playerName, playerArmy, playerGrand, player1 } = bodyObj;
  console.log(bodyObj)
  // playerGrand.forEach(element => console.log(element))
  const playerText = document.createElement('p')
  const grandOption = document.createElement('select')
  const confirmBtn = document.createElement('button')
  playerText.id = `${playerName}-text`;
  grandOption.id = `${playerName}-grand`
  confirmBtn.id = `${playerName}-confirm`;
  playerText.innerHTML = `${playerName} has chosen ${playerArmy} to fight. Their Grand Strategy is:`
  grandSelect(playerGrand,grandOption)
  confirmBtn.innerHTML = `Confirm`
  playerText.append(grandOption, confirmBtn);

  confirmBtn.addEventListener('click', confirmInfo);

  if(player1 == true){
    if((p1Form.lastElementChild.id) == `get-p1-info`){
      p1Form.append(playerText)
    }else{
      p1Form.lastElementChild.remove()
      p1Form.append(playerText)
    }
  }else if(player1 == false){
    if((p2Form.lastElementChild.id) == `get-p2-info`){
      p2Form.append(playerText)
    }else{
      p2Form.lastElementChild.remove()
      p2Form.append(playerText)
    }
  }else{
    console.log('something went wrong displaying player info')
  }
}

// Command Point Handler

const createCmdPtCard = (name, player, roundCard) => {
  const cmdPtCard = document.createElement('div')
  const cmdPtLabel = document.createElement('h3')
  const cmdPts = document.createElement('h2')
  const plusBtn = document.createElement('button')
  const minusBtn = document.createElement('button')
  const resetBtn = document.createElement('button')
  cmdPtCard.className = 'cmd-pt-card'
  cmdPtCard.id = `${player}-cmd-pt-card`
  cmdPtLabel.id = `${player}-cmd-pt-label`
  cmdPts.id = `${player}-command-points`
  plusBtn.id = `${player}-plus-btn`
  minusBtn.id = `${player}-minus-btn`
  resetBtn.id = `${player}-reset-btn`
  cmdPts.innerHTML = 0
  cmdPtLabel.innerHTML = `${name}'s Command Points`
  plusBtn.innerHTML = '+'
  minusBtn.innerHTML = '-'
  resetBtn.innerHTML = "Reset"
  
  
  roundCard.prepend(cmdPtCard);
  cmdPtCard.append(cmdPtLabel, cmdPts, minusBtn, resetBtn, plusBtn);
  
  
  let currCmdPts = 0

  function setCmdPtsDisplay() {
    cmdPts.textContent = currCmdPts;
  }

  function increaseCmdPts() {
    currCmdPts++;
    setCmdPtsDisplay();
  }

  function decreaseCmdPts(evt) {
    if(currCmdPts != 0){
      currCmdPts--;
      setCmdPtsDisplay();
    }else{
      evt.preventDefault();
    }
  }

  function resetCmdPts() {
    currCmdPts = 0;
    setCmdPtsDisplay();
  }
  
  plusBtn.addEventListener('click', increaseCmdPts);
  minusBtn.addEventListener('click', decreaseCmdPts);
  resetBtn.addEventListener('click', resetCmdPts);

}



      
    
    p1ArmySelect.addEventListener('click', selectArmy);
    p2ArmySelect.addEventListener('click', selectArmy);

    clearDataBtn.addEventListener('click', clearRoundData);
    fetchDataBtn.addEventListener('click', getBattleRound);
    

    round1Btn.addEventListener('click', getBattleRound);
    round2Btn.addEventListener('click', getBattleRound);
    round3Btn.addEventListener('click', getBattleRound);
    round4Btn.addEventListener('click', getBattleRound);
    round5Btn.addEventListener('click', getBattleRound);

/* 

              Unused Functions (future)

                                                */

// const whoGoesFirst = (p1Name, p2Name) => {
//   console.log('who goes first begins!')
//   let p1Priority = true
//   let p2Priority = true
//   const playerPriority = document.createElement('div')
//   const p1priorityBtn = document.createElement('button')
//   const p2priorityBtn = document.createElement('button')
//   const p1priorityLabel = document.createElement('label')
//   const p2priorityLabel = document.createElement('label')
//   playerPriority.id = 'player-priority'
//   p1priorityBtn.id = 'p1-priority-btn'
//   p2priorityBtn.id = 'p2-priority-btn'
//   p1priorityBtn.name = 'priority-radio'
//   p2priorityBtn.name = 'priority-radio'
//   p1priorityLabel.id = 'p1-priority-label'
//   p2priorityLabel.id = 'p2-priority-label'
//   p1priorityBtn.type = 'radio'
//   p2priorityBtn.type = 'radio'
//   p1priorityLabel.htmlFor = 'p1-priority-btn'
//   p2priorityLabel.htmlFor = 'p2-priority-btn'
//   p1priorityLabel.innerHTML = `${p1Name} Goes First`
//   p2priorityLabel.innerHTML = `${p2Name} Goes First`
//   playerForms.append(playerPriority)
//   playerPriority.append(p1priorityLabel, p1priorityBtn)
//   playerPriority.append(p2priorityLabel, p2priorityBtn);
//   p1priorityBtn.addEventListener('click', () => {
//     p1Priority = true
//     p2Priority = false
//   })
//   p2priorityBtn.addEventListener('click', () => {
//     p1Priority = false
//     p2Priority = true
//   })
// }