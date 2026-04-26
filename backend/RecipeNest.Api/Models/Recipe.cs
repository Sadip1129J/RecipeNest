using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System;
using System.Collections.Generic;

namespace RecipeNest.Api.Models
{
    public class Recipe
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; }

        [BsonRepresentation(BsonType.ObjectId)]
        public string ChefId { get; set; }

        public string ChefName { get; set; }
        public string Title { get; set; }
        public string Description { get; set; } = "";

        [BsonRepresentation(BsonType.ObjectId)]
        public string CategoryId { get; set; }

        public string CategoryName { get; set; }
        public string ImageUrl { get; set; } = "";
        public List<string> Ingredients { get; set; } = new List<string>();
        public List<string> Instructions { get; set; } = new List<string>();
        public string PrepTime { get; set; } = "";
        public int Servings { get; set; } = 2;
        public List<string> Tags { get; set; } = new List<string>();
        public double RatingAverage { get; set; } = 0;
        public int RatingCount { get; set; } = 0;
        public int LikesCount { get; set; } = 0;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    }
}
