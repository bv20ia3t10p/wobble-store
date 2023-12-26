using wobbleBackEnd.Entities;

namespace wobbleBackEnd.Service.Contracts
{
    public interface IStatService
    {
        IEnumerable<AverageShipping> AvgMonthly();
        IEnumerable<AverageShipping> AvgYearly();
        IEnumerable<OrderStatusSummaries> GetMonthlyOrderStatusSummaries();
        IEnumerable<MonthlyTotal> GetMonthlyTotal();
        IEnumerable<OrderStatusSummaries> GetYearlyOrderStatusSummaries();
        public IEnumerable<OrderCount> CountMonthly();
        public IEnumerable<OrderCount> CountYearly();
    }
}