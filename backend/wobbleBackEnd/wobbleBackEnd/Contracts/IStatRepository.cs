using wobbleBackEnd.Entities;

namespace wobbleBackEnd.Contracts
{
    public interface IStatRepository
    {
        IEnumerable<AverageShipping> GetMonthlyAvgShipping();
        IEnumerable<OrderStatusSummaries> GetMonthlyOrderStatus();
        IEnumerable<MonthlyTotal> GetMonthlyTotal();
        IEnumerable<AverageShipping> GetYearlyAvgShipping();
        IEnumerable<OrderStatusSummaries> GetYearlyOrderStatus();
        IEnumerable<OrderCount> GetMonthlyCount();
        IEnumerable<OrderCount> GetYearlyCount();
    }
}