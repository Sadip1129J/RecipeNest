using RecipeNest.Api.Data;
using MongoDB.Driver;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace RecipeNest.Api.Services
{
    // StatisticsService: computes platform-wide and chef-specific analytics
    public class StatisticsService
    {
        private readonly MongoDbContext _db;

        public StatisticsService(MongoDbContext db)
        {
            _db = db;
        }

        // Admin: get platform-wide statistics
        public async Task<object> GetAdminStatsAsync()
        {
            var totalRecipes = await _db.Recipes.CountDocumentsAsync(_ => true);
            var totalUsers = await _db.Users.CountDocumentsAsync(u => u.Role == "User");
            var totalChefs = await _db.Users.CountDocumentsAsync(u => u.Role == "Chef");
            var totalReviews = await _db.Reviews.CountDocumentsAsync(_ => true);

            // Average rating across all recipes using LINQ
            var recipes = await _db.Recipes.Find(_ => true).ToListAsync();
            var avgRating = recipes.Count > 0 ? Math.Round(recipes.Average(r => r.RatingAverage), 1) : 0;

            // Most popular category by recipe count
            var mostPopularCategory = recipes
                .GroupBy(r => r.CategoryName)
                .OrderByDescending(g => g.Count())
                .FirstOrDefault()?.Key ?? "N/A";

            // Category counts for chart
            var categoryCounts = recipes
                .GroupBy(r => r.CategoryName)
                .Select(g => new { name = g.Key, count = g.Count() })
                .OrderByDescending(x => x.count)
                .ToList();

            return new
            {
                totalRecipes,
                totalUsers,
                totalChefs,
                totalReviews,
                avgRating,
                mostPopularCategory,
                categoryCounts
            };
        }

        // Chef: get statistics for the current chef
        public async Task<object> GetChefStatsAsync(string chefId)
        {
            var myRecipes = await _db.Recipes.Find(r => r.ChefId == chefId).ToListAsync();
            var totalLikes = myRecipes.Sum(r => r.LikesCount);
            var avgRating = myRecipes.Count > 0 ? Math.Round(myRecipes.Average(r => r.RatingAverage), 1) : 0;

            return new
            {
                totalRecipes = myRecipes.Count,
                totalLikes,
                avgRating
            };
        }
    }
}
