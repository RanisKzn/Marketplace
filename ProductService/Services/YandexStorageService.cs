using Amazon.Runtime;
using Amazon.S3.Model;
using Amazon.S3;

namespace ProductService.Services
{
    public class YandexStorageService : IYandexStorageService
    {
        private readonly IAmazonS3 _s3Client;
        private readonly string _bucketName;

        public YandexStorageService()
        {
            var credentials = new BasicAWSCredentials(
                Environment.GetEnvironmentVariable("AK"),
                Environment.GetEnvironmentVariable("SK")
            );

            var config = new AmazonS3Config
            {
                ServiceURL = Environment.GetEnvironmentVariable("ServiceUrl"),
                ForcePathStyle = true
            };

            _s3Client = new AmazonS3Client(credentials, config);
            _bucketName = Environment.GetEnvironmentVariable("BucketName");
        }

        public async Task<string> UploadFileAsync(Stream fileStream, string fileName, string contentType)
        {
            var request = new PutObjectRequest
            {
                BucketName = _bucketName,
                Key = fileName,
                InputStream = fileStream,
                ContentType = contentType,
                CannedACL = S3CannedACL.PublicRead
            };

            await _s3Client.PutObjectAsync(request);
            return $"https://{_bucketName}.storage.yandexcloud.net/{fileName}";
        }
    }
}