using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using RecipeNest.Api.DTOs.Chefs;
using RecipeNest.Api.Services;
using System.Security.Claims;
using System.Threading.Tasks;

namespace RecipeNest.Api.Controllers
{
    [ApiController]
    [Route("api/chefs")]
    public class ChefsController : ControllerBase
    {
        private readonly ChefService _chefService;

        public ChefsController(ChefService chefService)
        {
            _chefService = chefService;
        }

        // GET /api/chefs?query= — browse/search all chefs (public)
        [HttpGet]
        public async Task<IActionResult> GetAll([FromQuery] string? query = null)
        {
            var chefs = await _chefService.GetAllAsync(query);
            return Ok(chefs);
        }

        // GET /api/chefs/{id} — get a single chef profile (public)
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(string id)
        {
            var chef = await _chefService.GetByIdAsync(id);
            if (chef == null) return NotFound();
            return Ok(chef);
        }

        // GET /api/chefs/me/profile — get current chef's own profile
        [HttpGet("me/profile")]
        [Authorize(Roles = "Chef,Admin")]
        public async Task<IActionResult> GetMyProfile()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var chef = await _chefService.GetByUserIdAsync(userId);
            if (chef == null) return NotFound();
            return Ok(chef);
        }

        // PUT /api/chefs/me/profile — update current chef's profile
        [HttpPut("me/profile")]
        [Authorize(Roles = "Chef,Admin")]
        public async Task<IActionResult> UpdateMyProfile([FromBody] UpdateChefProfileDto dto)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            await _chefService.UpdateAsync(userId, dto);
            return Ok(new { message = "Chef profile updated." });
        }
    }
}
