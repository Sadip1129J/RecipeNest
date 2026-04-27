using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace RecipeNest.Api.DTOs.Recipes
{
    public class RecipeDto
    {
        public string Id { get; set; }
        public string ChefId { get; set; }
        public string ChefName { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public string CategoryId { get; set; }
        public string CategoryName { get; set; }
        public string ImageUrl { get; set; }
        public List<string> Ingredients { get; set; }
        public List<string> Instructions { get; set; }
        public string PrepTime { get; set; }
        public int Servings { get; set; }
        public List<string> Tags { get; set; }
        public double RatingAverage { get; set; }
        public int RatingCount { get; set; }
        public int LikesCount { get; set; }
        public string Status { get; set; }
        public DateTime CreatedAt { get; set; }
    }

    public class CreateRecipeDto
    {
        [Required]
        public string Title { get; set; }
        [Required]
        public string Description { get; set; }
        [Required]
        public string CategoryId { get; set; }
        public string ImageUrl { get; set; } = "";
        [Required, MinLength(1)]
        public List<string> Ingredients { get; set; }
        [Required, MinLength(1)]
        public List<string> Instructions { get; set; }
        public string PrepTime { get; set; }
        public int Servings { get; set; } = 2;
        public List<string> Tags { get; set; } = new List<string>();
    }

    public class UpdateRecipeDto
    {
        public string Title { get; set; }
        public string Description { get; set; }
        public string CategoryId { get; set; }
        public string ImageUrl { get; set; }
        public List<string> Ingredients { get; set; }
        public List<string> Instructions { get; set; }
        public string PrepTime { get; set; }
        public int Servings { get; set; }
        public List<string> Tags { get; set; }
    }
}
