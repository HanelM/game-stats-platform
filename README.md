# 🎮 Game Stats Platform

Мащабируема backend система, изградена със Spring Boot, MongoDB и JWT Security, създадена да симулира реална платформа за анализ на игрови данни и сравнение на играчи.
Проектът позволява на потребители да се регистрират, да се автентикират, да сравняват играчи в игри и да следят историята на сравненията с пагинация и сортиране.

---

# 🚀 Преглед на проекта

Game Stats Platform е backend система, фокусирана върху обработка на игрови данни и логика за сравнение на играчи.
Тя демонстрира професионална backend архитектура, включително автентикация, ролеви базиран security модел, layered дизайн, DTO мапинг, exception handling и интеграция с база данни.

Системата е проектирана като основа за бъдещ frontend dashboard (React/Angular), където потребителите ще могат да взаимодействат визуално с игрови статистики.

---

# 🏗️ Архитектура

Проектът следва чиста layered архитектура:  
Controller Layer → Service Layer → Repository Layer → MongoDB

### Разбивка на слоевете:

**Controller Layer**
Обработва HTTP заявки  
Излага REST API endpoints  
Работи само с DTO или request обекти

**Service Layer**
Съдържа бизнес логика  
Обработва логиката за сравнение и история  
Използва Mapper за DTO конверсия

**Repository Layer**
Spring Data MongoDB repositories  
Обработва операции с базата данни

**DTO Layer**
Разделя вътрешните entity модели от API отговорите  
Подобрява сигурността и поддръжката

**Mapper Layer**
Конвертира Entity ↔ DTO  
Поддържа controller-ите чисти и професионални

---

# 🔐 Security (JWT + Spring Security)

Проектът имплементира stateless автентикация чрез JWT:

### Функции:
Регистрация и login на потребител  
Генериране на JWT token  
JWT validation filter (JwtAuthFilter)  
Role-based достъп (USER / ADMIN)  
Защитени endpoints чрез Spring Security

### Security Flow:
Потребителят се логва  
Сървърът генерира JWT token  
Клиентът изпраща token в Authorization: Bearer  
Filter валидира token при всяка заявка  
SecurityContext се обновява

---

# 👤 User System

### Entity: User
id  
username (unique)  
email (unique)  
password  
role

### Repository функции:
findByUsername  
findByEmail  
проверки за съществуване  
търсене с пагинация

---

# 🎮 Game Comparison System

Основната функция на платформата е сравняване на играчи в игри.

### Примерни данни за сравнение:
Игра: PUBG  
Играч 1  
Играч 2  
По-добър играч  
Timestamp

---

# 📜 History System

### Функции:
Съхранява всички сравнения на потребителя  
Пагинирани резултати  
Сортиране по дата (най-нови първи)  
Сигурност (user-specific данни чрез JWT)


---

# 📊 Pagination & Sorting

Системата поддържа:

Page-based pagination  
Конфигурируем размер на страницата  
Сортиране по comparedAt (descending)

### Това осигурява:
Оптимизация на производителността  
Скалируемост за големи обеми от данни

---

# ⚠️ Exception Handling (Професионален стандарт)


### Обработва:
JWT грешки (401 Unauthorized)  
Validation грешки (400 Bad Request)  
Resource конфликти (409 Conflict)  
Общи server грешки (500)

### Custom Exceptions:
ResourceNotFoundException  
ResourceAlreadyExistsException

### Това осигурява:
Чисти API отговори  
Консистентна структура на грешките  
Production-level стабилност

---

# 🧩 Основни функции

✔ JWT Authentication  
✔ Spring Security Role System  
✔ MongoDB интеграция  
✔ Player comparison логика  
✔ Comparison history tracking  
✔ Pagination & sorting  
✔ DTO + Mapper архитектура  
✔ Global exception handling  
✔ RESTful API дизайн

---

# 🛠️ Tech Stack

Java 21  
Spring Boot 3  
Spring Security  
JWT (jjwt)  
MongoDB  
Spring Data MongoDB  
Lombok  
Maven  
