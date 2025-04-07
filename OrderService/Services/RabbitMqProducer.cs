using Microsoft.AspNetCore.Connections;
using System.Text.Json;
using System.Text;
using RabbitMQ.Client;

namespace OrderService.Services
{
    public class RabbitMqProducer
    {
        private readonly string _hostName;
        private readonly string _queueName = "order_notifications";

        public RabbitMqProducer(IConfiguration configuration)
        {
            _hostName = configuration.GetValue<string>("rabbitmq");
        }
        public async void SendMessage<T>(T message)
        {

            var factory = new ConnectionFactory() { HostName = _hostName };

            using var connection = factory.CreateConnection();
            using var channel = connection.CreateModel();

            channel.QueueDeclare(
                queue: _queueName,
                durable: true,
                exclusive: false,
                autoDelete: false,
                arguments: null
            );

            var messageBody = Encoding.UTF8.GetBytes(JsonSerializer.Serialize(message));

            var properties = channel.CreateBasicProperties();
            properties.Persistent = true;

            channel.BasicPublish(
                exchange: "",
                routingKey: _queueName,
                basicProperties: properties,
                body: messageBody
            );
        }
    }
}
