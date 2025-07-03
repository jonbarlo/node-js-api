import express from 'express';

const app = express();

app.get('/', (req: any, res: any) => res.send('Hello from Standalone Minimal App!'));
app.get('/health', (req: any, res: any) => res.send('OK - Standalone'));

const port = 3000;

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Standalone app listening on port ${port}`);
}); 