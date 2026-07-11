---
name: fcav-cybersecurity
description: >
  Checklist de ciberseguridad para código FCAV. OWASP Top 10, 
  LGPDPPP, específico para stack Microsoft (.NET, SQL Server).
  Invocar al generar o revisar código.
---

# Checklist de Ciberseguridad FCAV

## OWASP Top 10 (2021) — Stack Microsoft

### A01: Broken Access Control
- [Authorize] en todo controller/action que requiera autenticación
- Role-based o policy-based authorization
- No exponer IDs secuenciales predecibles

### A02: Cryptographic Failures
- HTTPS forzado (UseHttpsRedirection)
- Passwords: Identity con bcrypt/Argon2, NUNCA MD5/SHA1
- Connection strings cifradas o en User Secrets / Key Vault

### A03: Injection
- SQL Server: Entity Framework o SqlParameter. NUNCA concatenar strings en queries
- LINQ sobre string interpolation
- Validar input con Data Annotations o FluentValidation

### A04: Insecure Design
- No confiar en validación del lado del cliente
- Rate limiting en endpoints sensibles (login, API)
- CSRF tokens con [ValidateAntiForgeryToken]

### A05: Security Misconfiguration
- No exponer stack traces en producción (ASPNETCORE_ENVIRONMENT=Production)
- Remover headers Server, X-Powered-By
- app.UseHsts() y app.UseHttpsRedirection()

### A06: Vulnerable Components
- NuGet packages actualizados (dotnet list package --outdated)
- No usar paquetes deprecated

### A07: Auth Failures
- Lockout policy en Identity (MaxFailedAccessAttempts)
- No revelar si el usuario existe ("Invalid credentials" genérico)
- MFA donde sea posible

### A08: Data Integrity
- Validar Content-Type de uploads
- Limitar tamaño de archivos
- No deserializar JSON sin type validation

### A09: Logging Failures
- Serilog/NLog configurado
- NO logear passwords, tokens, datos personales
- Registrar intentos de login fallidos

### A10: SSRF
- No permitir URLs arbitrarias del usuario en HttpClient
- Whitelist de dominios permitidos

## LGPDPPP (Ley Federal de Protección de Datos Personales)
Si el código maneja: nombre, CURP, RFC, matrícula, dirección, teléfono, 
email, calificaciones, o cualquier dato que identifique a una persona:
- Avisar al usuario que se manejan datos personales
- Recomendar aviso de privacidad
- Cifrado en reposo para datos sensibles
- Acceso por mínimo privilegio en BD

## Formato de output
Una línea por hallazgo: `archivo:línea → problema → fix`
Sin ensayos. Sin explicaciones largas.
