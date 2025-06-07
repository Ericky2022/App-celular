const fs = require('fs');
const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/bible';

async function run() {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db(); // database from URI
    const verses = db.collection('verses');

    const data = JSON.parse(fs.readFileSync('src/assets/almeida_ra.json', 'utf8'));

    if (Array.isArray(data.verses)) {
      await verses.deleteMany({});
      await verses.insertMany(data.verses);
      console.log(`Inserted ${data.verses.length} verses`);
    } else {
      console.error('Invalid JSON structure: expected data.verses array');
    }
  } catch (err) {
    console.error('Error importing Bible:', err);
  } finally {
    await client.close();
  }
}

run();
