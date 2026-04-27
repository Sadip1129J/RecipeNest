using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using RecipeNest.Api.Data;
using RecipeNest.Api.Helpers;
using RecipeNest.Api.Middleware;
using RecipeNest.Api.Services;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// ── MongoDB Context ──
builder.Services.AddSingleton<MongoDbContext>();

// ── Helpers ──
builder.Services.AddSingleton<PasswordHelper>();
builder.Services.AddSingleton<JwtHelper>();

// ── Application Services ──
builder.Services.AddScoped<AuthService>();
builder.Services.AddScoped<UserService>();
builder.Services.AddScoped<RecipeService>();
builder.Services.AddScoped<ChefService>();
builder.Services.AddScoped<CategoryService>();
builder.Services.AddScoped<ReviewService>();
builder.Services.AddScoped<BookmarkService>();
builder.Services.AddScoped<StatisticsService>();

// ── JWT Authentication ──
var jwtSecret = builder.Configuration["Jwt:Secret"];
var jwtIssuer = builder.Configuration["Jwt:Issuer"];
var jwtAudience = builder.Configuration["Jwt:Audience"];

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = jwtIssuer,
            ValidAudience = jwtAudience,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSecret))
        };
    });

builder.Services.AddAuthorization();

// ── CORS: allow frontend (Vite dev server) ──
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins("http://localhost:5173", "http://localhost:5174", "http://localhost:3000", "http://127.0.0.1:5173", "http://127.0.0.1:5174")
              .AllowAnyMethod()
              .AllowAnyHeader()
              .AllowCredentials();
    });
});

builder.Services.AddControllers();

var app = builder.Build();

// ── Middleware Pipeline ──
app.UseMiddleware<ErrorHandlingMiddleware>();

// Serve uploaded images from wwwroot/uploads
app.UseStaticFiles();

app.UseCors("AllowFrontend");

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

// ── Seed the database on startup ──
using (var scope = app.Services.CreateScope())
{
    try
    {
        var db = scope.ServiceProvider.GetRequiredService<MongoDbContext>();
        var passwordHelper = scope.ServiceProvider.GetRequiredService<PasswordHelper>();
        await SeedData.SeedAsync(db, passwordHelper);
    }
    catch (Exception ex)
    {
        Console.WriteLine($"[Seed] MongoDB unavailable on startup: {ex.Message}");
        Console.WriteLine("[Seed] Start MongoDB and restart the API to seed data.");
    }
}

app.Run();
