# SynQ CRM Backend API

A simplified backend system for managing leads, tags, and tasks, similar to a mini CRM.

## Features

- Lead management (CRUD)
- Tag creation + assign/remove tags on leads
- Task creation + completion tracking
- Search by lead name/email
- Filter leads by status
- Built with Express + TypeScript + PostgreSQL + Drizzle

---

## Quick Start

### 1. Prerequisites

- Node.js v16+ (recommended)
- PostgreSQL database
- `npm` (or `yarn`)

### 2. Initialize project

```bash
cd "d:/gurgaon job/backend"
npm install
```

### 3. Environment

Create `.env` (or copy from example if available):

```bash
copy .env.example .env
```

Set:

```
DATABASE_URL=postgresql://USER:PASSWORD@HOST:PORT/DATABASE
PORT=4000
```

### 4. Database migration

```bash
npm run db:sync
# or separately:
# npm run generate
# npm run migrate
```

### 5. Start server

```bash
npm run dev
```

Default: `http://localhost:4000`

---

## Health check

```http
GET http://localhost:4000/health
```

Response:

```json
{
  "status": "OK",
  "message": "SynQ CRM API is running",
  "timestamp": "2026-..."
}
```

---

## Base API path

`http://localhost:4000/api`

---

## Leads endpoints

### Create lead

```bash
curl -X POST "http://localhost:4000/api/leads" \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com","status":"open"}'
```

### Get all leads

```bash
curl "http://localhost:4000/api/leads"
```

### Get lead by ID

```bash
curl "http://localhost:4000/api/leads/<leadId>"
```

### Update lead

```bash
curl -X PUT "http://localhost:4000/api/leads/<leadId>" \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe Updated","email":"john.doe@new.com","status":"contacted"}'
```

### Delete lead

```bash
curl -X DELETE "http://localhost:4000/api/leads/<leadId>"
```

### Filter leads by status

```bash
curl "http://localhost:4000/api/leads/filter/status?status=open"
```

### Search leads (name or email)

```bash
curl "http://localhost:4000/api/leads/search?q=john"
```

---

## Tags endpoints

### Create tag

```bash
curl -X POST "http://localhost:4000/api/tags" \
  -H "Content-Type: application/json" \
  -d '{"name":"VIP"}'
```

### Get all tags

```bash
curl "http://localhost:4000/api/tags"
```

### Assign tag to lead

```bash
curl -X POST "http://localhost:4000/api/tags/assign" \
  -H "Content-Type: application/json" \
  -d '{"leadId":"<leadId>","tagName":"VIP"}'
```

### Assign multiple tags to lead

```bash
curl -X POST "http://localhost:4000/api/tags/assign-multiple" \
  -H "Content-Type: application/json" \
  -d '{"leadId":"<leadId>","tagNames":["VIP","Priority"]}'
```

### Remove tag from lead

```bash
curl -X DELETE "http://localhost:4000/api/tags/remove" \
  -H "Content-Type: application/json" \
  -d '{"leadId":"<leadId>","tagId":"<tagId>"}'
```

### Get tags for lead

```bash
curl "http://localhost:4000/api/tags/lead/<leadId>"
```

---

## Tasks endpoints

### Create task for lead

```bash
curl -X POST "http://localhost:4000/api/tasks" \
  -H "Content-Type: application/json" \
  -d '{"leadId":"<leadId>","title":"Follow up call","dueDate":"2026-04-01T12:00:00.000Z"}'
```

- `dueDate` is optional, defaults to 24h later if omitted.

### Get tasks for lead

```bash
curl "http://localhost:4000/api/tasks/lead/<leadId>"
```

### Get task by ID

```bash
curl "http://localhost:4000/api/tasks/<taskId>"
```

### Mark task complete

```bash
curl -X PATCH "http://localhost:4000/api/tasks/<taskId>/complete"
```

### Delete task

```bash
curl -X DELETE "http://localhost:4000/api/tasks/<taskId>"
```

---

## API response format

All JSON API responses follow this structure:

```json
{
  "statusCode": 200,
  "data": ...,
  "message": "..."
}
```

Errors return with standard HTTP status codes and JSON error details from `ApiError`.

---

## Troubleshooting

- Ensure `DATABASE_URL` is correct
- Ensure Postgres driver can connect and DB is running
- Check console logs (`.env` and `node` output)
- Re-run migrations if schema mismatch

---

## Postman collection

You can create a Postman collection manually with the endpoints above.

1. New collection: `SynQ CRM Backend`
2. Add requests for each path
3. Set environment var `baseUrl` to `http://localhost:4000`
4. Use `{{baseUrl}}/api/leads`, etc.
,
  "phone": "+1234567890",
  "source": "linkedin",
  "status": "new"
}
```

### Get All Leads
```http
GET /api/leads
```

### Get Lead by ID
```http
GET /api/leads/{id}
```

### Update Lead
```http
PUT /api/leads/{id}
Content-Type: application/json

{
  "name": "John Doe Updated",
  "status": "contacted"
}
```

### Delete Lead
```http
DELETE /api/leads/{id}
```

### Filter Leads by Status
```http
GET /api/leads/filter/status?status=new
```

### Search Leads
```http
GET /api/leads/search?q=john
```
Searches by both name and email (case-insensitive).

## Tag Management

### Create Tag
```http
POST /api/tags
Content-Type: application/json

{
  "name": "high-value"
}
```

### Get All Tags
```http
GET /api/tags
```

### Assign Tag to Lead
```http
POST /api/tags/assign
Content-Type: application/json

{
  "leadId": "uuid-of-lead",
  "tagName": "high-value"
}
```

### Assign Multiple Tags to Lead
```http
POST /api/tags/assign-multiple
Content-Type: application/json

{
  "leadId": "uuid-of-lead",
  "tagNames": ["high-value", "urgent", "enterprise"]
}
```

### Remove Tag from Lead
```http
DELETE /api/tags/remove
Content-Type: application/json

{
  "leadId": "uuid-of-lead",
  "tagId": "uuid-of-tag"
}
```

### Get Tags for Lead
```http
GET /api/tags/lead/{leadId}
```

## Task Management

### Create Task for Lead
```http
POST /api/tasks
Content-Type: application/json

{
  "leadId": "uuid-of-lead",
  "title": "Follow up call",
  "dueDate": "2024-01-15T10:00:00Z"
}
```

### Get Tasks for Lead
```http
GET /api/tasks/lead/{leadId}
```

### Get Task by ID
```http
GET /api/tasks/{taskId}
```

### Mark Task as Completed
```http
PATCH /api/tasks/{taskId}/complete
```

### Delete Task
```http
DELETE /api/tasks/{taskId}
```

## Data Models

### Lead
```typescript
{
  id: string;        // UUID
  name: string;      // Required, min 2 chars
  email: string;     // Required, valid email, unique
  phone: string;     // Required, min 10 chars
  source: "linkedin" | "whatsapp" | "email";
  status: "new" | "contacted" | "qualified" | "closed";
  createdAt: string; // ISO timestamp
}
```

### Tag
```typescript
{
  id: string;    // UUID
  name: string;  // Required, unique, max 100 chars
}
```

### Task
```typescript
{
  id: string;        // UUID
  leadId: string;    // UUID, references Lead
  title: string;     // Required, max 500 chars
  dueDate: string;   // ISO timestamp
  status: "pending" | "completed";
}
```

## Validation Rules

- **Email**: Must be valid email format and unique
- **Phone**: Minimum 10 characters
- **Name**: Minimum 2 characters
- **Required fields**: All required fields must be provided
- **UUIDs**: All ID parameters must be valid UUIDs

## Automatic Features

When a new lead is created, the system automatically creates a default task:
- **Title**: "Follow up within 24 hours"
- **Due Date**: Current time + 24 hours
- **Status**: "pending"

## Error Handling

All errors return a consistent format:
```json
{
  "statusCode": 400,
  "success": false,
  "message": "Error description",
  "data": null
}
```

Common error codes:
- `400`: Validation error
- `404`: Resource not found
- `409`: Duplicate resource (e.g., email already exists)

## Development

### Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run db:generate` - Generate database migrations
- `npm run db:migrate` - Run database migrations
- `npm run db:studio` - Open Drizzle Studio

### Project Structure

```
src/
├── controllers/     # Route handlers
├── services/        # Business logic
├── validation/      # Zod schemas
├── routes/         # Express routes
├── db/            # Database configuration and schema
└── utils/         # Utility functions
```
