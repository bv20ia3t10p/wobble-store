using ECommerceBackEnd.Service.Contracts;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using wobbleBackEnd.Entities;

namespace wobbleBackEnd.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class StatController : ControllerBase
    {
        private readonly IServiceManager _service;
        public StatController(IServiceManager service)
        {
            _service = service;
        }
        [HttpGet("MonthlySummary")]
        public ActionResult<IEnumerable<OrderStatusSummaries>> GetMonthlyStatusSummaries()=>Ok(_service.Stat.GetMonthlyOrderStatusSummaries());
        [HttpGet("YearlySummary")]
        public ActionResult<IEnumerable<OrderCountSummaries>> GetYearlyStatusSummaries() => Ok(_service.Stat.GetYearlyOrderStatusSummaries());
        [HttpGet("MonthlyTotal")]
        public ActionResult<IEnumerable<MonthlyTotal>> GetMonthlyTotal() => Ok(_service.Stat.GetMonthlyTotal());
        [HttpGet("AvgShippingMonth")]
        public ActionResult<IEnumerable<AverageShipping>> GetMonthlyShipping() => Ok(_service.Stat.AvgMonthly());
        [HttpGet("AvgShippingYear")]
        public ActionResult<IEnumerable<AverageShipping>> GetYearlyShipping()=>Ok(_service.Stat.AvgYearly());
        [HttpGet("CountMonthly")]
        public ActionResult<IEnumerable<OrderCount>> CountMonthly() => Ok(_service.Stat.CountMonthly());
        [HttpGet("CountYearly")]
        public ActionResult<IEnumerable<OrderCount>> CountYearly() => Ok(_service.Stat.CountYearly());
    }
}
