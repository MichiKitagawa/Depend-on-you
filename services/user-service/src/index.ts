import express from 'express';
import { userRouter } from './routes/user.routes';

const app = express();
const port = process.env.PORT || 3001;

app.use(express.json());
app.use('/api/users', userRouter);

app.listen(port, () => {
  console.log(`User service is running on port ${port}`);
}); 