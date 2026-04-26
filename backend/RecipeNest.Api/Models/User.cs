using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System;
using System.Collections.Generic;

namespace RecipeNest.Api.Models
{
    public class User
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; }

        public string FullName { get; set; }
        public string Email { get; set; }
        public string PasswordHash { get; set; }
        public string Role { get; set; } = "User"; // Admin, Chef, User
        public string ProfileImageUrl { get; set; } = "";

        [BsonRepresentation(BsonType.ObjectId)]
        public List<string> SavedRecipeIds { get; set; } = new List<string>();

        [BsonRepresentation(BsonType.ObjectId)]
        public string ChefProfileId { get; set; } = null;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
