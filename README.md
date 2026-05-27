# 🎮 Платформа за игри / Система за статистика на играчи

# 📌 Описание на проекта

Настоящият проект представлява модерна уеб базирана платформа за проследяване, анализиране и управление на игрова статистика на потребители. Системата позволява регистриране на потребители, добавяне на игрови мачове, анализиране на резултати, визуализация на статистики и управление на платформата чрез административен панел.

Проектът е разработен като дипломна работа с цел демонстриране на знания и умения в областта на:

- Full-Stack разработката
- Backend програмирането
- REST API архитектурата
- Сигурността на уеб приложения
- Работа с бази данни
- Визуализацията на данни
- Docker контейнеризацията

---

# 🎯 Основни цели на проекта

Основната цел на системата е създаването на интерактивна gaming платформа, която позволява:

- Проследяване на игрови статистики
- Анализ на представянето на играчите
- Управление на потребители
- Визуализиране на данни чрез графики
- Създаване на leaderboard система
- Административно управление на платформата
- Използване на сигурна JWT authentication система

---

# 🧩 Основни функционалности

# 👤 Потребителска система

Системата поддържа:

- Регистрация на потребители
- Вход в системата
- JWT Authentication
- Защитени маршрути
- USER и ADMIN роли
- Потребителски профили
- Преглед на статистики
- История на мачове

---

# 🛡️ Административен панел

Администраторът разполага със специален Admin Panel, който позволява:

- Преглед на всички потребители
- Изтриване на потребители
- Управление на платформата
- Достъп до административни функции
- Преглед на потребителски профили

---

# 🎮 Управление на игри

Платформата позволява:

- Преглед на игри
- Търсене на игри
- Филтриране по жанр
- Свързване на игри към профила
- Преглед на изиграни игри

Поддържани игри:

- CS2
- Valorant
- PUBG
- Fortnite
- League of Legends

---

# 📊 Dashboard и статистики

Системата съдържа цялостен Dashboard модул с:

- Global Game Statistics
- Total Kills
- Win Rate
- KD Ratio
- Average Score
- XP система
- Player Level система
- Achievement система
- Recent Activity секция

---

# 📈 Analytics система

Използвана е библиотеката Chart.js за визуализиране на:

- KD Ratio Analytics
- Win Rate Analytics
- Score Analytics
- Performance Charts
- Statistics Graphs

---

# 🏆 Leaderboard система

Потребителите могат:

- Да разглеждат класации
- Да търсят играчи
- Да филтрират по игри
- Да сортират по kills и wins
- Да сравняват резултати

---

# 🗄️ База данни

Проектът използва MongoDB база данни.

Причини за избора:

- Гъвкава структура
- Подходяща за gaming statistics
- Работа с динамични данни
- Лесна интеграция със Spring Boot
- Добра производителност

---

# ⚙️ Използвани технологии

# Backend технологии

Backend частта е разработена със:

- Java 21
- Spring Boot 3
- Spring Security
- Spring Validation
- Spring WebFlux
- Spring Cache
- JWT Authentication
- Swagger / OpenAPI
- MongoDB
- Maven
- Docker
- MapStruct
- Lombok

---

# 🎨 Frontend технологии

Frontend частта е разработена със:

- HTML5
- CSS3
- JavaScript (Vanilla JS)
- Font Awesome
- Chart.js

Използвани са:

- Responsive Design
- Dynamic Rendering
- Sidebar Navigation
- Dashboard UI
- Interactive Charts
- Modern Card Components

---

# 🔐 Сигурност

Системата използва:

- JWT Authentication
- Password Encryption
- Spring Security
- Role-Based Authorization
- Protected API Endpoints
- Secure Login/Register система

---

# 📄 Swagger документация

Проектът съдържа Swagger/OpenAPI документация за backend API.

Swagger предоставя:

- Тестване на API endpoints
- Request/Response модели
- Authentication тестове
- Backend документация

Достъп:

```bash
http://localhost:8080/swagger-ui/index.html
```

# 💻 Използвани приложения и инструменти

По време на разработката са използвани:

# IntelliJ IDEA

Използван за:

Backend разработка
Spring Boot configuration
Maven управление
Java development

# MongoDB

Използван за:

Съхранение на данни
User management
Match statistics
Gaming analytics

# Postman

Използван за:

Тестване на REST API
JWT authentication тестове
Request/Response проверка
API debugging

# Docker Desktop

Използван за:

Контейнеризация на приложението
Стартиране на backend услугите
Deployment тестове