# Proyecto FCAV

## Build
- `dotnet build` para compilar
- `dotnet run` para ejecutar
- `dotnet test` para tests

## Estructura esperada
- Controllers/ — controladores MVC
- Models/ — modelos y ViewModels
- Views/ — vistas Razor
- Data/ — DbContext y migraciones EF Core
- Services/ — lógica de negocio
- wwwroot/ — archivos estáticos

## Convenciones
- Nombres en PascalCase (C# estándar)
- Interfaces con prefijo I (IUserService)
- Async/await en toda operación I/O
- Connection strings en appsettings.json, NUNCA en código
