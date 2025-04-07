namespace NotificationService.Services
{
    public class NotificationService : INotificationService
    {

        public async Task SendNotificationAsync(string message)
        {
            Console.WriteLine($" Уведомление отправлено: {message}");
            await Task.CompletedTask;
        }
    }
}
