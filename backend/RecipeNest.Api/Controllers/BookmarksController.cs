using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using RecipeNest.Api.Services;
using System.Security.Claims;
using System.Threading.Tasks;

namespace RecipeNest.Api.Controllers
{
    [ApiController]
    [Route("api/bookmarks")]
    public class BookmarksController : ControllerBase
    {
        private readonly BookmarkService _bookmarkService;

        public BookmarksController(BookmarkService bookmarkService)
        {
            _bookmarkService = bookmarkService;
        }

        // GET /api/bookmarks/me — get current user's saved recipes
        [HttpGet("me")]
        [Authorize]
        public async Task<IActionResult> GetMyBookmarks()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var recipes = await _bookmarkService.GetBookmarksAsync(userId);
            return Ok(recipes);
        }

        // POST /api/bookmarks/{recipeId} — bookmark a recipe
        [HttpPost("{recipeId}")]
        [Authorize]
        public async Task<IActionResult> AddBookmark(string recipeId)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            await _bookmarkService.AddBookmarkAsync(userId, recipeId);
            return Ok(new { message = "Recipe bookmarked." });
        }

        // DELETE /api/bookmarks/{recipeId} — remove a bookmark
        [HttpDelete("{recipeId}")]
        [Authorize]
        public async Task<IActionResult> RemoveBookmark(string recipeId)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            await _bookmarkService.RemoveBookmarkAsync(userId, recipeId);
            return Ok(new { message = "Bookmark removed." });
        }
    }
}
