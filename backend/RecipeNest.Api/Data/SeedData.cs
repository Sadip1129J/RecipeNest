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
            var userCount = await db.Users.CountDocumentsAsync(_ => true);
            if (userCount == 0)
            {
                var admin = new User
                {
                    FullName = "Marcus Laurent",
                    Email = "admin@recipenest.com",
                    PasswordHash = passwordHelper.Hash("Admin123!"),
                    Role = "Admin"
                };

                var chef = new User
                {
                    FullName = "Sofia Chen",
                    Email = "chef@recipenest.com",
                    PasswordHash = passwordHelper.Hash("Chef123!"),
                    Role = "Chef"
                };

                var user = new User
                {
                    FullName = "James Wilson",
                    Email = "user@recipenest.com",
                    PasswordHash = passwordHelper.Hash("User123!"),
                    Role = "User"
                };

                await db.Users.InsertOneAsync(admin);
                await db.Users.InsertOneAsync(chef);
                await db.Users.InsertOneAsync(user);

                var chefProfile = new ChefProfile
                {
                    UserId = chef.Id,
                    DisplayName = "Sofia Chen",
                    Bio = "Award-winning chef specializing in Asian fusion cuisine.",
                    Location = "San Francisco, CA",
                    Specialties = new List<string> { "Asian Fusion", "Pastry" },
                    ProfileImageUrl = "https://images.unsplash.com/photo-1607631568010-a87245c0daf8?w=400"
                };
                await db.ChefProfiles.InsertOneAsync(chefProfile);
                await db.Users.UpdateOneAsync(u => u.Id == chef.Id, Builders<User>.Update.Set(u => u.ChefProfileId, chefProfile.Id));

                var nepaliChefUsers = new List<User>
                {
                    new User { FullName = "Aayush Thapa", Email = "aayush@recipenest.com", PasswordHash = passwordHelper.Hash("Chef123!"), Role = "Chef" },
                    new User { FullName = "Suman Karki",  Email = "suman@recipenest.com",  PasswordHash = passwordHelper.Hash("Chef123!"), Role = "Chef" },
                };
                foreach (var nc in nepaliChefUsers) await db.Users.InsertOneAsync(nc);

                Console.WriteLine("[Seed] Users and ChefProfiles inserted.");
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
