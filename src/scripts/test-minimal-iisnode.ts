import express from 'express';

const app = express();

app.get('/', (req: any, res: any) => res.send('Hello from IISNode-style Minimal App!'));
app.get('/health', (req: any, res: any) => res.send('OK - IISNode-style'));

// Do NOT call app.listen here!
module.exports = app; 