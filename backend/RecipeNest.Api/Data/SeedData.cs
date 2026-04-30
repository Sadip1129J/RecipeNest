using RecipeNest.Api.Data;
using RecipeNest.Api.Models;
using MongoDB.Driver;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace RecipeNest.Api.Data
{
    public class SeedData
    {
        public static async Task SeedAsync(MongoDbContext db, Helpers.PasswordHelper passwordHelper)
        {
            // ── Seed Categories ──
            var categoryCount = await db.Categories.CountDocumentsAsync(_ => true);
            if (categoryCount == 0)
            {
                var defaultCategories = new List<string>
                {
                    "Breakfast", "Lunch", "Dinner", "Dessert", "Appetizer", "Snack", "Vegan"
                };
                foreach (var name in defaultCategories)
                {
                    await db.Categories.InsertOneAsync(new Category { Name = name });
                }
                Console.WriteLine("[Seed] Categories inserted.");
            }

            // ── Seed Users ──
            // ── Seed Users ──
            var adminExists = await db.Users.Find(u => u.Email == "admin@recipenest.com").AnyAsync();
            if (!adminExists)
            {
                var adminPassword = Environment.GetEnvironmentVariable("ADMIN_PASSWORD") ?? "Admin123!";
                if (adminPassword == "Admin123!")
                {
                    Console.WriteLine("[Warning] No ADMIN_PASSWORD env var found. Using insecure default 'Admin123!'. PLEASE CHANGE IMMEDIATELY.");
                }

                var admin = new User 
                { 
                    FullName = "System Admin", 
                    Email = "admin@recipenest.com", 
                    PasswordHash = passwordHelper.Hash(adminPassword), 
                    Role = "Admin" 
                };
                await db.Users.InsertOneAsync(admin);
                Console.WriteLine("[Seed] Admin user inserted.");
            }
            
            var sadipUser = await db.Users.Find(u => u.Email == "sadip@gmail.com").FirstOrDefaultAsync();
            if (sadipUser == null)
            {
                var sadip = new User 
                { 
                    FullName = "Sadip Chef", 
                    Email = "sadip@gmail.com", 
                    PasswordHash = passwordHelper.Hash("123456"), 
                    Role = "Chef" 
                };
                await db.Users.InsertOneAsync(sadip);
                sadipUser = sadip;
                Console.WriteLine("[Seed] Sadip user inserted.");
            }
            else
            {
                // Unconditionally update password and role for testing purposes
                await db.Users.UpdateOneAsync(
                    u => u.Email == "sadip@gmail.com",
                    Builders<User>.Update
                        .Set(u => u.PasswordHash, passwordHelper.Hash("123456"))
                        .Set(u => u.Role, "Chef")
                );
                Console.WriteLine("[Seed] Sadip user password/role reset to 123456/Chef.");
            }
            
            // Ensure Sadip has a ChefProfile
            var chefProfile = await db.ChefProfiles.Find(p => p.UserId == sadipUser.Id).FirstOrDefaultAsync();
            if (chefProfile == null)
            {
                chefProfile = new ChefProfile
                {
                    UserId = sadipUser.Id,
                    DisplayName = sadipUser.FullName,
                    Bio = "Professional Chef specializing in Nepali Cuisine.",
                    Specialties = new List<string> { "Momo", "Thakali", "Newari" }
                };
                await db.ChefProfiles.InsertOneAsync(chefProfile);
                
                await db.Users.UpdateOneAsync(
                    u => u.Id == sadipUser.Id,
                    Builders<User>.Update.Set(u => u.ChefProfileId, chefProfile.Id)
                );
                
                Console.WriteLine("[Seed] Sadip chef profile created.");
            }

            var userCount = await db.Users.CountDocumentsAsync(_ => true);
            if (userCount == 0 || (userCount == 1 && adminExists)) // Only seed chefs if empty or only admin exists
            {
                var chefs = new List<User>
                {
                    new User { FullName = "Aayush Thapa", Email = "aayush@recipenest.com", PasswordHash = passwordHelper.Hash("Chef123!"), Role = "Chef" },
                    new User { FullName = "Suman Karki",  Email = "suman@recipenest.com",  PasswordHash = passwordHelper.Hash("Chef123!"), Role = "Chef" },
                };
                foreach (var u in chefs) await db.Users.InsertOneAsync(u);
                Console.WriteLine("[Seed] Chef users inserted.");
            }
            else
            {
                Console.WriteLine("[Seed] Users already exist.");
            }

            // ── Seed Recipes ──
            var recipeCount = await db.Recipes.CountDocumentsAsync(_ => true);
            if (recipeCount == 0)
            {
                var chef = await db.Users.Find(u => u.Role == "Chef").FirstOrDefaultAsync();
                var dinnerCat = await db.Categories.Find(c => c.Name == "Dinner").FirstOrDefaultAsync();
                var snackCat = await db.Categories.Find(c => c.Name == "Snack").FirstOrDefaultAsync();

                if (chef != null)
                {
                    var recipes = new List<Recipe>
                    {
                        new Recipe
                        {
                            ChefId = chef.Id, ChefName = chef.FullName,
                            Title = "Truffle Mushroom Risotto",
                            Description = "Creamy Arborio rice with truffle oil.",
                            CategoryId = dinnerCat?.Id, CategoryName = "Dinner",
                            ImageUrl = "https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=800",
                            Ingredients = new List<string> { "Rice", "Mushroom", "Truffle Oil" },
                            Instructions = new List<string> { "Cook rice.", "Add oil." },
                            PrepTime = "45 min", Servings = 4, RatingAverage = 4.8,
                            Status = "Approved"
                        },
                        new Recipe
                        {
                            ChefId = chef.Id, ChefName = chef.FullName,
                            Title = "Chicken Momo",
                            Description = "Nepali dumplings.",
                            CategoryId = snackCat?.Id, CategoryName = "Snack",
                            ImageUrl = "https://images.unsplash.com/photo-1496116218417-1a781b1c416c?w=800",
                            Ingredients = new List<string> { "Chicken", "Flour" },
                            Instructions = new List<string> { "Steam." },
                            PrepTime = "45 min", Servings = 4, RatingAverage = 4.9,
                            Status = "Approved"
                        }
                    };
                    await db.Recipes.InsertManyAsync(recipes);
                    Console.WriteLine("[Seed] Recipes inserted.");
                }
            }
            else
            {
                Console.WriteLine("[Seed] Recipes already exist.");
            }
        }
    }
}
