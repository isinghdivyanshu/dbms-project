require('dotenv').config();
const { Client } = require('pg');

const connectionString = process.env.DATABASE_URL;

console.log('DATABASE_URL:', connectionString);

const client = new Client({
  connectionString: connectionString,
});

client.connect()
  .then(() => {
    console.log('Connected to the database successfully!');
    return client.end();
  })
  .catch(err => {
    console.error('Failed to connect to the database:', err);
  });