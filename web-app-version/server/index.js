// web-app-version/server/index.js
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());

// --- DATABASE (In-Memory) ---
let requests = [];
let riders = [];

// --- CRUD ENDPOINTS ---

// GET: Retrieve current state
app.get('/elevator/state', (req, res) => {
  res.json({ requests, riders });
});

// POST: Add a Request (Person waiting)
app.post('/elevator/requests', (req, res) => {
  const person = req.body;
  requests.push(person);
  console.log(`Added Request: ${person.name}`);
  res.json({ message: 'Request added', requests });
});

// DELETE: Remove a Request (Picked up)
app.delete('/elevator/requests/:name', (req, res) => {
  const { name } = req.params;
  requests = requests.filter(p => p.name !== name);
  res.json({ message: 'Request removed', requests });
});

// POST: Add a Rider (Person entering elevator)
app.post('/elevator/riders', (req, res) => {
  const person = req.body;
  riders.push(person);
  console.log(`Added Rider: ${person.name}`);
  res.json({ message: 'Rider added', riders });
});

// DELETE: Remove a Rider (Dropped off)
app.delete('/elevator/riders/:name', (req, res) => {
  const { name } = req.params;
  riders = riders.filter(p => p.name !== name);
  console.log(`Rider leaving: ${name}`);
  res.json({ message: 'Rider removed', riders });
});

// RESET: Clear all (Optional utility)
app.post('/elevator/reset', (req, res) => {
  requests = [];
  riders = [];
  res.json({ message: 'Reset complete' });
});

app.listen(PORT, () => {
  console.log(`Elevator Server running on http://localhost:${PORT}`);
});