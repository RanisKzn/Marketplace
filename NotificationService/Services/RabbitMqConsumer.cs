using System.Text;
using System.Text.Json;
using Microsoft.Extensions.Configuration;
using RabbitMQ.Client;
using RabbitMQ.Client.Events;
using RabbitMQ.Client.Exceptions;

namespace NotificationService.Services
{
    public class RabbitMqConsumer : BackgroundService
    {
        private readonly string _hostName;
        private readonly string _queueName = "order_notifications";
        private readonly IServiceProvider _serviceProvider;

        public RabbitMqConsumer(IServiceProvider serviceProvider, IConfiguration configuration)
        {
            _serviceProvider = serviceProvider;
            _hostName = configuration.GetValue<string>("rabbitmq");
        }

        protected override Task ExecuteAsync(CancellationToken stoppingToken)
        {

            var factory = new ConnectionFactory() { HostName = _hostName };
            while (!stoppingToken.IsCancellationRequested)
            {
                try
                {
                    var connection = factory.CreateConnection();
                    var channel = connection.CreateModel();

                    channel.QueueDeclare(queue: _queueName, durable: true, exclusive: false, autoDelete: false, arguments: null);

                    var consumer = new EventingBasicConsumer(channel);
                    consumer.Received += async (model, ea) =>
                    {
                        var body = ea.Body.ToArray();
                        var message = Encoding.UTF8.GetString(body);
                        Console.WriteLine($"Получено сообщение: {message}");

                        using var scope = _serviceProvider.CreateScope();
                        var notificationService = scope.ServiceProvider.GetRequiredService<INotificationService>();
                        await notificationService.SendNotificationAsync(message);
                    };

                    channel.BasicConsume(queue: _queueName, autoAck: true, consumer: consumer);

                    break;
                }
                catch (BrokerUnreachableException)
                {
                    Console.WriteLine("Не удалось подключиться к RabbitMQ. Повторная попытка через 5 секунд...");
                    Task.Delay(5000, stoppingToken);
                }
            }
            return Task.CompletedTask;
        }
    }
}
