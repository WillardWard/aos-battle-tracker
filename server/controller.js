const armyInfo = require('./db.json');
const {armyName, grandStrat} = armyInfo;

const grandList = [`Defend What's Ours`, `Demonstration of Strength`, `No Place for the Weak`, 
                      `Show of Dominance`, `Take What's Theirs`, `Tame the Land`];

const battleTacticList = [`Against the Odds`, `An Eye for an Eye`, `Barge Through Enemy Lines`,
                            `Desecrate their Lands`, `Gaining Momentum`, `Head-to-Head`, 
                            `Outmuscle`, `This One's Mine!`];
                            
let p1BTListGlobal = []
let p2BTListGlobal = []


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

const getBattleTacticList = (playerArmy) => {
  const filteredBattleTactic = armyInfo.filter((obj)=> {
    return obj.armyName === playerArmy;
  })
  armyBattleTacticList = filteredBattleTactic[0].battleTactic
  playerBattleTacticList = battleTacticList.concat(armyBattleTacticList)
  return playerBattleTacticList
}

const playerSubmit = (req, res) => {
  let { playerName, playerArmy, playerGrand, player1 } = req.body;
  
  const filteredGrand = armyInfo.filter((obj)=> {
    return obj.armyName === playerArmy;
  })
  armyGrandList = filteredGrand[0].grandStrat
  playerGrandList = grandList.concat(armyGrandList)
  
  if(player1 == true) {
    battleRoundList[0].p1Name = playerName
    battleRoundList[0].p1Army = playerArmy
    battleRoundList[0].p1GrandStrat = playerGrandList
  }else if(player1 == false) {
    battleRoundList[0].p2Name = playerName
    battleRoundList[0].p2Army = playerArmy
    battleRoundList[0].p2GrandStrat = playerGrandList
  }
  
  req.body.playerGrand = playerGrandList
  res.status(200).send(req.body)
}

const confirmInfo = (req, res) => {
  let { playerName, playerArmy, playerGrand, player1 } = req.body;

  if(player1 == true) {
    battleRoundList[0].p1Name = playerName
    battleRoundList[0].p1Army = playerArmy
    battleRoundList[0].p1GrandStrat = playerGrand
    p1BTListGlobal = getBattleTacticList(playerArmy)
  }else if(player1 == false) {
    battleRoundList[0].p2Name = playerName
    battleRoundList[0].p2Army = playerArmy
    battleRoundList[0].p2GrandStrat = playerGrand
    p2BTListGlobal = getBattleTacticList(playerArmy)
  }

  res.status(200).send(req.body);
}

const updateRoundData = (req, res) => { 
  let { round, p1BattleTactic, p2BattleTactic, p1Score, p2Score } = req.body;

  const findP1BT = p1BTListGlobal.filter((battleTacticList)=> {
    return battleTacticList !== p1BattleTactic;
  })
  p1BTListGlobal = findP1BT
  const findP2BT = p2BTListGlobal.filter((battleTacticList)=> {
    return battleTacticList !== p2BattleTactic;
  })
  p2BTListGlobal = findP2BT
  
  let index = battleRoundList.findIndex(elem => elem.round === +req.body.round)
  battleRoundList[index] = { 
    round : round, 
    p1Name : battleRoundList[index].p1Name, 
    p2Name : battleRoundList[index].p2Name, 
    p1Army : battleRoundList[index].p1Army, 
    p2Army : battleRoundList[index].p2Army, 
    p1GrandStrat : battleRoundList[index].p1GrandStrat,                   
    p2GrandStrat : battleRoundList[index].p2GrandStrat, 
    p1BattleTactic : p1BattleTactic, 
    p2BattleTactic : p2BattleTactic,                  
    battlePlan : battleRoundList[index].battlePlan, 
    p1Score : p1Score,
    p2Score : p2Score, 
    p1TotalScore : (battleRoundList[index-1].p1TotalScore) + p1Score,
    p2TotalScore : (battleRoundList[index-1].p2TotalScore) + p2Score,
    p1GoesFirst : true 
  };
 
  res.status(200).send(battleRoundList[index]);
}

const createRoundCard = (req, res) => {
  let {round} = req.body
  round = Number(round)

  let index = battleRoundList.findIndex(elem => elem.round === +req.body.round)
  if(index > 0 && index <= 5){
    battleRoundList[index] = { 
      round : round, 
      p1Name : battleRoundList[index].p1Name, 
      p2Name : battleRoundList[index].p2Name, 
      p1Army : battleRoundList[index].p1Army, 
      p2Army : battleRoundList[index].p2Army, 
      p1GrandStrat : battleRoundList[index].p1GrandStrat,                   
      p2GrandStrat : battleRoundList[index].p2GrandStrat, 
      p1BattleTactic : battleRoundList[index].p1BattleTactic = p1BTListGlobal, 
      p2BattleTactic : battleRoundList[index].p2BattleTactic = p2BTListGlobal,                  
      battlePlan : battleRoundList[index].battlePlan, 
      p1Score : battleRoundList[index].p1Score,
      p2Score : battleRoundList[index].p1Score, 
      p1TotalScore : battleRoundList[index-1].p1TotalScore,
      p2TotalScore : battleRoundList[index-1].p2TotalScore,
      p1GoesFirst : true 
    };
    
    res.status(200).send(battleRoundList[index])
  }else{
    res.status(200).send(battleRoundList[5]);
  }
}

const getBattleRound = (req, res) => {
  let {round} = req.params
  res.status(200).send(battleRoundList[round])
}

const deleteBattleRound = (req, res) => {
  let {round, p1Score, p2Score} = req.params;
  let index = battleRoundList.findIndex(elem => elem.round === +req.params.round)
  battleRoundList[index] = { 
    round : round, 
    p1Name : battleRoundList[index].p1Name, 
    p2Name : battleRoundList[index].p2Name, 
    p1Army : battleRoundList[index].p1Army, 
    p2Army : battleRoundList[index].p2Army, 
    p1GrandStrat : battleRoundList[index].p1GrandStrat,                   
    p2GrandStrat : battleRoundList[index].p2GrandStrat, 
    p1BattleTactic : 'BattleTacticList', 
    p2BattleTactic : 'BattleTacticList',                  
    battlePlan : battleRoundList[index].battlePlan, 
    p1Score : 0,
    p2Score : 0, 
    p1TotalScore : battleRoundList[index].p1TotalScore - p1Score,
    p2TotalScore : battleRoundList[index].p2TotalScore - p2Score,
    p1GoesFirst : true 
  };

  if(index > 1){
    res.status(200).send(battleRoundList[index])
  }else{
    res.status(200).send(battleRoundList[1])
  }
}

const getResults = (req, res) => {
  let playerResults = battleRoundList[5]
  res.status(200).send(playerResults) 
}

const clearRoundData = (req, res) => {
  console.log('Server clearing data')
  battleRoundList.splice(1);
  battleRoundList.forEach(element => console.log(element))
  res.status(200)
}

const getAllRounds = (req, res) => {
  res.status(200).send(battleRoundList)
}

const makeRounds = (req, res) => {
  for(let i = 1; i <= 5; i++) {
    battleRoundList.push(
    {
      round : i,
      p1Name : battleRoundList[0].p1Name,
      p2Name : battleRoundList[0].p2Name,
      p1Army : battleRoundList[0].p1Army,
      p2Army : battleRoundList[0].p2Army,
      p1GrandStrat : battleRoundList[0].p1GrandStrat,
      p2GrandStrat : battleRoundList[0].p2GrandStrat,
      p1BattleTactic : battleRoundList[0].p1BattleTactic,
      p2BattleTactic : battleRoundList[0].p2BattleTactic,
      battlePlan : battleRoundList[0].battlePlan,
      p1Score : battleRoundList[0].p1Score,
      p2Score : battleRoundList[0].p2Score,
      p1TotalScore : battleRoundList[0].p1TotalScore,
      p2TotalScore : battleRoundList[0].p2TotalScore,
      p1GoesFirst : true,
    })
  }
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