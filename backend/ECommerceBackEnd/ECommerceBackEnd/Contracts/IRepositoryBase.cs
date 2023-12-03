using MongoDB.Driver;
using System.Linq.Expressions;
using System.Reflection.Metadata;

namespace ECommerceBackEnd.Contracts
{
    public interface IRepositoryBase<T>
    {
        void Create(T entity);
        void Delete(Expression<Func<T, bool>> expression);
        void DeleteMany(Expression<Func<T, bool>> expression);
        IQueryable<T> GetAll();
        T GetByCondition(Expression<Func<T, bool>> expression);
        IQueryable<T> GetManyByCondition(Expression<Func<T, bool>> expression);
        void Update(Expression<Func<T, bool>> expression, T entity);
        void UpdateMany(string updateField, Expression<Func<T, bool>> expression, dynamic newValue);
        void CreateMany (IEnumerable<T> entities);
    }
}