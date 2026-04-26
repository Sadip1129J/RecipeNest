using RecipeNest.Api.Data;
using RecipeNest.Api.DTOs.Users;
using RecipeNest.Api.Models;
using MongoDB.Driver;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace RecipeNest.Api.Services
{
    // UserService: handles profile and admin user operations
    public class UserService
    {
        private readonly MongoDbContext _db;

        public UserService(MongoDbContext db)
        {
            _db = db;
        }

        public async Task<UserProfileDto> GetProfileAsync(string userId)
        {
            var user = await _db.Users.Find(u => u.Id == userId).FirstOrDefaultAsync();
            return user == null ? null : ToDto(user);
        }

        public async Task<bool> UpdateProfileAsync(string userId, UpdateUserProfileDto dto)
        {
            var update = Builders<User>.Update
                .Set(u => u.FullName, dto.FullName)
                .Set(u => u.Email, dto.Email)
                .Set(u => u.ProfileImageUrl, dto.ProfileImageUrl);

            var result = await _db.Users.UpdateOneAsync(u => u.Id == userId, update);
            return result.ModifiedCount > 0;
        }

        public async Task<List<UserProfileDto>> GetAllUsersAsync()
        {
            var users = await _db.Users.Find(_ => true).ToListAsync();
            return users.Select(ToDto).ToList();
        }

        public async Task<bool> DeleteUserAsync(string userId)
        {
            var result = await _db.Users.DeleteOneAsync(u => u.Id == userId);
            return result.DeletedCount > 0;
        }

        // Convert User model to DTO (never include PasswordHash)
        private UserProfileDto ToDto(User u) => new UserProfileDto
        {
            Id = u.Id,
            FullName = u.FullName,
            Email = u.Email,
            Role = u.Role,
            ProfileImageUrl = u.ProfileImageUrl,
            SavedRecipesCount = u.SavedRecipeIds?.Count ?? 0,
            CreatedAt = u.CreatedAt
        };
    }
}
