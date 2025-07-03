
import { Db, MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const client = new MongoClient(uri);

let db: Db;

async function connectToDatabase() {
  if (db) {
    return db;
  }

  try {
    await client.connect();
    db = client.db('workflow-ai');
    console.log('Connected to MongoDB');
    return db;
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    throw error;
  }
}

export default connectToDatabase;
