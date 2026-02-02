# Backend Architecture

Production-grade backend infrastructure for immigration letter SaaS.

---

## 🏗️ Architecture Overview

```
Frontend (User) → API Routes → Services → AI/Storage/PDF
```

### **Layers:**

1. **API Routes** (`app/api/`)
   - Request validation (Zod)
   - Error handling
   - Logging
   - Response formatting

2. **Services** (`lib/services/`)
   - AI generation
   - Document storage
   - PDF generation

3. **Utilities** (`lib/`)
   - API helpers
   - Validation schemas
   - Logger

---

## 📁 File Structure

```
app/api/
├── generate/
│   └── route.ts              # POST - Generate letter via AI
├── stripe/
│   ├── create-checkout/
│   │   └── route.ts          # POST - Create checkout session
│   └── webhook/
│       └── route.ts          # POST - Handle payment webhook (TODO)
└── download/
    └── route.ts              # GET - Download PDF

lib/
├── services/
│   ├── ai-service.ts         # AI letter generation (OpenAI/Claude)
│   ├── storage-service.ts    # Temporary document storage
│   └── pdf-service.ts        # PDF generation
├── api-helpers.ts            # Response helpers + error handling
├── validation.ts             # Zod schemas
└── logger.ts                 # Structured logging (already exists)
```

---

## 🔌 API Endpoints

### **POST /api/generate**

Generate immigration letter from form data.

**Request:**
```json
{
  "formData": {
    "aboutYou": { "fullName": "...", ... },
    "applicationContext": { ... },
    "explanation": { ... },
    "tone": "neutral",
    "emphasis": "..."
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "documentId": "doc_1234...",
    "document": {
      "sections": [...],
      "rawText": "...",
      "generatedAt": "2026-01-26T..."
    }
  }
}
```

**Flow:**
1. Validate form data (Zod)
2. Generate letter via AI (OpenAI/Claude)
3. Store document temporarily (in-memory)
4. Return document + documentId

---

### **POST /api/stripe/create-checkout**

Create Stripe checkout session for document purchase.

**Request:**
```json
{
  "documentId": "doc_1234..."
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "sessionId": "cs_test_...",
    "url": "https://checkout.stripe.com/..."
  }
}
```

**Flow:**
1. Validate documentId
2. Verify document exists and not already paid
3. Create Stripe checkout session
4. Return session URL

---

### **GET /api/download?documentId=xxx**

Download letter as PDF.

**Response:** PDF file download

**Flow:**
1. Get documentId from query params
2. Verify document exists and is paid
3. Generate PDF
4. Return as file download

---

## 🧩 Services

### **AI Service** (`lib/services/ai-service.ts`)

**Purpose:** Generate immigration letter via AI

**Functions:**
- `generateLetter(formData)` - Main entry point
- `buildPrompt(formData)` - Build AI prompt
- `callOpenAI(prompt)` - Call OpenAI API
- `callAnthropic(prompt)` - Call Claude API
- `parseLetterSections(text)` - Parse into sections

**AI Fallback Strategy:**
1. Try Claude (Anthropic) first
2. If fails → fallback to OpenAI GPT-4
3. Log which provider was used

**Key Features:**
- Structured prompt building
- Tone customization (formal/neutral/personal)
- Section parsing
- Error handling with fallback

---

### **Storage Service** (`lib/services/storage-service.ts`)

**Purpose:** Temporary document storage

**Storage Type:** In-memory Map (MVP) + localStorage (Primary)
- ✅ Simple, fast, no dependencies
- ✅ Auto-cleanup after 24 hours
- ❌ Lost on server restart
- ❌ **CRITICAL:** Not compatible with Vercel serverless (each request = different server)
- ✅ **Solution:** localStorage as primary source, server storage as best effort
- **Future:** Replace with Vercel KV, Redis, or Supabase for multi-device support

**Functions:**
- `generateDocumentId()` - Generate unique ID
- `storeDocument(id, doc)` - Store document
- `getDocument(id)` - Retrieve document
- `markDocumentAsPaid(id)` - Mark as paid
- `deleteDocument(id)` - Remove document

**TTL:** 24 hours (auto-cleanup)

---

### **PDF Service** (`lib/services/pdf-service.ts`)

**Purpose:** Generate PDF from document

**Current Status:** Placeholder (returns text)

**TODO:**
- Implement actual PDF generation using:
  - **Option 1:** `jsPDF` (client-side friendly)
  - **Option 2:** `PDFKit` (server-side, more control)
  - **Option 3:** Puppeteer (render HTML to PDF)

**Functions:**
- `generatePDF(document)` - Generate PDF buffer
- `generatePdfFilename(name)` - Create filename

---

## 🛡️ Error Handling

### **API Error Response Format**

```typescript
{
  "success": false,
  "error": "Human-readable error message",
  "code": "ERROR_CODE" // Optional
}
```

### **Error Codes**

- `VALIDATION_ERROR` - Invalid input (400)
- `DOCUMENT_NOT_FOUND` - Document not found (404)
- `ALREADY_PAID` - Document already purchased (400)
- `PAYMENT_REQUIRED` - Payment not completed (402)
- `GENERATION_ERROR` - AI generation failed (500)
- `STORAGE_ERROR` - Storage failed (500)
- `PDF_GENERATION_ERROR` - PDF generation failed (500)

### **Error Handling Pattern**

All API routes use `withErrorHandling()` wrapper:

```typescript
export async function POST(req: NextRequest) {
  return withErrorHandling(async () => {
    // Your logic here
  }, 'POST /api/generate');
}
```

**Benefits:**
- Automatic try-catch
- Structured logging
- Consistent error responses
- No unhandled promise rejections

---

## 📊 Logging

### **Logger Usage** (`lib/logger.ts`)

**✅ ALWAYS use logger, NEVER use console.log**

```typescript
import { logger } from '@/lib/logger';

// Info - normal operations
logger.info('Letter generated', {
  documentId: 'doc_123',
  applicant: 'John Doe',
});

// Warn - recoverable issues
logger.warn('Claude failed, falling back to OpenAI', {
  error: error.message,
});

// Error - failures
logger.error('Generation failed', {
  error: error.message,
  stack: error.stack,
});
```

**Log Levels:**
- `info` - Normal operations
- `warn` - Recoverable issues
- `error` - Failures
- `debug` - Development debugging

**Structured Context:**
Always include relevant context (documentId, userId, etc.)

---

## ✅ Validation (Zod)

### **Schemas** (`lib/validation.ts`)

All API inputs are validated with Zod:

```typescript
import { formDataSchema } from '@/lib/validation';

const validation = formDataSchema.safeParse(body);
if (!validation.success) {
  return apiError('Invalid input', 400, 'VALIDATION_ERROR');
}

const { formData } = validation.data; // Typed!
```

**Schemas:**
- `formDataSchema` - Full form data
- `generateLetterSchema` - Generate request
- `createCheckoutSchema` - Checkout request

---

## 🚀 Flow: User Journey

### **1. Fill Form** (`/start`)
- User fills multi-step form
- Auto-saves to localStorage
- Client-side validation

### **2. Generate Letter** (Submit form)
```
User clicks "Generate Letter"
  → POST /api/generate
  → AI Service generates letter
  → Storage Service stores document
  → Returns documentId + preview
  → Redirect to /preview
```

### **3. Preview** (`/preview`)
- Show blurred document
- "Unlock for $49" CTA

### **4. Payment** (Click unlock)
```
User clicks "Unlock"
  → POST /api/stripe/create-checkout
  → Stripe Checkout Session created
  → Redirect to Stripe
  → User pays
  → Stripe redirects to /editor?session_id=xxx&documentId=yyy
  → Editor loads document from localStorage ✅
  → Editor marks as paid in localStorage ✅
  → Editor marks as paid on server (best effort)
  → Stripe webhook runs (async, marks as paid on server)
```

### **5. Edit & Download** (`/editor`)
- Show full document
- Editable textarea
- Download as PDF

---

## 🔐 Security

### **Current:**
- ✅ Input validation (Zod)
- ✅ Structured error handling
- ✅ No sensitive data in responses
- ✅ TypeScript strict mode

### **TODO (Production):**
- [ ] Rate limiting (prevent abuse)
- [ ] CORS configuration
- [ ] API key rotation
- [ ] Stripe webhook signature verification
- [ ] Sanitize AI outputs (prevent injection)
- [ ] HTTPS enforcement (Vercel handles)

---

## 📋 TODO: Next Steps

### **Phase 1: Complete Payment Flow**
- [ ] Implement real Stripe checkout session
- [ ] Add Stripe webhook handler
- [ ] Store payment confirmations
- [ ] Add receipt/confirmation email

### **Phase 2: Real PDF Generation**
- [ ] Implement PDF library (jsPDF or PDFKit)
- [ ] Format letter properly (header, footer, spacing)
- [ ] Add branding (logo, contact info)

### **Phase 3: Persistence**
- [ ] Replace in-memory storage with Redis or DB
- [ ] Store documents in database
- [ ] Add user accounts (optional)
- [ ] Email delivery of purchased letters

### **Phase 4: Monitoring**
- [ ] Add Sentry for error tracking
- [ ] Add analytics (document generation rate)
- [ ] Add performance monitoring
- [ ] Add Stripe revenue tracking

---

## 🧪 Testing Strategy

### **API Routes:**
- Unit tests for validation schemas
- Integration tests for API routes
- Mock AI/Stripe services

### **Services:**
- Unit tests for each service
- Mock external APIs (OpenAI, Stripe)
- Test error handling

### **E2E:**
- Full user journey test (form → generate → pay → download)
- Test localStorage persistence
- Test payment flow (Stripe test mode)

---

## 🎯 Standards Checklist

For every backend file:

**API Routes:**
- [ ] Uses `withErrorHandling()` wrapper
- [ ] Validates input with Zod
- [ ] Uses `apiSuccess()` / `apiError()`
- [ ] Logs with `logger` (no console.log)
- [ ] Typed request/response
- [ ] Error codes for failures

**Services:**
- [ ] Single responsibility
- [ ] Returns `{ success, data?, error? }`
- [ ] Try-catch with logging
- [ ] No console.log
- [ ] Typed inputs/outputs
- [ ] <200 lines

**Utilities:**
- [ ] Pure functions
- [ ] Well-documented
- [ ] Typed
- [ ] No side effects

---

**Status:** Backend foundation complete. Ready for Stripe + PDF implementation.
