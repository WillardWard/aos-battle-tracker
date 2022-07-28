const express = require('express');
const cors = require('cors');

const app = express();

app.use(express.json());
app.use(cors());

const {
  getArmyList,
  confirmInfo,
  playerSubmit,
  createRoundCard,
  getBattleRound,
  deleteBattleRound,
  getResults,
  clearRoundData,
  updateRoundData,
  getAllRounds,
  makeRounds,
} = require('./controller')


app.get('/api/battletracker', getArmyList);
app.get('/api/battletracker/:round', getBattleRound)
app.get('/api/allrounds', getAllRounds);
app.get('/api/battletracker/results', getResults); 
app.post('/api/battletracker', playerSubmit)
app.post('/api/start', makeRounds);
app.put('/api/battleround', createRoundCard)
app.put('/api/battletracker', confirmInfo)
app.put('/api/battletracker/:round', updateRoundData)
app.delete('/api/battletracker', clearRoundData)
app.delete('/api/battletracker/:round', deleteBattleRound)



app.listen(4004, () => console.log(`running on 4004`));