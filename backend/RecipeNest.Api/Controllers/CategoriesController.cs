using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using RecipeNest.Api.DTOs.Categories;
using RecipeNest.Api.Services;
using System.Threading.Tasks;

namespace RecipeNest.Api.Controllers
{
    [ApiController]
    [Route("api/categories")]
    public class CategoriesController : ControllerBase
    {
        private readonly CategoryService _categoryService;

        public CategoriesController(CategoryService categoryService)
        {
            _categoryService = categoryService;
        }

        // GET /api/categories — all categories (public)
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var categories = await _categoryService.GetAllAsync();
            return Ok(categories);
        }

        // GET /api/categories/with-counts — categories with recipe counts (public)
        [HttpGet("with-counts")]
        public async Task<IActionResult> GetWithCounts()
        {
            var categories = await _categoryService.GetWithCountsAsync();
            return Ok(categories);
        }

        // POST /api/categories — create category (Admin only)
        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Create([FromBody] CreateCategoryDto dto)
        {
            if (string.IsNullOrWhiteSpace(dto.Name))
                return BadRequest(new { message = "Category name is required." });

            var category = await _categoryService.CreateAsync(dto);
            if (category == null)
                return Conflict(new { message = "Category already exists." });

            return Ok(category);
        }

        // DELETE /api/categories/{id} — delete category (Admin only)
        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Delete(string id)
        {
            var success = await _categoryService.DeleteAsync(id);
            if (!success) return NotFound();
            return Ok(new { message = "Category deleted." });
        }
    }
}
