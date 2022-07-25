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
const round1Btn = document.getElementById('round-1')
const round2Btn = document.getElementById('round-2')
const round3Btn = document.getElementById('round-3')
const round4Btn = document.getElementById('round-4')
const round5Btn = document.getElementById('round-5')



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
  if(btnArr.id == 'p2-form'){
    playerInfo.player1 = false;
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
    p1SubmitBtn.addEventListener('click', submitForm)
  }else if(armyClick == 'p2-army-select'){
    armyClick = p2ArmySelect;
    p2SubmitBtn.addEventListener('click', submitForm)
  }else{
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
  // console.log(path)
  let btnPath = path[2]
  // console.log(btnPath.id)
  
    playerInfo = {
      playerName : btnPath[0].value,
      playerArmy : btnPath[1].value,
      playerGrand : btnPath[3].value,
      player1 : true
    }

  // console.log(btnPath[3].value)
    
  if(btnPath.id == 'p2-form'){
  playerInfo.player1 = false
  playerInfo.playerGrand = btnPath[2].value
  console.log(btnPath[2].value)
  }

  axios
    .put(baseURL, playerInfo)
    .then((res) => {
      promptBattle(res.data)
    })
  e.preventDefault();
}

const promptBattle = (bodyObj) =>{
  let { playerName, playerArmy, playerGrand, player1 } = bodyObj;
  const promptSection = document.createElement('div')
  const promptText = document.createElement('p')
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
    battlePlan, p1Score,p2Score, p1GoesFirst } = bodyObj;


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
  nextRoundBtn.innerHTML = 'Next Round';
  deleteRoundBtn.innerHTML = `Delete Round ${round}`
  finishGameBtn.innerHTML = 'Finish Game'

/// set p1 and p2 scores to display  
  p1TotalValue.innerHTML = p1Score;
  p2TotalValue.innerHTML = p2Score;

/// create p1 round card
  const p1RoundCard = document.createElement('form')
  const p1ScoreLabel = document.createElement('label')
  const p1ScoreInput = document.createElement('input')
  const p1BattleTacticSelect = document.createElement('select')
  const p1BattleTacticLabel = document.createElement('label')

  p1RoundCard.id = 'p1-round-card'
  p1ScoreInput.id = 'p1-score-input'
  p1ScoreInput.type = 'number'
  p1ScoreLabel.htmlFor = 'p1-score-input'
  p1BattleTacticSelect.id = 'p1-battle-tactic-select'
  p1BattleTacticLabel.htmlFor = 'p1-battle-tactic-select'

  p1ScoreLabel.innerHTML = `${p1Name}'s Score:`
  p1BattleTacticLabel.innerHTML = `${p1Name}'s BattleTactic:`

/// create p2 round card
  const p2RoundCard = document.createElement('form')
  const p2ScoreLabel = document.createElement('label')
  const p2ScoreInput = document.createElement('input')
  const p2BattleTacticSelect = document.createElement('select')
  const p2BattleTacticLabel = document.createElement('label')

  p2RoundCard.id = 'p2-round-card'
  p2ScoreInput.id = 'p2-score-input'
  p2ScoreInput.type = 'number'
  p2ScoreLabel.htmlFor = 'p2-score-input'
  p2BattleTacticSelect.id = 'p2-battle-tactic-select'
  p2BattleTacticLabel.htmlFor = 'p2-battle-tactic-select'

  p2ScoreLabel.innerHTML = `${p2Name}'s Score:`
  p2BattleTacticLabel.innerHTML = `${p2Name}'s BattleTactic:`
  
  
  p1RoundCard.append(p1ScoreLabel, p1ScoreInput, p1BattleTacticLabel, p1BattleTacticSelect);
  p2RoundCard.append(p2ScoreLabel, p2ScoreInput, p2BattleTacticLabel, p2BattleTacticSelect);
  battleCard.append(p1RoundCard,p2RoundCard)
  
/// update score totals
  p1ScoreInput.addEventListener('input', (e) => {
    p1TotalValue.innerHTML = parseInt(e.target.value) + parseInt(p1Score)
  })
  p2ScoreInput.addEventListener('input', (e) => {
    p2TotalValue.innerHTML = parseInt(e.target.value) + parseInt(p2Score)
  })

/// un-hide round buttons
  // if(round == 1){
  //   round1Btn.hidden = false;
  // }else if(round == 2){
  //   round1Btn.hidden = false;
  //   round2Btn.hidden = false;
  // }else if(round == 3){
  //   round1Btn.hidden = false;
  //   round2Btn.hidden = false;
  //   round3Btn.hidden = false;
  // }else if(round == 4){
  //   round1Btn.hidden = false;
  //   round2Btn.hidden = false;
  //   round3Btn.hidden = false;
  //   round4Btn.hidden = false;
  // }else if(round == 5){
  //   round1Btn.hidden = false;
  //   round2Btn.hidden = false;
  //   round3Btn.hidden = false;
  //   round4Btn.hidden = false;
  //   round5Btn.hidden = false;
  // }else{
  //   console.log(`Something went wrong showing round buttons, current round: ${round}`)
  // }

  roundBtnArr = [round1Btn, round2Btn, round3Btn, round4Btn, round5Btn]

  for(i = 0; i <= round-1; i++){
    roundBtnArr[i].hidden = false
  }


  playerForms.replaceChildren(battleCard);
  if(round != 5){
    battleCard.append(nextRoundBtn)
    nextRoundBtn.addEventListener('click', updateRound)
  }else if(round === 5){
    battleCard.append(finishGameBtn)
    finishGameBtn.addEventListener('click', updateRound)
  }
  createCmdPtCard(p1Name)
  createCmdPtCard(p2Name)
  
  battleCard.append(deleteRoundBtn)
  deleteRoundBtn.addEventListener('click', deleteRound)
  
}

const clearRoundData = () => {
  axios
    .delete(baseURL)
    .then((res) => {
      createBattleRoundCard();
    })
}

const createBattleRoundCard = (round) => {
  // console.log(round.target)
  const btnCheck = round.target.innerHTML

  if(btnCheck === 'Begin Game'){
    clearRoundData();
  }

  // round = 1;
  axios
    .post(`${baseURL}/${round}`)
    .then((res) => {
      // console.log(round.target.textContent)
      if((round.target.textContent) == 'Finish Game'){
        displayResults(res.data)
      }else{
        displayRound(res.data);
      }
    })
}

const getBattleRound = (roundBtn) => {
  console.log(roundBtn.target.innerHTML);
  let round = roundBtn.target.innerHTML;

  axios
    .get(`${baseURL}/${round}`)
    .then((res) => {
      displayRound(res.data);
    })
}

const updateRound = (round) => {
  path = round.composedPath()
  let btnPath = path[1].firstChild.innerHTML.charAt(12);
  
  axios
    .put(`${baseURL}/${btnPath}`)
    .then(() => {
      createBattleRoundCard();
    })
}

const deleteRound = (currRound) => {
  let thisRound = currRound.target.innerHTML
  // console.log(thisRound.charAt(13))
  let round = thisRound.charAt(13);

  axios
    .delete(`${baseURL}/${round}`)
    .then((res) => {
      displayRound(res.data)
    })
}

// const finishGame = () => {
//   axios
//     .get(`${baseURL}/results`)
//     .then((res) => {
//       console.log(res)
//       console.log(res.data)
//       displayResults(res.data);
//     })
// }

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
      p1TotalValue.innerHTML = p1TotalScore + 2
      p1ResultsText.innerHTML = `${p1Name}'s ${p1Army} scored ${p1TotalValue.innerHTML} this game`
    }else{
      p1TotalValue.innerHTML = p1TotalScore
      p1ResultsText.innerHTML = `${p1Name}'s ${p1Army} scored ${p1TotalValue.innerHTML} this game`
    }
    if(p1TotalValue.innerHTML > p2TotalValue.innerHTML){
      winnerText.innerHTML = `${p1Name} is Victorious!`
    }else if(p1TotalValue.innerHTML < p2TotalValue.innerHTML){
      winnerText.innerHTML = `${p2Name} is Victorious!`
    }else if(p1TotalValue.innerHTML == p2TotalValue.innerHTML){
      winnerText.innerHTML = `This game ends in a draw!`
    }else{
      winnerText.innerHTML = `These scores just aren't adding up!`
    }
  })

  p2GrandCheck.addEventListener('click', () => {
    if(p2GrandCheck.checked){
      p2TotalValue.innerHTML = p2TotalScore + 2
      p2ResultsText.innerHTML = `${p2Name}'s ${p2Army} scored ${p2TotalValue.innerHTML} this game`
    }else{
      p2TotalValue.innerHTML = p2TotalScore
      p2ResultsText.innerHTML = `${p2Name}'s ${p2Army} scored ${p2TotalValue.innerHTML} this game`
    }
    if(p1TotalValue.innerHTML > p2TotalValue.innerHTML){
      winnerText.innerHTML = `${p1Name} is Victorious!`
    }else if(p1TotalValue.innerHTML < p2TotalValue.innerHTML){
      winnerText.innerHTML = `${p2Name} is Victorious!`
    }else if(p1TotalValue.innerHTML == p2TotalValue.innerHTML){
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

// const whoGoesFirst = (p1Name, p2Name) => {
//   const p1priorityBtn = document.createElement('button')
//   const p2priorityBtn = document.createElement('button')
//   p1priorityBtn.id = 'p1-priority-btn'
//   p2priorityBtn.id = 'p2-priority-btn'
//   p1priorityBtn.innerHTML = `${p1Name} Goes First`
//   p2priorityBtn.innerHTML = `${p2Name} Goes First`
//   playerForms.append(p1priorityBtn, p2priorityBtn)
//   p1priorityBtn.addEventListener('click', setPriority)
//   p2priorityBtn.addEventListener('click', setPriority)
// }



const displayPlayerInfo = (bodyObj) => {
  let { playerName, playerArmy, playerGrand, player1 } = bodyObj;
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
    if((p1Form.lastElementChild.id) == `get-p2-info`){
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

const createCmdPtCard = (player) => {
  const cmdPtCard = document.createElement('div')
  const cmdPtLabel = document.createElement('h3')
  const cmdPts = document.createElement('h2')
  const plusBtn = document.createElement('button')
  const minusBtn = document.createElement('button')
  const resetBtn = document.createElement('button')
  cmdPtCard.id = `${player}-cmd-pt-card`
  cmdPtLabel.id = `${player}-cmd-pt-label`
  cmdPts.id = `${player}-command-points`
  plusBtn.id = `${player}-plus-btn`
  minusBtn.id = `${player}-minus-btn`
  resetBtn.id = `${player}-reset-btn`
  cmdPts.innerHTML = 0
  cmdPtLabel.innerHTML = `${player}'s Command Points`
  plusBtn.innerHTML = '+'
  minusBtn.innerHTML = '-'
  resetBtn.innerHTML = "Reset"
  
  playerForms.appendChild(cmdPtCard);
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

    
    

    round1Btn.addEventListener('click', getBattleRound);
    round2Btn.addEventListener('click', getBattleRound);
    round3Btn.addEventListener('click', getBattleRound);
    round4Btn.addEventListener('click', getBattleRound);
    round5Btn.addEventListener('click', getBattleRound);