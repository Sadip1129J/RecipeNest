using RecipeNest.Api.Data;
using RecipeNest.Api.DTOs.Categories;
using RecipeNest.Api.Models;
using MongoDB.Driver;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace RecipeNest.Api.Services
{
    // CategoryService: manages recipe categories
    public class CategoryService
    {
        private readonly MongoDbContext _db;

        public CategoryService(MongoDbContext db)
        {
            _db = db;
        }

        public async Task<List<CategoryDto>> GetAllAsync()
        {
            var categories = await _db.Categories.Find(_ => true).SortBy(c => c.Name).ToListAsync();
            return categories.Select(c => new CategoryDto { Id = c.Id, Name = c.Name }).ToList();
        }

        // Get categories with recipe counts (LINQ-style aggregation)
        public async Task<List<CategoryDto>> GetWithCountsAsync()
        {
            var categories = await _db.Categories.Find(_ => true).SortBy(c => c.Name).ToListAsync();
            var recipes = await _db.Recipes.Find(_ => true).ToListAsync();

            // Group recipes by CategoryId and count
            var countByCategory = recipes
                .GroupBy(r => r.CategoryId)
                .ToDictionary(g => g.Key, g => g.Count());

            return categories.Select(c => new CategoryDto
            {
                Id = c.Id,
                Name = c.Name,
                RecipeCount = countByCategory.GetValueOrDefault(c.Id, 0)
            }).ToList();
        }

        public async Task<CategoryDto> CreateAsync(CreateCategoryDto dto)
        {
            // Prevent duplicate category names
            var exists = await _db.Categories.Find(c => c.Name.ToLower() == dto.Name.ToLower().Trim()).FirstOrDefaultAsync();
            if (exists != null) return null;

            var category = new Category { Name = dto.Name.Trim() };
            await _db.Categories.InsertOneAsync(category);
            return new CategoryDto { Id = category.Id, Name = category.Name };
        }

        public async Task<bool> DeleteAsync(string id)
        {
            var result = await _db.Categories.DeleteOneAsync(c => c.Id == id);
            return result.DeletedCount > 0;
        }
    }
}
