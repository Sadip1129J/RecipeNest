using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System;
using System.Collections.Generic;

namespace RecipeNest.Api.Models
{
    public class ChefProfile
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; }

        [BsonRepresentation(BsonType.ObjectId)]
        public string UserId { get; set; }

        public string DisplayName { get; set; }
        public string Bio { get; set; } = "";
        public string Location { get; set; } = "";
        public List<string> Specialties { get; set; } = new List<string>();
        public string ProfileImageUrl { get; set; } = "";
        public Dictionary<string, string> SocialLinks { get; set; } = new Dictionary<string, string>();
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    }
}
