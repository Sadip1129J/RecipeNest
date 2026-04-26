using System;

namespace RecipeNest.Api.DTOs.Categories
{
    public class CategoryDto
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public int RecipeCount { get; set; }
    }

    public class CreateCategoryDto
    {
        public string Name { get; set; }
    }
}
