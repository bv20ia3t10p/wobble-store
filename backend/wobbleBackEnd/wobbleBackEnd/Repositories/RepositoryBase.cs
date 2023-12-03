using ECommerceBackEnd.Contracts;
using ECommerceBackEnd.Entities;
using MongoDB.Bson;
using MongoDB.Driver;
using System.Linq.Expressions;
using System.Reflection.Metadata;

namespace ECommerceBackEnd.Repositories
{
    public abstract class RepositoryBase<T> : IRepositoryBase<T> where T : class
    {
        protected IMongoDatabase database;
        protected IMongoCollection<T> collection;
        protected FilterDefinitionBuilder<T> filterBuilder = Builders<T>.Filter;
        public RepositoryBase(IMongoDatabase database, string collectionName)
        {
            this.database = database;
            collection = database.GetCollection<T>(collectionName);
        }
        public void Create(T entity) => collection.InsertOne(entity);

        public void Delete(Expression<Func<T, bool>> expression) => collection.DeleteOne(expression);
        public void DeleteMany(Expression<Func<T, bool>> expression) => collection.DeleteMany(expression);

        public IQueryable<T> GetManyByCondition(Expression<Func<T, bool>> expression) => collection.Find(filterBuilder.Where(expression)).ToList().AsQueryable();
        public T GetByCondition(Expression<Func<T, bool>> expression) => collection.Find(expression).FirstOrDefault();

        public IQueryable<T> GetAll() => collection.Find(new BsonDocument()).ToList().AsQueryable();

        public void Update(Expression<Func<T, bool>> expression, T entity) => collection.ReplaceOne(filterBuilder.Where(expression), entity);
        public void UpdateMany(string updateField, Expression<Func<T, bool>> expression, dynamic newValue)
        {
            collection.UpdateMany(expression, Builders<T>.Update.Set(updateField, newValue), new UpdateOptions { IsUpsert = true });
        }
        public int ConditionalCount(Expression<Func<T, bool>> expression) => collection.Find(filterBuilder.Where(expression)).ToList().Count();
        public double ConditionalSum(Expression<Func<T, bool>> expression, string field) => collection.Find(filterBuilder.Where(expression)).ToList().Sum(c => (double)c.GetType().GetProperty(field).GetValue(c));
        public void CreateMany (IEnumerable<T> entites) => collection.InsertMany(entites);
    }
}
