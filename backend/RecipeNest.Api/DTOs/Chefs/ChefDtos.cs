using System;
using System.Collections.Generic;

namespace RecipeNest.Api.DTOs.Chefs
{
    public class ChefProfileDto
    {
        public string Id { get; set; }
        public string UserId { get; set; }
        public string DisplayName { get; set; }
        public string Bio { get; set; }
        public string Location { get; set; }
        public List<string> Specialties { get; set; }
        public string ProfileImageUrl { get; set; }
        public Dictionary<string, string> SocialLinks { get; set; }
        public DateTime CreatedAt { get; set; }
    }

    public class UpdateChefProfileDto
    {
        public string DisplayName { get; set; }
        public string Bio { get; set; }
        public string Location { get; set; }
        public List<string> Specialties { get; set; }
        public string ProfileImageUrl { get; set; }
        public Dictionary<string, string> SocialLinks { get; set; }
    }
}
