using ECommerceBackEnd.Contracts;
using ECommerceBackEnd.Entities;
using MongoDB.Bson;
using MongoDB.Driver;

namespace ECommerceBackEnd.Repositories
{
    public class CategoryRepository : RepositoryBase<Category>, ICategoryRepository
    {
        public CategoryRepository(IMongoDatabase database, string collectionName)
        : base(database, collectionName)
        {
        }
        public int GetLatestId()
        {
            int latestId =  GetAll().OrderByDescending(c => c.CategoryId).FirstOrDefault().CategoryId + 1;
            return latestId;
        }
        public void CreateCategory(Category newCategory)
        {
            Create(newCategory);
        }
        public void DeleteCategoryById(int cid) => Delete(c => c.CategoryId == cid);

        public Category GetCategoryById(int CID) => GetByCondition(c => c.CategoryId == CID);

        public IEnumerable<Category> GetCategories() => GetAll();

        public void UpdateCategory(Category category) => Update(c => c.CategoryId == category.CategoryId, category);
    }
}
