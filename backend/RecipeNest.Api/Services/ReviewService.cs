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
            return reviews.Select(ToDto).ToList();
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

            return ToDto(review);
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

        private ReviewDto ToDto(Review r) => new ReviewDto
        {
            Id = r.Id,
            RecipeId = r.RecipeId,
            UserId = r.UserId,
            UserName = r.UserName,
            Rating = r.Rating,
            Comment = r.Comment,
            CreatedAt = r.CreatedAt
        };
    }
}
