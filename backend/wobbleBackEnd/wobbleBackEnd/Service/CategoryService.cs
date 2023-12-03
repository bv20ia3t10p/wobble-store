using AutoMapper;
using ECommerceBackEnd.Contracts;
using ECommerceBackEnd.Dtos;
using ECommerceBackEnd.Entities;
using ECommerceBackEnd.Service.Contracts;

namespace ECommerceBackEnd.Service
{
    public class CategoryService : ICategoryService
    {
        private readonly IMapper _mapper;
        private readonly IRepositoryManager _repository;
        public CategoryService(IMapper mapper, IRepositoryManager repository)
        {
            _mapper = mapper;
            _repository = repository;
        }
        public CategoryDto CreateCategory(CreateCategoryDto createCategoryDto)
        {
            var categoryEntity = _mapper.Map<Category>(createCategoryDto);
            categoryEntity.CategoryId = _repository.Category.GetLatestId();
            _repository.Category.CreateCategory(categoryEntity);
            return _mapper.Map<CategoryDto>(categoryEntity);
        }
        public IEnumerable<CategoryDto> GetCategories()
            => _mapper.Map<IEnumerable<CategoryDto>>
            (_repository.Category.GetCategories());
        public void DeleteCategoryById(int id) => 
            _repository.Category.DeleteCategoryById(id);
        public CategoryDto GetCategoryById(int id) =>
            _mapper.Map<CategoryDto>(_repository.Category.GetCategoryById(id));
        public CategoryDto UpdateCategory (UpdateCategoryDto categoryDto)
        {
            var categoryInDb = _repository.Category.GetCategoryById((int)categoryDto.CategoryId);
            if ( categoryInDb != null)
            {
                throw new Exception("Category not found");
            }
            _mapper.Map(categoryDto, categoryInDb);
            _repository.Category.UpdateCategory(categoryInDb);
            return _mapper.Map<CategoryDto>(categoryInDb);
        }
    }
}
