using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using RecipeNest.Api.Services;
using System.Security.Claims;
using System.Threading.Tasks;

namespace RecipeNest.Api.Controllers
{
    [ApiController]
    [Route("api/statistics")]
    public class StatisticsController : ControllerBase
    {
        private readonly StatisticsService _statsService;

        public StatisticsController(StatisticsService statsService)
        {
            _statsService = statsService;
        }

        // GET /api/statistics/admin — platform-wide stats (Admin only)
        [HttpGet("admin")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetAdminStats()
        {
            var stats = await _statsService.GetAdminStatsAsync();
            return Ok(stats);
        }

        // GET /api/statistics/chef/me — chef's own statistics
        [HttpGet("chef/me")]
        [Authorize(Roles = "Chef,Admin")]
        public async Task<IActionResult> GetChefStats()
        {
            var chefId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var stats = await _statsService.GetChefStatsAsync(chefId);
            return Ok(stats);
        }
    }
}
