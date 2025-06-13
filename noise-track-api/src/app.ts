import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { connectDB } from './services/database';
import router from './routes';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());
app.use('/api', router);

connectDB();

app.listen(PORT, () => {
  console.log(`API rodando em http://localhost:${PORT}`);
});