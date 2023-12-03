using ECommerceBackEnd.Entities;

namespace ECommerceBackEnd.Contracts
{
    public interface ICategoryRepository
    {
        int GetLatestId();
        void CreateCategory(Category newCategory);
        void DeleteCategoryById(int CID);
        IEnumerable<Category> GetCategories();
        Category GetCategoryById(int CID);
        void UpdateCategory(Category category);
    }
}