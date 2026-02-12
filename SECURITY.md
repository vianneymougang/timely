# Security Configuration Guide

## Environment Variables

All sensitive credentials have been externalized from the codebase and must be configured via environment variables.

### Setup Instructions

1. **Copy the example file**:
   ```bash
   cp .env.example .env
   ```

2. **Edit `.env` with your actual values**:
   ```bash
   nano .env  # or use your preferred editor
   ```

3. **IMPORTANT**: Never commit `.env` to version control. It's already in `.gitignore`.

### Required Variables

#### Database Passwords
- `DB_PASSWORD`: PostgreSQL password for all microservices databases
  - Used by: auth-service, user-service, planning-service, booking-service, report-service, agora-service
  - Default: `changeme` (for development only)

- `MONGODB_PASSWORD`: MongoDB password for notification service
  - Used by: notification-service
  - Default: `changeme` (for development only)

#### JWT Secret Key
- `JWT_SECRET`: Secret key for JWT token generation and validation
  - **REQUIRED**: Must be set explicitly (no default value)
  - Minimum: 256 bits (32 characters) for HS256 algorithm
  - Used by: auth-service, agora-service, notification-service, report-service
  - Generate a strong secret:
    ```bash
    openssl rand -base64 32
    ```

#### RabbitMQ Credentials
- `RABBITMQ_USERNAME`: RabbitMQ username (default: `admin`)
- `RABBITMQ_PASSWORD`: RabbitMQ password
  - Used by: all microservices
  - Default: `changeme` (for development only)

#### Agora API Credentials
- `AGORA_API_URL`: External Agora API URL
  - Default: `https://api.agora.example.com`
- `AGORA_USERNAME`: Agora API username (default: `admin`)
- `AGORA_PASSWORD`: Agora API password
  - Used by: agora-service
  - Default: `changeme` (for development only)

#### Optional: Twilio Configuration
- `TWILIO_ACCOUNT_SID`: Twilio account SID for SMS notifications
- `TWILIO_AUTH_TOKEN`: Twilio authentication token
- `TWILIO_PHONE_NUMBER`: Twilio phone number
- `TWILIO_ENABLED`: Enable/disable Twilio (default: `false`)

#### Optional: Firebase Configuration
- `FIREBASE_CREDENTIALS_PATH`: Path to Firebase credentials JSON file
- `FIREBASE_ENABLED`: Enable/disable Firebase push notifications (default: `false`)

#### Optional: pgAdmin Configuration
- `PGADMIN_DEFAULT_EMAIL`: pgAdmin login email (default: `pgadmin@pgadmin.org`)
- `PGADMIN_DEFAULT_PASSWORD`: pgAdmin login password (default: `admin`)

### Usage

#### For Local Development

Export variables in your shell:
```bash
export DB_PASSWORD="your-secure-password"
export JWT_SECRET="$(openssl rand -base64 32)"
export RABBITMQ_PASSWORD="your-rabbitmq-password"
export MONGODB_PASSWORD="your-mongodb-password"
export AGORA_PASSWORD="your-agora-password"
```

Or source the `.env` file:
```bash
set -a
source .env
set +a
```

#### For Docker Compose

Docker Compose automatically reads the `.env` file in the same directory.

```bash
docker-compose up -d
```

#### For Production

Use your deployment platform's secret management:
- **Kubernetes**: Use Secrets and ConfigMaps
- **AWS**: Use AWS Secrets Manager or Parameter Store
- **Azure**: Use Azure Key Vault
- **Google Cloud**: Use Secret Manager

### Security Best Practices

1. **Never commit secrets to git**
   - The `.env` file is in `.gitignore`
   - Review all commits before pushing

2. **Use strong passwords**
   - Minimum 16 characters
   - Mix of uppercase, lowercase, numbers, and symbols

3. **Rotate secrets regularly**
   - Change passwords every 90 days
   - Immediately rotate if compromised

4. **Use different secrets for each environment**
   - Development, staging, and production must have different credentials

5. **Limit secret access**
   - Only grant access to personnel who need it
   - Use platform-specific IAM/RBAC controls

6. **Monitor and audit**
   - Enable audit logging for secret access
   - Monitor for unusual authentication patterns

### Troubleshooting

#### Service fails to start with "JWT_SECRET must be set"
- Ensure `JWT_SECRET` is defined in your `.env` file or environment
- Generate one with: `openssl rand -base64 32`

#### Database connection errors
- Verify `DB_PASSWORD` matches the password in your database
- For Docker: ensure the password matches `POSTGRES_PASSWORD` in docker-compose.yml

#### RabbitMQ authentication failures
- Check `RABBITMQ_PASSWORD` matches `RABBITMQ_DEFAULT_PASS` in docker-compose.yml
- Verify username is `admin` (or update both places)

### Migration from Hardcoded Values

If upgrading from an older version with hardcoded passwords:

1. **Local development**: Change passwords in your local database to match `.env` values
2. **Docker**: Remove old volumes and recreate with new passwords:
   ```bash
   docker-compose down -v
   docker-compose up -d
   ```
3. **Production**: Coordinate with your team for a maintenance window

## Reporting Security Issues

If you discover a security vulnerability, please email security@example.com instead of creating a public issue.
