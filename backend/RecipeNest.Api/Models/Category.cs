using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System;

namespace RecipeNest.Api.Models
{
    public class Category
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; }

        public string Name { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
