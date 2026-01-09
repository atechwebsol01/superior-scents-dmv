# Superior Scents DMV, LLC
## Backend API Specification

---

**Version:** 1.0  
**Date:** January 9, 2026  
**Base URL:** `https://api.superiorscents.com/v1` (example)

---

## Table of Contents

1. [Overview](#1-overview)
2. [Authentication APIs](#2-authentication-apis)
3. [Customer APIs](#3-customer-apis)
4. [Employee APIs](#4-employee-apis)
5. [Invoice APIs](#5-invoice-apis)
6. [Payment APIs](#6-payment-apis)
7. [Service & Product APIs](#7-service--product-apis)
8. [Report APIs](#8-report-apis)
9. [Notification APIs](#9-notification-apis)
10. [Settings APIs](#10-settings-apis)
11. [File Upload APIs](#11-file-upload-apis)
12. [Data Models](#12-data-models)
13. [Error Handling](#13-error-handling)
14. [Implementation Priority](#14-implementation-priority)

---

## 1. Overview

### API Standards

| Standard | Value |
|----------|-------|
| Protocol | HTTPS (required) |
| Format | JSON |
| Authentication | JWT Bearer Token |
| Pagination | Offset-based (`page`, `limit`) |
| Date Format | ISO 8601 (`2026-01-09T10:30:00Z`) |
| Currency | USD (cents for calculations) |

### Common Headers

```
Authorization: Bearer <jwt_token>
Content-Type: application/json
Accept: application/json
```

### Common Response Structure

**Success:**
```json
{
  "success": true,
  "data": { ... },
  "message": "Operation successful"
}
```

**Error:**
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable message"
  }
}
```

**Paginated:**
```json
{
  "success": true,
  "data": [ ... ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "totalPages": 8
  }
}
```

---

## 2. Authentication APIs

### 2.1 Login
```
POST /auth/login
```

**Request:**
```json
{
  "email": "user@example.com",
  "password": "securepassword",
  "rememberMe": true
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "usr_123",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Smith",
      "role": "admin",
      "avatar": "https://...",
      "permissions": ["customers.read", "customers.write", ...]
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIs...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIs...",
    "expiresIn": 3600
  }
}
```

---

### 2.2 Register
```
POST /auth/register
```

**Request:**
```json
{
  "firstName": "John",
  "lastName": "Smith",
  "email": "john@example.com",
  "password": "securepassword",
  "confirmPassword": "securepassword"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": { ... },
    "message": "Registration successful. Please verify your email."
  }
}
```

---

### 2.3 Logout
```
POST /auth/logout
```

**Headers:** Requires Authorization

**Response:**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

### 2.4 Refresh Token
```
POST /auth/refresh
```

**Request:**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "accessToken": "new_access_token",
    "expiresIn": 3600
  }
}
```

---

### 2.5 Forgot Password
```
POST /auth/forgot-password
```

**Request:**
```json
{
  "email": "user@example.com"
}
```

---

### 2.6 Reset Password
```
POST /auth/reset-password
```

**Request:**
```json
{
  "token": "reset_token_from_email",
  "password": "newpassword",
  "confirmPassword": "newpassword"
}
```

---

### 2.7 Get Current User
```
GET /auth/me
```

**Response:** Returns current authenticated user details

---

## 3. Customer APIs

### 3.1 List Customers
```
GET /customers
```

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| page | number | Page number (default: 1) |
| limit | number | Items per page (default: 20, max: 100) |
| search | string | Search by name, email, phone |
| status | string | Filter: `active`, `inactive`, `all` |
| sortBy | string | Field to sort by |
| sortOrder | string | `asc` or `desc` |

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "cust_123",
      "name": "ABC Corporation",
      "email": "contact@abc.com",
      "phone": "(202) 555-0100",
      "address": "123 Main St",
      "city": "Washington",
      "state": "DC",
      "zip": "20001",
      "status": "active",
      "balance": 1500.00,
      "totalSpent": 25000.00,
      "createdAt": "2025-06-15T10:00:00Z",
      "lastServiceDate": "2026-01-05T14:30:00Z"
    }
  ],
  "pagination": { ... }
}
```

---

### 3.2 Get Customer
```
GET /customers/:id
```

**Response:** Full customer object with related data

---

### 3.3 Create Customer
```
POST /customers
```

**Request:**
```json
{
  "name": "New Customer Inc",
  "email": "info@newcustomer.com",
  "phone": "(202) 555-0199",
  "address": "456 Oak Ave",
  "city": "Arlington",
  "state": "VA",
  "zip": "22201",
  "notes": "Referred by ABC Corp"
}
```

---

### 3.4 Update Customer
```
PUT /customers/:id
```

**Request:** Same as create (partial updates supported)

---

### 3.5 Delete Customer
```
DELETE /customers/:id
```

---

### 3.6 Import Customers
```
POST /customers/import
```

**Request:** `multipart/form-data`
| Field | Type | Description |
|-------|------|-------------|
| file | File | CSV or Excel file |
| skipDuplicates | boolean | Skip existing emails |

**Response:**
```json
{
  "success": true,
  "data": {
    "imported": 45,
    "skipped": 3,
    "errors": [
      { "row": 12, "error": "Invalid email format" }
    ]
  }
}
```

---

### 3.7 Export Customers
```
GET /customers/export
```

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| format | string | `csv`, `xlsx`, `pdf` |
| fields | string | Comma-separated field names |
| status | string | Filter by status |

**Response:** File download

---

### 3.8 Customer Service Periods
```
GET /customers/:id/service-periods
POST /customers/:id/service-periods
PUT /customers/:id/service-periods/:periodId
DELETE /customers/:id/service-periods/:periodId
```

**Service Period Object:**
```json
{
  "id": "sp_123",
  "customerId": "cust_123",
  "frequency": "Q1",
  "startDate": "2026-01-01",
  "endDate": "2026-03-31",
  "status": "active",
  "services": [
    {
      "id": "svc_456",
      "name": "Monthly Diffuser Service",
      "quantity": 1,
      "rate": 150.00,
      "commission": 15.00
    }
  ],
  "notes": "Quarterly service agreement"
}
```

---

### 3.9 Customer Contacts
```
GET /customers/:id/contacts
POST /customers/:id/contacts
PUT /customers/:id/contacts/:contactId
DELETE /customers/:id/contacts/:contactId
```

---

### 3.10 Customer Invoices
```
GET /customers/:id/invoices
```

---

### 3.11 Customer Payments
```
GET /customers/:id/payments
```

---

## 4. Employee APIs

### 4.1 List Employees
```
GET /employees
```

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| page | number | Page number |
| limit | number | Items per page |
| search | string | Search by name, email |
| role | string | Filter by role |
| status | string | `active`, `inactive` |
| department | string | Filter by department |

---

### 4.2 Get Employee
```
GET /employees/:id
```

---

### 4.3 Create Employee
```
POST /employees
```

**Request:**
```json
{
  "firstName": "Sarah",
  "lastName": "Johnson",
  "email": "sarah@superiorscents.com",
  "phone": "(202) 555-0102",
  "role": "technician",
  "department": "Field Services",
  "hireDate": "2025-03-15",
  "salary": 45000,
  "commissionRate": 10
}
```

---

### 4.4 Update Employee
```
PUT /employees/:id
```

---

### 4.5 Delete Employee
```
DELETE /employees/:id
```

---

### 4.6 Employee Schedule
```
GET /employees/:id/schedule
POST /employees/:id/schedule
PUT /employees/:id/schedule/:eventId
DELETE /employees/:id/schedule/:eventId
```

**Schedule Event Object:**
```json
{
  "id": "evt_123",
  "employeeId": "emp_456",
  "title": "Service Call",
  "customerId": "cust_789",
  "customerName": "ABC Corporation",
  "location": "123 Main St, Washington DC",
  "date": "2026-01-15",
  "startTime": "09:00",
  "endTime": "11:00",
  "status": "scheduled",
  "notes": "Monthly maintenance"
}
```

---

### 4.7 All Schedules (Calendar View)
```
GET /schedules
```

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| startDate | date | Range start |
| endDate | date | Range end |
| employeeId | string | Filter by employee |

---

## 5. Invoice APIs

### 5.1 List Invoices
```
GET /invoices
```

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| page | number | Page number |
| limit | number | Items per page |
| search | string | Search by invoice #, customer |
| status | string | `draft`, `sent`, `paid`, `overdue`, `cancelled` |
| customerId | string | Filter by customer |
| dateFrom | date | Start date range |
| dateTo | date | End date range |

---

### 5.2 Get Invoice
```
GET /invoices/:id
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "inv_123",
    "invoiceNumber": "INV-2026-001",
    "customerId": "cust_456",
    "customer": {
      "name": "ABC Corporation",
      "email": "billing@abc.com",
      "address": "123 Main St..."
    },
    "items": [
      {
        "id": "item_1",
        "description": "Monthly Diffuser Service",
        "quantity": 2,
        "rate": 150.00,
        "amount": 300.00
      }
    ],
    "subtotal": 300.00,
    "taxRate": 6.0,
    "taxAmount": 18.00,
    "total": 318.00,
    "amountPaid": 0,
    "balance": 318.00,
    "status": "sent",
    "issueDate": "2026-01-05",
    "dueDate": "2026-02-04",
    "notes": "Thank you for your business!",
    "createdAt": "2026-01-05T10:00:00Z"
  }
}
```

---

### 5.3 Create Invoice
```
POST /invoices
```

**Request:**
```json
{
  "customerId": "cust_456",
  "items": [
    {
      "description": "Monthly Diffuser Service",
      "quantity": 2,
      "rate": 150.00
    },
    {
      "description": "Scent Refill - Lavender",
      "quantity": 4,
      "rate": 45.00
    }
  ],
  "taxRate": 6.0,
  "dueDate": "2026-02-04",
  "notes": "Net 30 terms"
}
```

---

### 5.4 Update Invoice
```
PUT /invoices/:id
```

---

### 5.5 Delete Invoice
```
DELETE /invoices/:id
```

---

### 5.6 Send Invoice (Email)
```
POST /invoices/:id/send
```

**Request:**
```json
{
  "to": ["billing@abc.com"],
  "cc": ["manager@abc.com"],
  "subject": "Invoice #INV-2026-001 from Superior Scents",
  "message": "Please find attached your invoice...",
  "attachPdf": true
}
```

---

### 5.7 Generate Invoice PDF
```
GET /invoices/:id/pdf
```

**Response:** PDF file download

---

### 5.8 Quick Invoice
```
POST /invoices/quick
```

**Request:** Simplified invoice creation with service presets

---

### 5.9 Invoice Statistics
```
GET /invoices/stats
```

**Response:**
```json
{
  "success": true,
  "data": {
    "totalOutstanding": 15420.00,
    "totalOverdue": 3200.00,
    "totalPaidThisMonth": 28500.00,
    "invoiceCount": {
      "draft": 5,
      "sent": 12,
      "paid": 45,
      "overdue": 3
    }
  }
}
```

---

## 6. Payment APIs

### 6.1 List Payments
```
GET /payments
```

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| page | number | Page number |
| limit | number | Items per page |
| status | string | `completed`, `pending`, `failed`, `refunded` |
| method | string | `credit_card`, `bank_transfer`, `cash`, `check` |
| customerId | string | Filter by customer |
| invoiceId | string | Filter by invoice |
| dateFrom | date | Start date range |
| dateTo | date | End date range |

---

### 6.2 Get Payment
```
GET /payments/:id
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "pmt_123",
    "transactionId": "TXN-2026-001",
    "invoiceId": "inv_456",
    "invoice": {
      "invoiceNumber": "INV-2026-001",
      "total": 318.00
    },
    "customerId": "cust_789",
    "customer": {
      "name": "ABC Corporation"
    },
    "amount": 318.00,
    "method": "credit_card",
    "methodDetails": {
      "cardLast4": "4242",
      "cardBrand": "visa"
    },
    "status": "completed",
    "date": "2026-01-08T14:32:00Z",
    "notes": "Full payment",
    "createdBy": "emp_123"
  }
}
```

---

### 6.3 Record Payment
```
POST /payments
```

**Request:**
```json
{
  "invoiceId": "inv_456",
  "amount": 318.00,
  "method": "credit_card",
  "methodDetails": {
    "cardLast4": "4242"
  },
  "date": "2026-01-08",
  "notes": "Full payment received"
}
```

---

### 6.4 Update Payment
```
PUT /payments/:id
```

---

### 6.5 Delete Payment
```
DELETE /payments/:id
```

---

### 6.6 Refund Payment
```
POST /payments/:id/refund
```

**Request:**
```json
{
  "amount": 100.00,
  "reason": "Partial service credit"
}
```

---

### 6.7 Payment History (Detailed)
```
GET /payments/history
```

Returns detailed transaction log with all payment activities.

---

## 7. Service & Product APIs

### 7.1 List Services
```
GET /services
```

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| type | string | `service`, `product` |
| category | string | Filter by category |
| active | boolean | Filter by active status |

---

### 7.2 Get Service
```
GET /services/:id
```

---

### 7.3 Create Service
```
POST /services
```

**Request:**
```json
{
  "name": "Monthly Diffuser Service",
  "type": "service",
  "category": "maintenance",
  "description": "Monthly scent diffuser maintenance and refill",
  "price": 150.00,
  "duration": 60,
  "active": true
}
```

---

### 7.4 Update Service
```
PUT /services/:id
```

---

### 7.5 Delete Service
```
DELETE /services/:id
```

---

### 7.6 List Inventory
```
GET /inventory
```

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| category | string | `diffuser`, `scent`, `accessory`, `consumable` |
| status | string | `in-stock`, `low-stock`, `out-of-stock` |
| location | string | Filter by warehouse location |

---

### 7.7 Get Inventory Item
```
GET /inventory/:id
```

---

### 7.8 Create Inventory Item
```
POST /inventory
```

**Request:**
```json
{
  "sku": "SCT-001",
  "name": "Lavender Scent Refill",
  "category": "scent",
  "quantity": 150,
  "minStock": 50,
  "maxStock": 200,
  "unitPrice": 45.00,
  "costPrice": 18.00,
  "location": "Warehouse B"
}
```

---

### 7.9 Update Inventory
```
PUT /inventory/:id
```

---

### 7.10 Stock Movement
```
POST /inventory/:id/movement
```

**Request:**
```json
{
  "type": "in",
  "quantity": 50,
  "reason": "Purchase Order #PO-2026-015",
  "notes": "Restocking"
}
```

---

### 7.11 Low Stock Alerts
```
GET /inventory/alerts
```

---

## 8. Report APIs

### 8.1 Dashboard Stats
```
GET /reports/dashboard
```

**Response:**
```json
{
  "success": true,
  "data": {
    "revenue": {
      "today": 1250.00,
      "thisWeek": 8500.00,
      "thisMonth": 32000.00,
      "lastMonth": 28500.00,
      "growth": 12.3
    },
    "invoices": {
      "pending": 12,
      "overdue": 3,
      "paidThisMonth": 45
    },
    "customers": {
      "total": 156,
      "active": 142,
      "newThisMonth": 8
    },
    "topCustomers": [ ... ],
    "recentActivity": [ ... ]
  }
}
```

---

### 8.2 Sales Report
```
GET /reports/sales
```

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| period | string | `daily`, `weekly`, `monthly`, `yearly` |
| dateFrom | date | Start date |
| dateTo | date | End date |
| groupBy | string | `customer`, `service`, `employee` |

---

### 8.3 Revenue Report
```
GET /reports/revenue
```

---

### 8.4 Customer Report
```
GET /reports/customers
```

---

### 8.5 Invoice Report
```
GET /reports/invoices
```

---

### 8.6 Payment Report
```
GET /reports/payments
```

---

### 8.7 Employee Report
```
GET /reports/employees
```

---

### 8.8 Commission Report
```
GET /reports/commissions
```

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| employeeId | string | Filter by employee |
| period | string | Time period |
| status | string | `pending`, `paid`, `processing` |

**Response:**
```json
{
  "success": true,
  "data": {
    "summary": {
      "totalSales": 45000.00,
      "totalCommission": 4500.00,
      "pendingPayout": 1200.00
    },
    "byEmployee": [
      {
        "employeeId": "emp_123",
        "employeeName": "John Smith",
        "totalSales": 15000.00,
        "commissionRate": 10,
        "totalCommission": 1500.00,
        "pendingCommission": 300.00
      }
    ],
    "transactions": [ ... ]
  }
}
```

---

### 8.9 Tax Report
```
GET /reports/tax
```

---

### 8.10 Custom Report
```
POST /reports/custom
```

**Request:**
```json
{
  "name": "My Custom Report",
  "dimensions": ["customer_name", "service_type"],
  "metrics": ["invoice_amount", "payment_amount"],
  "filters": [
    { "field": "date", "operator": "between", "value": ["2026-01-01", "2026-03-31"] }
  ],
  "groupBy": "customer_name",
  "sortBy": "invoice_amount",
  "sortOrder": "desc"
}
```

---

## 9. Notification APIs

### 9.1 List Notifications
```
GET /notifications
```

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| read | boolean | Filter by read status |
| type | string | `payment`, `invoice`, `customer`, `system`, `reminder` |

---

### 9.2 Get Notification
```
GET /notifications/:id
```

---

### 9.3 Mark as Read
```
PUT /notifications/:id/read
```

---

### 9.4 Mark All as Read
```
PUT /notifications/read-all
```

---

### 9.5 Delete Notification
```
DELETE /notifications/:id
```

---

### 9.6 Notification Preferences
```
GET /notifications/preferences
PUT /notifications/preferences
```

---

## 10. Settings APIs

### 10.1 Get Company Settings
```
GET /settings/company
```

**Response:**
```json
{
  "success": true,
  "data": {
    "name": "Superior Scents DMV, LLC",
    "email": "info@superiorscents.com",
    "phone": "(202) 555-0100",
    "address": "123 Scent Avenue",
    "city": "Washington",
    "state": "DC",
    "zip": "20001",
    "logo": "https://...",
    "website": "https://superiorscents.com",
    "taxId": "XX-XXXXXXX",
    "defaultTaxRate": 6.0,
    "invoicePrefix": "INV",
    "invoiceTerms": "Net 30",
    "invoiceNotes": "Thank you for your business!"
  }
}
```

---

### 10.2 Update Company Settings
```
PUT /settings/company
```

---

### 10.3 Get User Profile
```
GET /settings/profile
```

---

### 10.4 Update User Profile
```
PUT /settings/profile
```

---

### 10.5 Change Password
```
PUT /settings/password
```

**Request:**
```json
{
  "currentPassword": "oldpassword",
  "newPassword": "newpassword",
  "confirmPassword": "newpassword"
}
```

---

### 10.6 Notification Settings
```
GET /settings/notifications
PUT /settings/notifications
```

---

### 10.7 Appearance Settings
```
GET /settings/appearance
PUT /settings/appearance
```

---

## 11. File Upload APIs

### 11.1 Upload File
```
POST /uploads
```

**Request:** `multipart/form-data`
| Field | Type | Description |
|-------|------|-------------|
| file | File | The file to upload |
| type | string | `logo`, `avatar`, `document`, `import` |

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "file_123",
    "url": "https://storage.../file.jpg",
    "filename": "logo.jpg",
    "size": 25488,
    "mimeType": "image/jpeg"
  }
}
```

---

### 11.2 Delete File
```
DELETE /uploads/:id
```

---

## 12. Data Models

### User
```typescript
{
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'admin' | 'manager' | 'employee';
  avatar?: string;
  phone?: string;
  status: 'active' | 'inactive';
  permissions: string[];
  createdAt: Date;
  updatedAt: Date;
}
```

### Customer
```typescript
{
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  status: 'active' | 'inactive';
  balance: number;
  totalSpent: number;
  notes?: string;
  contacts: Contact[];
  createdAt: Date;
  updatedAt: Date;
}
```

### Employee
```typescript
{
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: string;
  department: string;
  status: 'active' | 'inactive';
  hireDate: Date;
  salary: number;
  commissionRate: number;
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
}
```

### Invoice
```typescript
{
  id: string;
  invoiceNumber: string;
  customerId: string;
  items: InvoiceItem[];
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  total: number;
  amountPaid: number;
  balance: number;
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
  issueDate: Date;
  dueDate: Date;
  notes?: string;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}
```

### Payment
```typescript
{
  id: string;
  transactionId: string;
  invoiceId: string;
  customerId: string;
  amount: number;
  method: 'credit_card' | 'bank_transfer' | 'cash' | 'check';
  methodDetails?: object;
  status: 'completed' | 'pending' | 'failed' | 'refunded';
  date: Date;
  notes?: string;
  createdBy: string;
  createdAt: Date;
}
```

### Service
```typescript
{
  id: string;
  name: string;
  type: 'service' | 'product';
  category: string;
  description: string;
  price: number;
  duration?: number;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

### InventoryItem
```typescript
{
  id: string;
  sku: string;
  name: string;
  category: 'diffuser' | 'scent' | 'accessory' | 'consumable';
  quantity: number;
  minStock: number;
  maxStock: number;
  unitPrice: number;
  costPrice: number;
  location: string;
  status: 'in-stock' | 'low-stock' | 'out-of-stock' | 'overstock';
  lastRestocked: Date;
  createdAt: Date;
  updatedAt: Date;
}
```

### ServicePeriod
```typescript
{
  id: string;
  customerId: string;
  frequency: 'Q1' | 'Q2' | 'Q3' | 'Q4' | 'EV' | 'DM' | 'SO';
  startDate: Date;
  endDate: Date;
  status: 'active' | 'inactive' | 'completed';
  services: ServiceDetail[];
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}
```

### Notification
```typescript
{
  id: string;
  userId: string;
  type: 'payment' | 'invoice' | 'customer' | 'system' | 'reminder';
  title: string;
  message: string;
  read: boolean;
  actionUrl?: string;
  createdAt: Date;
}
```

---

## 13. Error Handling

### Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| AUTH_INVALID_CREDENTIALS | 401 | Wrong email or password |
| AUTH_TOKEN_EXPIRED | 401 | JWT token has expired |
| AUTH_TOKEN_INVALID | 401 | Invalid JWT token |
| AUTH_UNAUTHORIZED | 403 | No permission for this action |
| VALIDATION_ERROR | 400 | Invalid request data |
| NOT_FOUND | 404 | Resource not found |
| DUPLICATE_ENTRY | 409 | Resource already exists |
| RATE_LIMIT_EXCEEDED | 429 | Too many requests |
| SERVER_ERROR | 500 | Internal server error |

### Error Response Format
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid request data",
    "details": [
      { "field": "email", "message": "Invalid email format" },
      { "field": "phone", "message": "Phone number is required" }
    ]
  }
}
```

---

## 14. Implementation Priority

### Phase 1: Core (Essential for Launch)
| Priority | API Group | Endpoints |
|----------|-----------|-----------|
| 1 | Authentication | Login, Logout, Me, Refresh Token |
| 2 | Customers | CRUD, List with pagination |
| 3 | Invoices | CRUD, List, PDF generation |
| 4 | Payments | CRUD, List |
| 5 | Dashboard | Basic stats |

### Phase 2: Extended Features
| Priority | API Group | Endpoints |
|----------|-----------|-----------|
| 6 | Employees | CRUD, List |
| 7 | Services | CRUD, List |
| 8 | Reports | Sales, Revenue, Customers |
| 9 | Settings | Company, Profile |
| 10 | Notifications | List, Mark read |

### Phase 3: Advanced Features
| Priority | API Group | Endpoints |
|----------|-----------|-----------|
| 11 | Customer Import/Export | Bulk operations |
| 12 | Employee Schedule | Calendar events |
| 13 | Service Periods | Full CRUD |
| 14 | Inventory | Stock management |
| 15 | Commission Report | Employee commissions |
| 16 | Custom Reports | Report builder |
| 17 | Email Integration | Send invoices |

---

## Summary

### Total API Endpoints: ~75

| Module | Endpoints |
|--------|-----------|
| Authentication | 7 |
| Customers | 11 |
| Employees | 7 |
| Invoices | 9 |
| Payments | 7 |
| Services & Inventory | 11 |
| Reports | 10 |
| Notifications | 6 |
| Settings | 7 |
| File Uploads | 2 |

### Recommended Tech Stack for Backend

| Component | Recommendation |
|-----------|----------------|
| Runtime | Node.js 20+ or Python 3.11+ |
| Framework | Express.js / NestJS / FastAPI / Django |
| Database | PostgreSQL (recommended) or MySQL |
| Cache | Redis |
| File Storage | AWS S3 / Cloudinary |
| Email | SendGrid / AWS SES |
| Authentication | JWT with refresh tokens |
| Hosting | AWS / DigitalOcean / Railway |

---

**Insha'Allah, this specification provides everything needed to build a robust backend!**

---

*Document prepared for Superior Scents DMV, LLC*  
*January 9, 2026*
