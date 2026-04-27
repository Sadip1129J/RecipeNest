using RecipeNest.Api.Data;
using RecipeNest.Api.DTOs.Reviews;
using RecipeNest.Api.Models;
using MongoDB.Driver;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace RecipeNest.Api.Services
{
    // ReviewService: handles recipe reviews and rating recalculation
    public class ReviewService
    {
        private readonly MongoDbContext _db;

        public ReviewService(MongoDbContext db)
        {
            _db = db;
        }

        public async Task<List<ReviewDto>> GetByRecipeAsync(string recipeId)
        {
            var reviews = await _db.Reviews.Find(r => r.RecipeId == recipeId)
                .SortByDescending(r => r.CreatedAt).ToListAsync();
            return reviews.Select(r => ToDto(r)).ToList();
        }

        public async Task<ReviewDto> CreateAsync(string recipeId, string userId, string userName, CreateReviewDto dto)
        {
            // Validate rating range
            if (dto.Rating < 1 || dto.Rating > 5) return null;

            var review = new Review
            {
                RecipeId = recipeId,
                UserId = userId,
                UserName = userName,
                Rating = dto.Rating,
                Comment = dto.Comment
            };

            await _db.Reviews.InsertOneAsync(review);

            // Recalculate recipe average rating
            await RecalculateRatingAsync(recipeId);

            // Fetch recipe title for the response
            var recipe = await _db.Recipes.Find(r => r.Id == recipeId).FirstOrDefaultAsync();

            return ToDto(review, recipe?.Title);
        }

        // Recalculate the average rating for a recipe after a new review
        private async Task RecalculateRatingAsync(string recipeId)
        {
            var allReviews = await _db.Reviews.Find(r => r.RecipeId == recipeId).ToListAsync();
            if (allReviews.Count == 0) return;

            var average = allReviews.Average(r => r.Rating);
            var count = allReviews.Count;

            await _db.Recipes.UpdateOneAsync(
                r => r.Id == recipeId,
                Builders<Recipe>.Update
                    .Set(r => r.RatingAverage, Math.Round(average, 1))
                    .Set(r => r.RatingCount, count)
            );
        }

        public async Task<List<ReviewDto>> GetMineAsync(string userId)
        {
            var reviews = await _db.Reviews.Find(r => r.UserId == userId)
                .SortByDescending(r => r.CreatedAt).ToListAsync();

            if (!reviews.Any()) return new List<ReviewDto>();

            // Fetch recipe titles for the reviews
            var recipeIds = reviews.Select(r => r.RecipeId).Distinct().ToList();
            var filter = Builders<Recipe>.Filter.In(r => r.Id, recipeIds);
            var recipes = await _db.Recipes.Find(filter).ToListAsync();
            var recipeMap = recipes.ToDictionary(r => r.Id, r => r.Title);

            return reviews.Select(r => {
                recipeMap.TryGetValue(r.RecipeId, out var title);
                return ToDto(r, title);
            }).ToList();
        }

        private ReviewDto ToDto(Review r, string? recipeTitle = null) => new ReviewDto
        {
            Id = r.Id,
            RecipeId = r.RecipeId,
            RecipeTitle = recipeTitle ?? "",
            UserId = r.UserId,
            UserName = r.UserName,
            Rating = r.Rating,
            Comment = r.Comment,
            CreatedAt = r.CreatedAt
        };
    }
}
