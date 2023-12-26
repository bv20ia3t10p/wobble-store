using ECommerceBackEnd.Contracts;
using wobbleBackEnd.Entities;
using wobbleBackEnd.Service.Contracts;

namespace wobbleBackEnd.Service
{
    public class StatService : IStatService
    {
        private readonly IRepositoryManager _repository;

        public StatService(IRepositoryManager repository)
        {
            _repository = repository;
        }
        public IEnumerable<OrderStatusSummaries> GetYearlyOrderStatusSummaries() => _repository.Stat.GetYearlyOrderStatus();
        public IEnumerable<OrderStatusSummaries> GetMonthlyOrderStatusSummaries() => _repository.Stat.GetMonthlyOrderStatus();
        public IEnumerable<MonthlyTotal> GetMonthlyTotal() => _repository.Stat.GetMonthlyTotal();
        public IEnumerable<AverageShipping> AvgMonthly() => _repository.Stat.GetMonthlyAvgShipping();
        public IEnumerable<AverageShipping> AvgYearly() => _repository.Stat.GetYearlyAvgShipping();
        public IEnumerable<OrderCount> CountMonthly() => _repository.Stat.GetMonthlyCount();
        public IEnumerable<OrderCount> CountYearly() => _repository.Stat.GetYearlyCount();

    }
}
