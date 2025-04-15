namespace ProductService.Services
{
    public interface IYandexStorageService
    {
        Task<string> UploadFileAsync(Stream fileStream, string fileName, string contentType);
    }
}
