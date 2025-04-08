# 🛒 Marketplace Microservices Project

![Архитектура](./docs/architecture.png)

## 📚 Описание

Marketplace — это учебный pet-проект с микросервисной архитектурой, реализованный на базе .NET, предназначенный для изучения и практики следующих концепций:

- Микросервисы  
- Аутентификация и авторизация (JWT)  
- API Gateway (Ocelot)  
- RabbitMQ  
- Redis / PostgreSQL / MongoDB  
- Docker / Docker Compose  
- React.js (Frontend)

## 🧩 Архитектура

Проект использует архитектуру, в которой каждый микросервис отвечает за свою зону ответственности и взаимодействует через HTTP или RabbitMQ.  
Фронтенд обращается к API Gateway, который маршрутизирует запросы к нужным сервисам.

![Архитектура](./docs/architecture.png)

### 🔐 Аутентификация

- **AuthService** отвечает за регистрацию, логин и генерацию JWT-токенов.
- Все микросервисы валидируют токены самостоятельно.

### 📦 Сервисы

| Сервис               | Описание                                                       | Технологии                         |
|----------------------|----------------------------------------------------------------|------------------------------------|
| **API Gateway**      | Центральная точка входа. Маршрутизирует запросы.               | Ocelot, .NET                       |
| **AuthService**      | Регистрация, логин, JWT.                                        | ASP.NET Identity, JWT              |
| **ProductService**   | Каталог товаров.                                                | MongoDB, ASP.NET Core              |
| **CartService**      | Управление корзиной. Кэширует данные.                          | PostgreSQL, Redis                  |
| **OrderService**     | Оформление и обработка заказов.                                | PostgreSQL, RabbitMQ               |
| **NotificationService** | Отправка уведомлений после заказа.                         | RabbitMQ                           |
| **Frontend**         | Интерфейс пользователя.                                         | React.js, JavaScript               |

## 🔁 Взаимодействие

- **Frontend** → **API Gateway** → маршрутизация по сервисам.
- **AuthService** возвращает JWT токен.
- Все запросы к микросервисам проходят через **API Gateway**.
- Каждый микросервис валидирует токен самостоятельно.
- **OrderService** отправляет сообщение в **NotificationService** через **RabbitMQ**.
- **CartService** кэширует товары через Redis и взаимодействует с **ProductService** для получения деталей о товарах.

## 🐳 Docker & Compose

Проект содержит `docker-compose.yml` для локального запуска всех сервисов:

```bash
docker-compose up --build
```
## 🚧 После запуска:
- Frontend: http://localhost:3000
- API Gateway: http://localhost:5000
- RabbitMQ UI: http://localhost:15672

