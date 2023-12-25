using ECommerceBackEnd;

namespace wobbleBackEnd.Service.Contracts
{
    public interface IUriService
    {
        public Uri GetPageUri(PaginationFilter filter, string route);
    }
}
