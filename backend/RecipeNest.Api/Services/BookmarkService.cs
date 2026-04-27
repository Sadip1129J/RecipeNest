using RecipeNest.Api.Data;
using RecipeNest.Api.DTOs.Recipes;
using MongoDB.Driver;
using RecipeNest.Api.Models;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace RecipeNest.Api.Services
{
    // BookmarkService: manages saved/bookmarked recipes per user
    public class BookmarkService
    {
        private readonly MongoDbContext _db;
        private readonly RecipeService _recipeService;

        public BookmarkService(MongoDbContext db, RecipeService recipeService)
        {
            _db = db;
            _recipeService = recipeService;
        }

        // Add a recipe to user's saved list
        public async Task<bool> AddBookmarkAsync(string userId, string recipeId)
        {
            var user = await _db.Users.Find(u => u.Id == userId).FirstOrDefaultAsync();
            if (user == null) return false;
            if (user.SavedRecipeIds.Contains(recipeId)) return true; // Already saved

            await _db.Users.UpdateOneAsync(
                u => u.Id == userId,
                Builders<RecipeNest.Api.Models.User>.Update.Push(u => u.SavedRecipeIds, recipeId)
            );
            return true;
        }

        // Remove a recipe from user's saved list
        public async Task<bool> RemoveBookmarkAsync(string userId, string recipeId)
        {
            await _db.Users.UpdateOneAsync(
                u => u.Id == userId,
                Builders<RecipeNest.Api.Models.User>.Update.Pull(u => u.SavedRecipeIds, recipeId)
            );
            return true;
        }

        // Get all saved recipes for a user
        public async Task<List<RecipeDto>> GetBookmarksAsync(string userId)
        {
            var user = await _db.Users.Find(u => u.Id == userId).FirstOrDefaultAsync();
            if (user == null || user.SavedRecipeIds == null) return new List<RecipeDto>();

            var savedIds = user.SavedRecipeIds;
            var filter = Builders<Recipe>.Filter.In(r => r.Id, savedIds);
            var recipes = await _db.Recipes.Find(filter).ToListAsync();

            return recipes.Select(r => new RecipeDto
            {
                Id = r.Id,
                ChefId = r.ChefId,
                ChefName = r.ChefName,
                Title = r.Title,
                Description = r.Description,
                CategoryId = r.CategoryId,
                CategoryName = r.CategoryName,
                ImageUrl = r.ImageUrl,
                Ingredients = r.Ingredients,
                Instructions = r.Instructions,
                PrepTime = r.PrepTime,
                Servings = r.Servings,
                Tags = r.Tags,
                RatingAverage = r.RatingAverage,
                RatingCount = r.RatingCount,
                LikesCount = r.LikesCount,
                CreatedAt = r.CreatedAt
            }).ToList();
        }
    }
}
