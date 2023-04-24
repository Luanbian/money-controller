import express from 'express'
import { router } from './src/routes/routes';

const app = express();
app.use(express.json());
app.use(router)
app.listen({port: 3030}, () => {
    console.log('Server listen at 3030')
});