const { MongoClient } = require('mongodb');

async function main() {
    const url = 'mongodb://127.0.0.1:27017';
    const client = new MongoClient(url);

    try {
        await client.connect();
        console.log('Successfully connected to MongoDB');
        const db = client.db('RecipeNestDb');
        const collections = await db.listCollections().toArray();
        console.log('Collections:', collections.map(c => c.name));
        
        const recipes = await db.collection('Recipes').countDocuments();
        console.log('Recipe count:', recipes);
    } catch (err) {
        console.error('Failed to connect to MongoDB:', err.message);
    } finally {
        await client.close();
    }
}

main();
