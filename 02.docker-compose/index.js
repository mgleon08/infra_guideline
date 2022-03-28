import { createClient } from 'redis';
import { createServer } from 'http';

const client = createClient({url: 'redis://redis_db:6379'});
const server = createServer

client.on('error', (err) => console.log('Redis Client Error', err));

await client.connect();

await client.set('key', 'Docker Compose Demo from Redis');
const output = await client.get('key');


server((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.end(`<h1>${output}</h1>`);
})
.listen(3000);

console.log('HTTP server is listening at port 3000.');
