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

let globalRound = 0

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

const createRoundCard = (req, res) => {
  // if(globalRound === 0){
  //   battleRoundList.splice(1);
  //   globalRound++
  // }

  // console.log(req)
  
  let { p1Name, p2Name, p1Army, p2Army, p1GrandStrat, p2GrandStrat, p1TotalScore, p2TotalScore } = playerInfo

  let newBattleRound = { 
    round : globalRound, 
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
    p1GoesFirst : true 
  };

  if(globalRound <= 5){
   battleRoundList.push(newBattleRound)
   res.status(200).send(battleRoundList[globalRound])
   globalRound++
  }else{
    res.status(200).send(playerInfo);
  }
  // console.log(battleRoundList[0])
  // console.log(battleRoundList[1])

}

const getBattleRound = (req, res) => {
  // console.log(req.params)
  let {round} = req.params
  console.log(round)


  res.status(200).send(battleRoundList[round])
}

const deleteBattleRound = (req, res) => {
  // console.log(req.params)
  let {round} = req.params;
  let { p1Name, p2Name, p1Army, p2Army, p1GrandStrat, p2GrandStrat } = playerInfo

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
  battleRoundList.splice(1);
  // console.log(battleRoundList[0])
  globalRound = 1;
  res.status(200)
}

const updateRoundData = (req, res) => {
  console.log(req.params)
  console.log(req.body)
  res.status(200);
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
}