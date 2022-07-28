const armyInfo = require('./db.json');
const {armyName, grandStrat} = armyInfo;

let grandList = [`Defend What's Ours`, `Demonstration of Strength`, `No Place for the Weak`, 
                      `Show of Dominance`, `Take What's Theirs`, `Tame the Land`];

let playerInfo = {
  p1Name : "Player 1",
  p2Name : "Player 2",
  p1Army : "P1 Army",
  p2Army : "P2 Army",
  p1GrandStrat : "P1 Grand",
  p2GrandStrat : "P2 Grand",
  battlePlan : "Battle Plan 1",
  p1TotalScore : 0,
  p2TotalScore : 0,
}

// let globalRound = 0

let battleRoundList = [
  {
  round : 0,
  p1Name : "Player 1",
  p2Name : "Player 2",
  p1Army : "Army 1",
  p2Army : "Army 2",
  p1GrandStrat : "Grand Strategy 1",
  p2GrandStrat : "Grand Strategy 2",
  p1BattleTactic : "Battle Tactic 1",
  p2BattleTactic : "Battle Tactic 2",
  battlePlan : "Battle Plan 1",
  p1Score : 0,
  p2Score : 0,
  p1TotalScore : 0,
  p2TotalScore : 0,
  p1GoesFirst : true,
}
]


const getArmyList = (req, res) => {
  const armyList = [];
  armyInfo.forEach(element => armyList.push(element.armyName))
  res.status(200).send(armyList);
}

const playerSubmit = (req, res) => {
  let { playerName, playerArmy, playerGrand, player1 } = req.body;

  // console.log(req.body)

  const filteredGrand = armyInfo.filter((obj)=> {
    return obj.armyName === playerArmy;
  })
  armyGrandList = filteredGrand[0].grandStrat
  playerGrandList = grandList.concat(armyGrandList)

  if(player1 == true) {
    playerInfo.p1Name = playerName
    playerInfo.p1Army = playerArmy
    playerInfo.p1GrandStrat = playerGrandList
  }else if(player1 == false) {
    playerInfo.p2Name = playerName
    playerInfo.p2Army = playerArmy
    playerInfo.p2GrandStrat = playerGrandList
  }

  req.body.playerGrand = playerGrandList
  res.status(200).send(req.body)
}

const confirmInfo = (req, res) => {
  let { playerName, playerArmy, playerGrand, player1 } = req.body;

  if(player1 == true) {
    playerInfo.p1Name = playerName
    playerInfo.p1Army = playerArmy
    playerInfo.p1GrandStrat = playerGrand
  }else if(player1 == false) {
    playerInfo.p2Name = playerName
    playerInfo.p2Army = playerArmy
    playerInfo.p2GrandStrat = playerGrand
  }

  // console.log(battleRound)
  res.status(200).send(req.body);
}

const updateRoundData = (req, res) => {
  
  let { round, p1BattleTactic, p2BattleTactic, p1Score, p2Score } = req.body;
  // console.log(`updateRoundData round = ${round}`)
  // console.log(req.body)
  // console.log(`these are the req.params for updateround:`)
  // console.log(req.params)

  let index = battleRoundList.findIndex(elem => elem.round === +req.body.round)
  battleRoundList[index] = { 
    round : round, 
    p1Name : playerInfo.p1Name, 
    p2Name : playerInfo.p2Name, 
    p1Army : playerInfo.p1Army, 
    p2Army : playerInfo.p2Army, 
    p1GrandStrat : playerInfo.p1GrandStrat,                   
    p2GrandStrat : playerInfo.p2GrandStrat, 
    p1BattleTactic : p1BattleTactic, 
    p2BattleTactic : p2BattleTactic,                  
    battlePlan : playerInfo.battlePlan, 
    p1Score : p1Score,
    p2Score : p2Score, 
    p1TotalScore : (playerInfo.p1TotalScore) += p1Score,
    p2TotalScore : (playerInfo.p2TotalScore) += p2Score,
    p1GoesFirst : true 
  };

  // playerInfo.p1TotalScore += parseInt(p1Score)
  // playerInfo.p2TotalScore += parseInt(p2Score)

  // console.log(battleRoundList[index])
  // console.log(playerInfo)
  
  res.status(200).send(playerInfo);
}

const createRoundCard = (req, res) => {
  let {round} = req.body
  // console.log(`createRoundCard round = ${round}`)
  round = Number(round)
  console.log(round)
  
  
  let { p1Name, p2Name, p1Army, p2Army, p1GrandStrat, p2GrandStrat, battlePlan, p1TotalScore, p2TotalScore } = playerInfo



     battleRoundList[round] = { 
      round : round, 
      p1Name : p1Name, 
      p2Name : p2Name, 
      p1Army : p1Army, 
      p2Army : p2Army, 
      p1GrandStrat : p1GrandStrat,                   
      p2GrandStrat : p2GrandStrat, 
      p1BattleTactic : 'BattleTacticList', 
      p2BattleTactic : 'BattleTacticList',                  
      battlePlan : battlePlan, 
      p1Score : 0,
      p2Score : 0, 
      p1TotalScore : p1TotalScore,
      p2TotalScore : p2TotalScore,
      p1GoesFirst : true 
    };
    
    // console.log(JSON.stringify(newBattleRound))
    // battleRoundList[globalRound] = Object.assign({}, newBattleRound)
    // console.log(battleRoundList[globalRound])
    
    // console.log(`createRoundCard newBattleRound.p1TotalScore: ${newBattleRound.p1TotalScore}`)
    
    if(round > 0 && round <= 5){
      //  battleRoundList.push(battleRoundList[globalRound])
      //  battleRoundList.forEach(element => console.log(element))
       console.log(battleRoundList[round])
      res.status(200).send(battleRoundList[round])
    }else{
      res.status(200).send(playerInfo);
    }
}

const getBattleRound = (req, res) => {
  // console.log(req.params)
  let {round} = req.params
  console.log(battleRoundList[round])


  res.status(200).send(battleRoundList[round])
}

const deleteBattleRound = (req, res) => {
  // console.log(req.params)
  let {round, p1Score, p2Score} = req.params;
  let { p1Name, p2Name, p1Army, p2Army, p1GrandStrat, p2GrandStrat, p1TotalScore, p2TotalScore } = playerInfo

  let index = battleRoundList.findIndex(elem => elem.round === +req.params.round)
  battleRoundList[index] = { 
    round : round, 
    p1Name, 
    p2Name, 
    p1Army, 
    p2Army, 
    p1GrandStrat,                   
    p2GrandStrat, 
    p1BattleTactic : 'BattleTacticList', 
    p2BattleTactic : 'BattleTacticList',                  
    battlePlan : 'Battle Plan', 
    p1Score : 0,
    p2Score : 0, 
    p1TotalScore : p1TotalScore - p1Score,
    p2TotalScore : p2TotalScore - p2Score,
    p1GoesFirst : true 
  };


  // battleRoundList.forEach(element => {
  //   // console.log(element)
  // });

  if(index > 1){
    res.status(200).send(battleRoundList[index-1])
  }else{
    res.status(200).send(battleRoundList[1])
  }
}

const getResults = (req, res) => {
  let playerResults = playerInfo
  // console.log(playerInfo);
  // console.log(req.body)
  // console.log(req.params)
  // console.log(req)
  res.status(200).send(playerResults) 
}

const clearRoundData = (req, res) => {
  console.log('Server clearing data')
  battleRoundList.splice(1);
  makeRounds();
  // console.log(battleRoundList[0])
  res.status(200)
}

const getAllRounds = (req, res) => {
  // let roundList = []
  // battleRoundList.forEach(element => roundList.push(element));
  // console.log(roundList)
  res.status(200).send(battleRoundList)
}

const makeRounds = (req, res) => {

  console.log(playerInfo)

  let { p1Name, p2Name, p1Army, p2Army, p1GrandStrat, p2GrandStrat, p1TotalScore, p2TotalScore } = playerInfo

  for(let i = 1; i <= 5; i++) {
    battleRoundList.push(
    {
      round : i,
      p1Name : p1Name,
      p2Name : p2Name,
      p1Army : p1Army,
      p2Army : p2Army,
      p1GrandStrat : p1GrandStrat,
      p2GrandStrat : p2GrandStrat,
      p1BattleTactic : "Battle Tactic 1",
      p2BattleTactic : "Battle Tactic 2",
      battlePlan : "Battle Plan 1",
      p1Score : 0,
      p2Score : 0,
      p1TotalScore : p1TotalScore,
      p2TotalScore : p2TotalScore,
      p1GoesFirst : true,
    })
  }

  // battleRoundList.forEach(element => console.log(element))
}


module.exports = {
  getArmyList,
  playerSubmit,
  confirmInfo,
  createRoundCard,
  getBattleRound,
  deleteBattleRound,
  getResults,
  clearRoundData,
  updateRoundData,
  getAllRounds,
  makeRounds,
}