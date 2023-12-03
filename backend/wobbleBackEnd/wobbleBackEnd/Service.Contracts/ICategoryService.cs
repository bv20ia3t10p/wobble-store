using ECommerceBackEnd.Dtos;

namespace ECommerceBackEnd.Service.Contracts
{
    public interface ICategoryService
    {
        public CategoryDto CreateCategory(CreateCategoryDto createCategoryDto);
        void DeleteCategoryById(int id);
        CategoryDto GetCategoryById(int id);
        IEnumerable<CategoryDto> GetCategories();
        CategoryDto UpdateCategory(UpdateCategoryDto categoryDto);
    }
}
