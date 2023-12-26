using MongoDB.Bson;
using MongoDB.Driver;
using wobbleBackEnd.Contracts;
using wobbleBackEnd.Entities;

namespace wobbleBackEnd.Repositories
{
    public class StatRepository : IStatRepository
    {
        protected IMongoDatabase _database;
        public StatRepository(IMongoDatabase database)
        {
            this._database = database;
        }
        public IEnumerable<OrderStatusSummaries> GetYearlyOrderStatus()
        {
            return _database.GetCollection<OrderStatusSummaries>("OrderStatusByYear").Find(new BsonDocument()).ToList();
        }
        public IEnumerable<OrderStatusSummaries> GetMonthlyOrderStatus()
        {
            return _database.GetCollection<OrderStatusSummaries>("OrderStatusByMonth").Find(new BsonDocument()).ToList();
        }
        public IEnumerable<MonthlyTotal> GetMonthlyTotal()
        {
            return _database.GetCollection<MonthlyTotal>("MonthlyTotal").Find(new BsonDocument()).ToList();
        }
        public IEnumerable<AverageShipping> GetYearlyAvgShipping()
        {
            return _database.GetCollection<AverageShipping>("AverageDayforshippingByYear").Find(new BsonDocument()).ToList();
        }
        public IEnumerable<AverageShipping> GetMonthlyAvgShipping()
        {
            return _database.GetCollection<AverageShipping>("AverageDayforshippingByMonth").Find(new BsonDocument()).ToList();
        }
        public IEnumerable<OrderCount> GetMonthlyCount() => _database.GetCollection<OrderCount>("NumberofOrderByMonth").Find(new BsonDocument()).ToList();
        public IEnumerable<OrderCount> GetYearlyCount() => _database.GetCollection<OrderCount>("NumberofOrderByYear").Find(new BsonDocument()).ToList();
    }
}
