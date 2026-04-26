using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using RecipeNest.Api.DTOs.Recipes;
using RecipeNest.Api.Services;
using System.Security.Claims;
using System.Threading.Tasks;

namespace RecipeNest.Api.Controllers
{
    [ApiController]
    [Route("api/recipes")]
    public class RecipesController : ControllerBase
    {
        private readonly RecipeService _recipeService;

        public RecipesController(RecipeService recipeService)
        {
            _recipeService = recipeService;
        }

        // GET /api/recipes?query=&category= — browse/search all recipes (public)
        [HttpGet]
        public async Task<IActionResult> GetAll([FromQuery] string? query = null, [FromQuery] string? category = null)
        {
            var recipes = await _recipeService.GetAllAsync(query, category);
            return Ok(recipes);
        }

        // GET /api/recipes/{id} — get recipe detail (public)
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(string id)
        {
            var recipe = await _recipeService.GetByIdAsync(id);
            if (recipe == null) return NotFound();
            return Ok(recipe);
        }

        // GET /api/recipes/me — get current chef's own recipes
        [HttpGet("me")]
        [Authorize(Roles = "Chef,Admin")]
        public async Task<IActionResult> GetMine()
        {
            var chefId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var recipes = await _recipeService.GetByChefAsync(chefId);
            return Ok(recipes);
        }

        // GET /api/recipes/chef/{chefId} — get a specific chef's recipes (public)
        [HttpGet("chef/{chefId}")]
        public async Task<IActionResult> GetByChef(string chefId)
        {
            var recipes = await _recipeService.GetByChefAsync(chefId);
            return Ok(recipes);
        }

        // POST /api/recipes — create a recipe (Chef or Admin only)
        [HttpPost]
        [Authorize(Roles = "Chef,Admin")]
        public async Task<IActionResult> Create([FromBody] CreateRecipeDto dto)
        {
            if (string.IsNullOrWhiteSpace(dto.Title))
                return BadRequest(new { message = "Title is required." });
            if (dto.Ingredients == null || dto.Ingredients.Count == 0)
                return BadRequest(new { message = "At least one ingredient is required." });
            if (dto.Instructions == null || dto.Instructions.Count == 0)
                return BadRequest(new { message = "At least one instruction is required." });

            var chefId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var chefName = User.FindFirstValue(ClaimTypes.Name);

            var recipe = await _recipeService.CreateAsync(dto, chefId, chefName);
            return CreatedAtAction(nameof(GetById), new { id = recipe.Id }, recipe);
        }

        // PUT /api/recipes/{id} — update a recipe (owner or Admin)
        [HttpPut("{id}")]
        [Authorize(Roles = "Chef,Admin")]
        public async Task<IActionResult> Update(string id, [FromBody] UpdateRecipeDto dto)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var role = User.FindFirstValue(ClaimTypes.Role);

            var success = await _recipeService.UpdateAsync(id, dto, userId, role);
            if (!success) return NotFound(new { message = "Recipe not found or not authorised." });

            return Ok(new { message = "Recipe updated." });
        }

        // DELETE /api/recipes/{id} — delete a recipe (owner or Admin)
        [HttpDelete("{id}")]
        [Authorize(Roles = "Chef,Admin")]
        public async Task<IActionResult> Delete(string id)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var role = User.FindFirstValue(ClaimTypes.Role);

            var success = await _recipeService.DeleteAsync(id, userId, role);
            if (!success) return NotFound(new { message = "Recipe not found or not authorised." });

            return Ok(new { message = "Recipe deleted." });
        }
    }
}
