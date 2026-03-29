# SynQ CRM Backend API

A simplified backend system for managing leads, tags, and tasks, similar to a mini CRM.

## Features

- **Lead Management**: CRUD operations for leads with validation
- **Tag System**: Create and assign tags to leads
- **Task Management**: Create and manage tasks for leads
- **Search & Filter**: Search leads by name/email and filter by status
- **Automatic Task Creation**: Creates a default follow-up task when a new lead is created

## Tech Stack

- **Node.js** with Express.js
- **TypeScript**
- **PostgreSQL** with Drizzle ORM
- **Zod** for validation
- **UUID** for primary keys

## Setup Instructions

### Prerequisites

- Node.js (v16 or higher)
- PostgreSQL
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   ```
   Update `.env` with your database configuration:
   ```
   DATABASE_URL=postgresql://username:password@localhost:5432/synq_crm
   ```

4. Set up the database:
   ```bash
   npm run db:generate
   npm run db:migrate
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

The API will be available at `http://localhost:3000`

## API Documentation

### Base URL
```
http://localhost:3000/api
```

### Health Check
```
GET /health
```

## Lead Management

### Create a Lead
```http
POST /api/leads
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
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
