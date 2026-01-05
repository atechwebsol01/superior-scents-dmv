# Superior Scents DMV - Backend API Documentation

> **Version:** 1.0.0  
> **Base URL:** `https://api.superiorscents.com/v1` (configure in `.env`)  
> **Auth:** Bearer Token (JWT)  
> **Content-Type:** `application/json`

---

## Table of Contents
1. [Authentication](#authentication)
2. [Customers](#customers)
3. [Employees](#employees)
4. [Invoices](#invoices)
5. [Payments](#payments)
6. [Services](#services)
7. [Products](#products)
8. [Reports](#reports)
9. [Settings](#settings)
10. [Data Models](#data-models)
11. [Error Handling](#error-handling)

---

## Authentication

### POST /auth/login
Authenticate user and receive JWT token.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response (200):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "1",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "admin"
  },
  "expiresIn": 86400
}
```

### POST /auth/logout
Invalidate current token.

### POST /auth/refresh
Refresh expired token.

### GET /auth/me
Get current authenticated user.

---

## Customers

### GET /customers
Fetch paginated list of customers.

**Query Parameters:**
| Param | Type | Description |
|-------|------|-------------|
| page | number | Page number (default: 1) |
| limit | number | Items per page (default: 20, max: 100) |
| search | string | Search by name, email, company |
| status | string | Filter: `active`, `inactive`, `pending` |
| sortBy | string | Sort field: `name`, `createdAt`, `company` |
| sortOrder | string | `asc` or `desc` |

**Response (200):**
```json
{
  "data": [
    {
      "id": "1",
      "firstName": "John",
      "lastName": "Smith",
      "email": "john@example.com",
      "phone": "(202) 555-0123",
      "company": "ABC Corp",
      "address": {
        "street": "123 Main St",
        "city": "Washington",
        "state": "DC",
        "zipCode": "20001"
      },
      "status": "active",
      "assignedEmployeeId": "emp_1",
      "tags": ["premium", "commercial"],
      "createdAt": "2024-01-15T10:00:00Z",
      "updatedAt": "2024-03-20T14:30:00Z"
    }
  ],
  "meta": {
    "total": 156,
    "page": 1,
    "limit": 20,
    "totalPages": 8
  }
}
```

### GET /customers/:id
Fetch single customer by ID.

### POST /customers
Create new customer.

**Request:**
```json
{
  "firstName": "John",
  "lastName": "Smith",
  "email": "john@example.com",
  "phone": "(202) 555-0123",
  "company": "ABC Corp",
  "street": "123 Main St",
  "city": "Washington",
  "state": "DC",
  "zipCode": "20001",
  "status": "active",
  "assignedEmployeeId": "emp_1",
  "tags": ["commercial"],
  "notes": "Premium customer"
}
```

### PUT /customers/:id
Update existing customer.

### DELETE /customers/:id
Delete customer (soft delete recommended).

### GET /customers/:id/history
Get customer service history.

**Response:**
```json
[
  {
    "id": "hist_1",
    "type": "service",
    "description": "Monthly scent service",
    "date": "2024-03-15",
    "employeeId": "emp_1",
    "employeeName": "John Doe",
    "amount": 299.00
  }
]
```

### GET /customers/:id/notes
Get customer notes.

### POST /customers/:id/notes
Add note to customer.

---

## Employees

### GET /employees
Fetch paginated list of employees.

**Query Parameters:**
| Param | Type | Description |
|-------|------|-------------|
| page | number | Page number |
| limit | number | Items per page |
| search | string | Search by name, email |
| status | string | `active`, `inactive`, `on-leave` |
| role | string | `admin`, `manager`, `technician`, `sales` |
| department | string | Filter by department |

**Response (200):**
```json
{
  "data": [
    {
      "id": "1",
      "firstName": "Robert",
      "lastName": "Anderson",
      "email": "robert@superiorscents.com",
      "phone": "(202) 555-1001",
      "role": "manager",
      "department": "Operations",
      "hireDate": "2022-03-15",
      "status": "active",
      "salary": 65000,
      "commissionRate": 5,
      "address": {
        "street": "100 Manager Lane",
        "city": "Washington",
        "state": "DC",
        "zipCode": "20001"
      },
      "emergencyContact": {
        "name": "Mary Anderson",
        "phone": "(202) 555-1002",
        "relationship": "Spouse"
      },
      "assignedCustomers": ["cust_1", "cust_2"],
      "createdAt": "2022-03-15T10:00:00Z",
      "updatedAt": "2024-03-20T14:30:00Z"
    }
  ],
  "meta": { ... }
}
```

### GET /employees/:id
### POST /employees
### PUT /employees/:id
### DELETE /employees/:id

### GET /employees/:id/summary
Get employee performance metrics.

**Response:**
```json
{
  "totalCustomers": 24,
  "totalServices": 142,
  "totalRevenue": 38500.00,
  "completedJobs": 138,
  "pendingJobs": 4,
  "rating": 4.8
}
```

### GET /employees/:id/schedule
### PUT /employees/:id/schedule

---

## Invoices

### GET /invoices
Fetch paginated list of invoices.

**Query Parameters:**
| Param | Type | Description |
|-------|------|-------------|
| status | string | `draft`, `sent`, `paid`, `partial`, `overdue`, `cancelled` |
| customerId | string | Filter by customer |
| dateFrom | string | Start date (YYYY-MM-DD) |
| dateTo | string | End date (YYYY-MM-DD) |

**Response (200):**
```json
{
  "data": [
    {
      "id": "1",
      "invoiceNumber": "INV-2024-001",
      "customerId": "cust_1",
      "customerName": "Johnson & Associates",
      "customerEmail": "contact@johnson.com",
      "customerPhone": "(202) 555-0101",
      "customerAddress": "123 Business Ave, Washington, DC 20001",
      "status": "paid",
      "issueDate": "2024-03-01",
      "dueDate": "2024-03-15",
      "lineItems": [
        {
          "id": "li_1",
          "description": "Monthly Scent Service - Premium",
          "quantity": 1,
          "unitPrice": 299.00,
          "total": 299.00,
          "type": "service"
        }
      ],
      "subtotal": 389.00,
      "taxRate": 6,
      "taxAmount": 23.34,
      "discount": 0,
      "total": 412.34,
      "amountPaid": 412.34,
      "balance": 0,
      "notes": "Thank you for your business!",
      "createdAt": "2024-03-01T10:00:00Z",
      "updatedAt": "2024-03-15T14:30:00Z"
    }
  ],
  "meta": { ... }
}
```

### GET /invoices/:id
### POST /invoices
### PUT /invoices/:id
### DELETE /invoices/:id

### POST /invoices/:id/email
Send invoice via email.

**Request:**
```json
{
  "email": "customer@example.com",
  "message": "Please find attached your invoice."
}
```

### GET /invoices/:id/pdf
Generate and download PDF.

**Response:** Binary PDF file

### POST /invoices/quick
Quick create invoice.

---

## Payments

### GET /payments
Fetch paginated list of payments.

**Query Parameters:**
| Param | Type | Description |
|-------|------|-------------|
| status | string | `completed`, `pending`, `failed`, `refunded` |
| paymentMethod | string | `cash`, `check`, `credit_card`, `bank_transfer`, `other` |
| customerId | string | Filter by customer |
| invoiceId | string | Filter by invoice |
| dateFrom | string | Start date |
| dateTo | string | End date |

**Response (200):**
```json
{
  "data": [
    {
      "id": "1",
      "invoiceId": "inv_1",
      "invoiceNumber": "INV-2024-001",
      "customerId": "cust_1",
      "customerName": "Johnson & Associates",
      "amount": 412.34,
      "paymentMethod": "credit_card",
      "paymentDate": "2024-03-15",
      "referenceNumber": "CC-4521",
      "notes": null,
      "status": "completed",
      "createdAt": "2024-03-15T14:30:00Z",
      "updatedAt": "2024-03-15T14:30:00Z"
    }
  ],
  "meta": { ... }
}
```

### GET /payments/:id
### POST /payments
### DELETE /payments/:id

### POST /payments/:id/refund
Process refund.

**Request:**
```json
{
  "reason": "Customer requested cancellation"
}
```

### GET /invoices/:invoiceId/payments
Get all payments for specific invoice.

---

## Services

### GET /services
```json
{
  "data": [
    {
      "id": "1",
      "name": "Monthly Scent Service - Premium",
      "description": "Premium monthly service with custom scent blends",
      "category": "subscription",
      "price": 299.00,
      "duration": "Monthly",
      "isActive": true
    }
  ]
}
```

### GET /services/:id
### POST /services
### PUT /services/:id
### DELETE /services/:id
### GET /services/categories

---

## Products

### GET /products
```json
{
  "data": [
    {
      "id": "1",
      "name": "Lavender Essential Oil - 100ml",
      "description": "Pure lavender essential oil",
      "sku": "EO-LAV-100",
      "category": "essential-oil",
      "price": 45.00,
      "cost": 18.00,
      "stockQuantity": 50,
      "reorderLevel": 10,
      "isActive": true
    }
  ]
}
```

### GET /products/:id
### POST /products
### PUT /products/:id
### DELETE /products/:id
### GET /products/categories
### PUT /products/:id/stock
Update stock quantity.

---

## Reports

### GET /reports/sales
**Query Parameters:** `dateFrom`, `dateTo`, `groupBy` (day|week|month)

**Response:**
```json
{
  "summary": {
    "totalRevenue": 24580.00,
    "invoicesSent": 42,
    "newCustomers": 12,
    "avgOrderValue": 585.00
  },
  "data": [
    { "period": "2024-03-01", "revenue": 5200.00, "count": 8 }
  ],
  "topServices": [
    { "name": "Monthly Scent Service", "revenue": 8970, "count": 30 }
  ]
}
```

### GET /reports/revenue
### GET /reports/customers
### GET /reports/employees
### GET /reports/tax-due
### GET /reports/commissions

---

## Settings

### GET /settings/company
### PUT /settings/company
### GET /settings/notifications
### PUT /settings/notifications

---

## Data Models

### Customer
```typescript
interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company?: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
  status: 'active' | 'inactive' | 'pending';
  assignedEmployeeId?: string;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
}
```

### Employee
```typescript
interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: 'admin' | 'manager' | 'technician' | 'sales';
  department: string;
  hireDate: string;
  status: 'active' | 'inactive' | 'on-leave';
  salary?: number;
  commissionRate?: number;
  address: Address;
  emergencyContact?: EmergencyContact;
  assignedCustomers?: string[];
  createdAt: string;
  updatedAt: string;
}
```

### Invoice
```typescript
interface Invoice {
  id: string;
  invoiceNumber: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerAddress: string;
  status: 'draft' | 'sent' | 'paid' | 'partial' | 'overdue' | 'cancelled';
  issueDate: string;
  dueDate: string;
  lineItems: InvoiceLineItem[];
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  discount: number;
  total: number;
  amountPaid: number;
  balance: number;
  notes?: string;
  terms?: string;
  createdAt: string;
  updatedAt: string;
}
```

### Payment
```typescript
interface Payment {
  id: string;
  invoiceId: string;
  invoiceNumber: string;
  customerId: string;
  customerName: string;
  amount: number;
  paymentMethod: 'cash' | 'check' | 'credit_card' | 'bank_transfer' | 'other';
  paymentDate: string;
  referenceNumber?: string;
  notes?: string;
  status: 'completed' | 'pending' | 'failed' | 'refunded';
  createdAt: string;
  updatedAt: string;
}
```

---

## Error Handling

All errors follow this format:

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid email format",
    "details": [
      { "field": "email", "message": "Must be a valid email address" }
    ]
  }
}
```

### HTTP Status Codes
| Code | Description |
|------|-------------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request - Validation error |
| 401 | Unauthorized - Invalid/missing token |
| 403 | Forbidden - Insufficient permissions |
| 404 | Not Found |
| 409 | Conflict - Duplicate entry |
| 422 | Unprocessable Entity |
| 500 | Internal Server Error |

### Error Codes
| Code | Description |
|------|-------------|
| AUTH_INVALID_CREDENTIALS | Wrong email/password |
| AUTH_TOKEN_EXPIRED | JWT token expired |
| VALIDATION_ERROR | Request validation failed |
| RESOURCE_NOT_FOUND | Entity doesn't exist |
| DUPLICATE_ENTRY | Email/SKU already exists |
| INSUFFICIENT_PERMISSIONS | User lacks required role |

---

## Environment Variables

Frontend requires:
```env
VITE_API_BASE_URL=https://api.superiorscents.com/v1
VITE_API_TIMEOUT=30000
```

---

## Quick Start for Backend

1. **Required endpoints (priority order):**
   - POST /auth/login
   - GET/POST/PUT/DELETE /customers
   - GET/POST/PUT/DELETE /employees
   - GET/POST/PUT/DELETE /invoices
   - GET/POST /payments

2. **Response format must match TypeScript interfaces** (see Data Models)

3. **Pagination format:**
   ```json
   { "data": [...], "meta": { "total", "page", "limit", "totalPages" } }
   ```

4. **Authentication:**
   - Return JWT on login
   - Frontend sends: `Authorization: Bearer <token>`
   - Return 401 on invalid/expired token

5. **To enable backend:**
   - Set `VITE_API_BASE_URL` in `.env`
   - Replace mock data calls in stores with service imports
   - Example: `await customerService.getAll(filters)`

---

*Generated: January 4, 2026*
