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
} = require('./controller')


app.get('/api/battletracker', getArmyList);
app.post('/api/battletracker', playerSubmit)
app.put('/api/battletracker', confirmInfo)
app.post('/api/battletracker/:round', createRoundCard)
app.get('/api/battletracker/:round', getBattleRound)
app.delete('/api/battletracker/:round', deleteBattleRound)
app.get('/api/battletracker/results', getResults); 
app.delete('/api/battletracker', clearRoundData)
app.put('/api/battletracker/:round', updateRoundData)
app.get('/api/allrounds', getAllRounds);



app.listen(4004, () => console.log(`running on 4004`));