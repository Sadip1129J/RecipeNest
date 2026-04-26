using MongoDB.Driver;
using RecipeNest.Api.Models;
using Microsoft.Extensions.Configuration;

namespace RecipeNest.Api.Data
{
    // MongoDbContext: the single entry point for all MongoDB collections.
    public class MongoDbContext
    {
        private readonly IMongoDatabase _database;

        public MongoDbContext(IConfiguration config)
        {
            var connectionString = config["MongoDb:ConnectionString"];
            var databaseName = config["MongoDb:DatabaseName"];
            
            Console.WriteLine($"[MongoDB] Connecting to: {connectionString}");
            Console.WriteLine($"[MongoDB] Database: {databaseName}");
            
            var client = new MongoClient(connectionString);
            _database = client.GetDatabase(databaseName);
        }

        // Collections — one property per MongoDB collection
        public IMongoCollection<User> Users =>
            _database.GetCollection<User>("Users");

        public IMongoCollection<ChefProfile> ChefProfiles =>
            _database.GetCollection<ChefProfile>("ChefProfiles");

        public IMongoCollection<Recipe> Recipes =>
            _database.GetCollection<Recipe>("Recipes");

        public IMongoCollection<Category> Categories =>
            _database.GetCollection<Category>("Categories");

        public IMongoCollection<Review> Reviews =>
            _database.GetCollection<Review>("Reviews");
    }
}
