using RecipeNest.Api.Data;
using RecipeNest.Api.DTOs.Chefs;
using RecipeNest.Api.Models;
using MongoDB.Driver;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace RecipeNest.Api.Services
{
    // ChefService: manages chef profiles
    public class ChefService
    {
        private readonly MongoDbContext _db;

        public ChefService(MongoDbContext db)
        {
            _db = db;
        }

        // Get all chefs with optional search across name, location, specialties
        public async Task<List<ChefProfileDto>> GetAllAsync(string? query = null)
        {
            var chefs = await _db.ChefProfiles.Find(_ => true).ToListAsync();
            var userIds = await _db.Users.Find(_ => true).Project(u => u.Id).ToListAsync();
            var userIdSet = userIds.ToHashSet();

            // Filter out orphans (chefs whose user account was deleted)
            chefs = chefs.Where(c => userIdSet.Contains(c.UserId)).ToList();

            // LINQ-style search across multiple fields
            if (!string.IsNullOrWhiteSpace(query))
            {
                var q = query.ToLower();
                chefs = chefs.Where(c =>
                    c.DisplayName.ToLower().Contains(q) ||
                    c.Location.ToLower().Contains(q) ||
                    c.Specialties.Any(s => s.ToLower().Contains(q))
                ).ToList();
            }

            return chefs.Select(ToDto).ToList();
        }

        public async Task<ChefProfileDto> GetByIdAsync(string id)
        {
            var chef = await _db.ChefProfiles.Find(c => c.Id == id).FirstOrDefaultAsync();
            return chef == null ? null : ToDto(chef);
        }

        public async Task<ChefProfileDto> GetByUserIdAsync(string userId)
        {
            var chef = await _db.ChefProfiles.Find(c => c.UserId == userId).FirstOrDefaultAsync();
            return chef == null ? null : ToDto(chef);
        }

        public async Task<bool> UpdateAsync(string userId, UpdateChefProfileDto dto)
        {
            var update = Builders<ChefProfile>.Update
                .Set(c => c.DisplayName, dto.DisplayName)
                .Set(c => c.Bio, dto.Bio)
                .Set(c => c.Location, dto.Location)
                .Set(c => c.Specialties, dto.Specialties)
                .Set(c => c.ProfileImageUrl, dto.ProfileImageUrl)
                .Set(c => c.SocialLinks, dto.SocialLinks)
                .Set(c => c.UpdatedAt, DateTime.UtcNow);

            var result = await _db.ChefProfiles.UpdateOneAsync(c => c.UserId == userId, update);
            return result.ModifiedCount > 0;
        }

        private ChefProfileDto ToDto(ChefProfile c) => new ChefProfileDto
        {
            Id = c.Id,
            UserId = c.UserId,
            DisplayName = c.DisplayName,
            Bio = c.Bio,
            Location = c.Location,
            Specialties = c.Specialties,
            ProfileImageUrl = c.ProfileImageUrl,
            SocialLinks = c.SocialLinks,
            CreatedAt = c.CreatedAt
        };
    }
}
