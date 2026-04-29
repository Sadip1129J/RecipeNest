using RecipeNest.Api.Data;
using RecipeNest.Api.DTOs.Recipes;
using RecipeNest.Api.Models;
using MongoDB.Driver;
using MongoDB.Driver.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace RecipeNest.Api.Services
{
    // RecipeService: CRUD operations for recipes with search & filter support
    public class RecipeService
    {
        private readonly MongoDbContext _db;

        public RecipeService(MongoDbContext db)
        {
            _db = db;
        }

        // Get all recipes with optional search query and category filter
        public async Task<List<RecipeDto>> GetAllAsync(string? query = null, string? category = null)
        {
            var filter = Builders<Recipe>.Filter.Empty;
            
            // Filter by category name (case-insensitive)
            if (!string.IsNullOrWhiteSpace(category) && category != "All")
            {
                filter &= Builders<Recipe>.Filter.Regex(r => r.CategoryName,
                    new MongoDB.Bson.BsonRegularExpression(category, "i"));
            }

            var recipes = await _db.Recipes.Find(filter).SortByDescending(r => r.CreatedAt).ToListAsync();
            var userIds = await _db.Users.Find(_ => true).Project(u => u.Id).ToListAsync();
            var userIdSet = userIds.ToHashSet();

            // Filter out orphans (recipes whose chef account was deleted)
            recipes = recipes.Where(r => userIdSet.Contains(r.ChefId)).ToList();

            // Apply text search using LINQ-style filtering (search title, description, tags)
            if (!string.IsNullOrWhiteSpace(query))
            {
                var q = query.ToLower();
                recipes = recipes.Where(r =>
                    r.Title.ToLower().Contains(q) ||
                    r.Description.ToLower().Contains(q) ||
                    r.Tags.Any(t => t.ToLower().Contains(q))
                ).ToList();
            }

            return recipes.Select(ToDto).ToList();
        }

        // Get all recipes for Admin moderation (no status filter)
        public async Task<List<RecipeDto>> GetAllAdminAsync()
        {
            var recipes = await _db.Recipes.Find(_ => true).SortByDescending(r => r.CreatedAt).ToListAsync();
            return recipes.Select(ToDto).ToList();
        }

        public async Task<RecipeDto> GetByIdAsync(string id)
        {
            var recipe = await _db.Recipes.Find(r => r.Id == id).FirstOrDefaultAsync();
            return recipe == null ? null : ToDto(recipe);
        }

        // Get recipes by a specific chef
        // If requester is NOT the chef or admin, only show approved
        public async Task<List<RecipeDto>> GetByChefAsync(string chefId)
        {
            var filter = Builders<Recipe>.Filter.Eq(r => r.ChefId, chefId);
            var recipes = await _db.Recipes.Find(filter)
                .SortByDescending(r => r.CreatedAt).ToListAsync();
            return recipes.Select(ToDto).ToList();
        }

        public async Task<RecipeDto> CreateAsync(CreateRecipeDto dto, string chefId, string chefName)
        {
            // Resolve category name from ID
            var category = await _db.Categories.Find(c => c.Id == dto.CategoryId).FirstOrDefaultAsync();

            var recipe = new Recipe
            {
                ChefId = chefId,
                ChefName = chefName,
                Title = dto.Title,
                Description = dto.Description,
                CategoryId = dto.CategoryId,
                CategoryName = category?.Name ?? "",
                ImageUrl = dto.ImageUrl,
                Ingredients = dto.Ingredients,
                Instructions = dto.Instructions,
                PrepTime = dto.PrepTime,
                Servings = dto.Servings,
                Tags = dto.Tags,
                Status = "Approved"
            };

            await _db.Recipes.InsertOneAsync(recipe);
            return ToDto(recipe);
        }

        public async Task<bool> UpdateAsync(string id, UpdateRecipeDto dto, string requesterId, string requesterRole)
        {
            var recipe = await _db.Recipes.Find(r => r.Id == id).FirstOrDefaultAsync();
            if (recipe == null) return false;

            // Only the chef who owns the recipe or an admin can update it
            if (recipe.ChefId != requesterId && requesterRole != "Admin")
                return false;

            var category = await _db.Categories.Find(c => c.Id == dto.CategoryId).FirstOrDefaultAsync();

            var update = Builders<Recipe>.Update
                .Set(r => r.Title, dto.Title)
                .Set(r => r.Description, dto.Description)
                .Set(r => r.CategoryId, dto.CategoryId)
                .Set(r => r.CategoryName, category?.Name ?? recipe.CategoryName)
                .Set(r => r.ImageUrl, dto.ImageUrl)
                .Set(r => r.Ingredients, dto.Ingredients)
                .Set(r => r.Instructions, dto.Instructions)
                .Set(r => r.PrepTime, dto.PrepTime)
                .Set(r => r.Servings, dto.Servings)
                .Set(r => r.Tags, dto.Tags)
                .Set(r => r.UpdatedAt, DateTime.UtcNow);

            var result = await _db.Recipes.UpdateOneAsync(r => r.Id == id, update);
            return result.ModifiedCount > 0;
        }

        public async Task<bool> DeleteAsync(string id, string requesterId, string requesterRole)
        {
            var recipe = await _db.Recipes.Find(r => r.Id == id).FirstOrDefaultAsync();
            if (recipe == null) return false;

            // Only owner or admin can delete
            if (recipe.ChefId != requesterId && requesterRole != "Admin")
                return false;

            var result = await _db.Recipes.DeleteOneAsync(r => r.Id == id);
            return result.DeletedCount > 0;
        }

        public async Task<bool> UpdateStatusAsync(string id, string status)
        {
            if (status == "Rejected")
            {
                // Hard Moderation: Rejecting a recipe deletes it
                var result = await _db.Recipes.DeleteOneAsync(r => r.Id == id);
                return result.DeletedCount > 0;
            }

            var update = Builders<Recipe>.Update
                .Set(r => r.Status, status)
                .Set(r => r.UpdatedAt, DateTime.UtcNow);

            var resultUpdate = await _db.Recipes.UpdateOneAsync(r => r.Id == id, update);
            return resultUpdate.ModifiedCount > 0;
        }

        private RecipeDto ToDto(Recipe r) => new RecipeDto
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
            Status = r.Status ?? "Approved",
            CreatedAt = r.CreatedAt
        };
    }
}
