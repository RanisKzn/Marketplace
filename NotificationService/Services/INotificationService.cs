namespace NotificationService.Services
{
    public interface INotificationService
    {
        Task SendNotificationAsync(string message);
    }
}
