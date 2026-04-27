using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using RecipeNest.Api.DTOs.Reviews;
using RecipeNest.Api.Services;
using System.Security.Claims;
using System.Threading.Tasks;

namespace RecipeNest.Api.Controllers
{
    [ApiController]
    [Route("api/reviews")]
    public class ReviewsController : ControllerBase
    {
        private readonly ReviewService _reviewService;

        public ReviewsController(ReviewService reviewService)
        {
            _reviewService = reviewService;
        }

        // GET /api/reviews/recipe/{recipeId} — get all reviews for a recipe (public)
        [HttpGet("recipe/{recipeId}")]
        public async Task<IActionResult> GetByRecipe(string recipeId)
        {
            var reviews = await _reviewService.GetByRecipeAsync(recipeId);
            return Ok(reviews);
        }

        // GET /api/reviews/me — get current user's reviews
        [HttpGet("me")]
        [Authorize]
        public async Task<IActionResult> GetMyReviews()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var reviews = await _reviewService.GetMineAsync(userId);
            return Ok(reviews);
        }

        // POST /api/reviews/recipe/{recipeId} — submit a review (authenticated users)
        [HttpPost("recipe/{recipeId}")]
        [Authorize]
        public async Task<IActionResult> Create(string recipeId, [FromBody] CreateReviewDto dto)
        {
            if (dto.Rating < 1 || dto.Rating > 5)
                return BadRequest(new { message = "Rating must be between 1 and 5." });

            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var userName = User.FindFirstValue(ClaimTypes.Name);

            var review = await _reviewService.CreateAsync(recipeId, userId, userName, dto);
            if (review == null) return BadRequest(new { message = "Invalid review data." });

            return Ok(review);
        }
    }
}
