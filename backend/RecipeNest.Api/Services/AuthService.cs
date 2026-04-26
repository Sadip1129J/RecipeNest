using RecipeNest.Api.Data;
using RecipeNest.Api.DTOs.Auth;
using RecipeNest.Api.Helpers;
using RecipeNest.Api.Models;
using MongoDB.Driver;
using System.Threading.Tasks;

namespace RecipeNest.Api.Services
{
    // AuthService: handles user registration and login logic
    public class AuthService
    {
        private readonly MongoDbContext _db;
        private readonly PasswordHelper _passwordHelper;
        private readonly JwtHelper _jwtHelper;

        public AuthService(MongoDbContext db, PasswordHelper passwordHelper, JwtHelper jwtHelper)
        {
            _db = db;
            _passwordHelper = passwordHelper;
            _jwtHelper = jwtHelper;
        }

        // Register a new user and return a JWT token response
        public async Task<AuthResponseDto> RegisterAsync(RegisterDto dto)
        {
            // Check if email already taken
            var exists = await _db.Users.Find(u => u.Email == dto.Email).FirstOrDefaultAsync();
            if (exists != null)
                return null; // email taken

            var user = new User
            {
                FullName = dto.FullName,
                Email = dto.Email,
                PasswordHash = _passwordHelper.Hash(dto.Password),
                Role = dto.Role == "Chef" ? "Chef" : "User"
            };

            await _db.Users.InsertOneAsync(user);

            // If registering as Chef, create a ChefProfile automatically
            if (user.Role == "Chef")
            {
                var chefProfile = new ChefProfile
                {
                    UserId = user.Id,
                    DisplayName = user.FullName
                };
                await _db.ChefProfiles.InsertOneAsync(chefProfile);
                await _db.Users.UpdateOneAsync(
                    u => u.Id == user.Id,
                    Builders<User>.Update.Set(u => u.ChefProfileId, chefProfile.Id)
                );
                user.ChefProfileId = chefProfile.Id;
            }

            return BuildResponse(user);
        }

        // Login with email/password and return a JWT token response
        public async Task<AuthResponseDto> LoginAsync(LoginDto dto)
        {
            var user = await _db.Users.Find(u => u.Email == dto.Email).FirstOrDefaultAsync();
            if (user == null || !_passwordHelper.Verify(dto.Password, user.PasswordHash))
                return null;

            return BuildResponse(user);
        }

        // Build a standardised response with token + user info (never includes PasswordHash)
        private AuthResponseDto BuildResponse(User user)
        {
            return new AuthResponseDto
            {
                Token = _jwtHelper.GenerateToken(user),
                Id = user.Id,
                FullName = user.FullName,
                Email = user.Email,
                Role = user.Role,
                ProfileImageUrl = user.ProfileImageUrl,
                ChefProfileId = user.ChefProfileId
            };
        }
    }
}
