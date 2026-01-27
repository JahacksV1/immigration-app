# 🏆 ELITE ARCHITECTURAL STANDARDS
## Production-Grade Code Quality Enforcement

**Created:** 2026-01-27  
**Purpose:** Define exact standards every file must meet  
**Based On:** Industry best practices + Evidence from successful production codebases  
**Status:** PERMANENT REFERENCE - READ BEFORE ALL WORK

---

## 📚 DOCUMENT PURPOSE

This document defines **ELITE-LEVEL** standards for EVERY layer of the architecture.  
These are **MANDATORY** standards, not suggestions.

**Key Architectural Decision:**
- ❌ **NO Frontend Service Wrappers** - Industry standard is: Hook → Frontend API → Backend API
- ✅ **Hooks call Frontend APIs directly** - No service wrapper layer needed
- ✅ **Services ONLY exist in backend** (`lib/services/`)

---

## 🎯 THE 5-LAYER ARCHITECTURE (REFINED)

```
┌─── FRONTEND (Browser) ───┐
│                           │
│  [1] Component (Dumb UI)  │ ← Pure presentation, props only
│       ↓ uses              │
│  [2] Hook (Smart Logic)   │ ← State management, calls APIs
│       ↓ calls             │
│  [3] Frontend API (HTTP)  │ ← fetch() with auth headers
│                           │
└───────────────────────────┘
            ↓ HTTP
┌─── BACKEND (Server) ──────┐
│                           │
│  [4] Backend API (Auth)   │ ← Validation, logging
│       ↓ calls             │
│  [5] Backend Service      │ ← Pure business logic
│       ↓ queries           │
│  [∞] Database/External    │
│                           │
└───────────────────────────┘
```

**Key Principle:** Each layer has ONE responsibility. Never mix concerns.

---

## 📏 LAYER 1: COMPONENTS

### **Purpose**
Pure UI presentation - NO logic, NO state (except local UI state)

### **Elite Standards**

#### **1. Size Limits**
```typescript
// ✅ ELITE COMPONENT
- Maximum 150 lines (including imports and exports)
- Maximum 100 lines of actual JSX
- If larger → Split into smaller components
```

#### **2. Allowed Imports**
```typescript
// ✅ ALLOWED
import { Button } from '@/components/ui/Button';  // Other components
import { FormData } from '@/types';                // Types only
import { COUNTRIES } from '@/lib/constants';       // Constants only

// ❌ FORBIDDEN
import { useFormData } from '../hooks/useFormData';  // NO HOOKS
import { formService } from '../services';            // NO SERVICES
import { supabase } from '@/lib/supabase';           // NO LIB
```

#### **3. Props Standards**
```typescript
// ✅ ELITE - Fully typed interface
interface FormCardProps {
  formData: FormData;
  onEdit: (data: FormData) => void;
  onDelete: () => void;
  isLoading?: boolean;
}

export function FormCard({ formData, onEdit, onDelete, isLoading }: FormCardProps) {
  // Component logic
}

// ❌ BAD - No interface
export function FormCard(props: any) { ... }

// ❌ BAD - Inline types
export function FormCard({ formData, onEdit }: { formData: any, onEdit: Function }) { ... }
```

#### **4. State Standards**
```typescript
// ✅ ALLOWED - Local UI state only
const [isOpen, setIsOpen] = useState(false);
const [isHovered, setIsHovered] = useState(false);

// ❌ FORBIDDEN - Business logic state
const [forms, setForms] = useState([]);    // This belongs in hook
const [isLoading, setLoading] = useState(false);  // Pass as prop
```

#### **5. Component Structure** (MANDATORY)
```typescript
// ✅ ELITE STRUCTURE (Always this order)
import React from 'react';              // 1. React imports
import { Button } from '@/components/ui';  // 2. Component imports  
import { FormData } from '@/types/form';   // 3. Type imports
import { STATUS } from '@/lib/constants';  // 4. Constant imports

interface FormCardProps {               // 5. Props interface
  // ...
}

export function FormCard(props: FormCardProps) {  // 6. Component
  // 6a. Local UI state (if any)
  const [isHovered, setIsHovered] = useState(false);
  
  // 6b. Event handlers
  const handleClick = () => props.onEdit(props.formData);
  
  // 6c. Render
  return (
    <div>...</div>
  );
}

// 7. Named export only (no default export)
```

---

## 📏 LAYER 2: HOOKS

### **Purpose**
Smart business logic layer - Manages state, orchestrates API calls

### **Elite Standards**

#### **1. Size Limits**
```typescript
// ✅ ELITE HOOK
- Maximum 200 lines total
- If larger → Split into multiple hooks
- Each hook has ONE clear responsibility
```

#### **2. Single Responsibility**
```typescript
// ✅ ELITE - One clear purpose
export function useFormData(formId: string) {
  // Only form data fetching and management
}

export function useFormValidation(formData: FormData) {
  // Only validation logic
}

// ❌ BAD - Multiple responsibilities
export function useForm(formId: string) {
  // Fetching form
  // Validating input
  // Submitting data
  // Managing history
  // ... (500 lines of mixed concerns)
}
```

#### **3. Hook Structure** (MANDATORY)
```typescript
// ✅ ELITE HOOK TEMPLATE
import { useState, useEffect } from 'react';
import { formApi } from '../api/formApi';  // Frontend API
import type { FormData, FormError } from '../types/form';

interface UseFormReturn {
  form: FormData | null;
  loading: boolean;
  error: FormError | null;
  refetch: () => Promise<void>;
}

export function useForm(formId: string): UseFormReturn {
  // 1. State declarations
  const [form, setForm] = useState<FormData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<FormError | null>(null);
  
  // 2. Data fetching function
  const fetchForm = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await formApi.getForm(formId);  // ← Calls Frontend API
      setForm(data);
    } catch (err) {
      setError(err as FormError);
      logger.error('Failed to fetch form', { formId, error: err });
    } finally {
      setLoading(false);
    }
  };
  
  // 3. Effects
  useEffect(() => {
    if (formId) {
      fetchForm();
    }
  }, [formId]);
  
  // 4. Return object
  return {
    form,
    loading,
    error,
    refetch: fetchForm,
  };
}
```

#### **4. What Hooks CAN Do**
```typescript
✅ Call Frontend APIs
✅ Manage state (useState, useReducer)
✅ Side effects (useEffect, useCallback, useMemo)
✅ Call other hooks
✅ Use context
✅ Transform/format data
✅ Handle errors and loading states
```

#### **5. What Hooks CANNOT Do**
```typescript
❌ Import from lib/services (must use Frontend API)
❌ Call database directly
❌ Render JSX (that's for components)
❌ Have business logic that should be in backend services
❌ Be >200 lines (split it)
❌ Have multiple responsibilities
```

---

## 📏 LAYER 3: FRONTEND APIs

### **Purpose**
HTTP communication layer - Handles network requests

### **Elite Standards**

#### **1. Size Limits**
```typescript
// ✅ ELITE
- One file per resource (formsApi.ts, userApi.ts)
- Maximum 300 lines per file
- Each function: 10-30 lines max
```

#### **2. Perfect Frontend API Template**
```typescript
// api/formApi.ts
export const formApi = {
  /**
   * Fetches a single form by ID
   */
  async getForm(formId: string): Promise<FormData> {
    const response = await fetch(`/api/forms/${formId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'same-origin',
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    return response.json();
  },
  
  /**
   * Creates a new form
   */
  async createForm(data: CreateFormInput): Promise<FormData> {
    const response = await fetch('/api/forms', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'same-origin',
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    return response.json();
  },
};
```

#### **3. Mandatory Elements**
```typescript
✅ credentials: 'same-origin'
✅ HTTP error checking (if !response.ok throw)
✅ Typed return values
✅ JSDoc comments
✅ Consistent error messages
```

---

## 📏 LAYER 4: BACKEND APIs

### **Purpose**
Validation + Logging boundary

### **Elite Standards**

#### **1. Mandatory Structure** (EVERY backend API)
```typescript
// app/api/forms/[formId]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { logger } from '@/lib/logger';
import { getFormService } from '@/lib/services/formService';

// 1. ZOD VALIDATION SCHEMA (mandatory)
const querySchema = z.object({
  formId: z.string().uuid(),
});

// 2. HANDLER FUNCTION
export async function GET(
  req: NextRequest,
  { params }: { params: { formId: string } }
) {
  // 3. METHOD CHECK
  try {
    // 4. VALIDATION
    const parseResult = querySchema.safeParse({ formId: params.formId });
    if (!parseResult.success) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Invalid input',
          details: parseResult.error.flatten(),
        },
        { status: 400 }
      );
    }
    
    const { formId } = parseResult.data;
    
    // 5. LOGGING (start)
    logger.info('Fetching form', { formId });
    
    // 6. SERVICE CALL (only business logic)
    const result = await getFormService(formId);
    
    // 7. ERROR HANDLING
    if (!result.success) {
      logger.warn('Failed to fetch form', { formId, error: result.error });
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 400 }
      );
    }
    
    // 8. SUCCESS RESPONSE
    return NextResponse.json(
      { success: true, data: result.data },
      { status: 200 }
    );
    
  } catch (error: unknown) {
    // 9. UNEXPECTED ERROR
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    logger.error('Unexpected error fetching form', { 
      formId: params.formId, 
      error: errorMessage,
    });
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

#### **2. Mandatory Checklist**
```typescript
✅ ZOD validation schema
✅ Input validation
✅ logger.info at start
✅ Service call (NO direct DB queries)
✅ Error handling with logger.error
✅ Typed request/response
✅ HTTP status codes (200, 400, 403, 500)
✅ Consistent response format
```

---

## 📏 LAYER 5: BACKEND SERVICES

### **Purpose**
Pure business logic + external integrations

### **Elite Standards**

#### **1. Atomic Services (PRIMARY PATTERN)**
```typescript
// ✅ ELITE - ONE operation, ONE purpose
// lib/services/formService.ts
import { logger } from '@/lib/logger';
import type { ServiceResult, FormData } from '@/types';

export async function getFormService(
  formId: string
): Promise<ServiceResult<FormData>> {
  try {
    // Business logic here
    const form = await fetchFormFromStorage(formId);
    
    if (!form) {
      return { success: false, error: 'Form not found' };
    }
    
    return { success: true, data: form };
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    logger.error('Service error', { formId, error: errorMessage });
    return { success: false, error: errorMessage };
  }
}
```

#### **2. Size Limits (STRICT)**
```typescript
// Atomic Service: 30-80 lines max
// Complex Service: 80-200 lines max
// If >200 lines → Split into multiple services
```

#### **3. Mandatory Return Pattern**
```typescript
// ✅ ELITE - Always return ServiceResult
interface ServiceResult<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// Every service MUST return this pattern
export async function myService(...): Promise<ServiceResult<MyData>> {
  try {
    // ... logic
    return { success: true, data };
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return { success: false, error: errorMessage };
  }
}
```

---

## 🛡️ TYPE SAFETY STANDARDS (CRITICAL)

### **Why Type Safety Matters**

TypeScript without proper types = JavaScript with extra steps.

**Without Types (`any` everywhere):**
- ❌ No autocomplete in IDE
- ❌ Typos not caught until runtime
- ❌ Refactoring breaks things silently
- ❌ New developers can't understand code
- ❌ Bugs slip into production

**With Proper Types:**
- ✅ Full autocomplete support
- ✅ Typos caught at compile time
- ✅ Safe refactoring with confidence
- ✅ Types serve as documentation
- ✅ Catch bugs before they run

### **The Centralized Type Pattern (MANDATORY)**

**Rule:** Every module MUST have centralized type definitions.

```
project/
  ├── types/
  │   ├── form.ts      ← Form-related types
  │   ├── document.ts  ← Document types
  │   └── api.ts       ← API types
  ├── hooks/
  ├── components/
  └── lib/
```

### **Centralized Type File Template**

```typescript
/**
 * Form Type Definitions
 * 
 * Centralized, strongly-typed definitions for forms.
 * All hooks, components, and APIs import from here.
 */

// ============================================================================
// ENTITY TYPES (Core Data Models)
// ============================================================================

/**
 * Form data structure
 */
export interface FormData {
  id: string;
  created_at: string;
  updated_at: string;
  // ... other fields
}

// ============================================================================
// UI STATE TYPES (Component State)
// ============================================================================

/**
 * Form loading states
 */
export type FormStatus = 'idle' | 'loading' | 'success' | 'error';

// ============================================================================
// SERVICE RETURN TYPES
// ============================================================================

/**
 * Standard service result wrapper
 */
export interface ServiceResult<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// ============================================================================
// TYPE GUARDS (Runtime Validation)
// ============================================================================

/**
 * Type guard for FormData
 */
export function isFormData(data: unknown): data is FormData {
  return (
    typeof data === 'object' &&
    data !== null &&
    'id' in data &&
    typeof (data as FormData).id === 'string'
  );
}
```

### **NO `any` Types Policy**

```typescript
// ❌ FORBIDDEN
function processData(data: any) { ... }
const result: any = await fetch();

// ✅ ELITE
function processData(data: FormData) { ... }
const result: FormResponse = await fetch();

// ✅ If truly dynamic, use unknown + type guard
function processJSON(data: unknown): FormData {
  if (isFormData(data)) {
    return data;
  }
  throw new Error('Invalid data shape');
}
```

### **Explicit Return Types**

```typescript
// ✅ ELITE
export async function getForm(id: string): Promise<FormData> {
  // ...
}

// ❌ BAD - Inferred return type
export async function getForm(id: string) {
  // TypeScript infers, but not explicit
}
```

---

## 📊 CROSS-CUTTING STANDARDS

### **Logging Standards**

#### **1. NO console.log**
```typescript
// ❌ FORBIDDEN
console.log('Fetching form', formId);
console.error('Error:', error);

// ✅ ELITE
import { logger } from '@/lib/logger';

logger.info('Fetching form', { formId });
logger.error('Failed to fetch form', { formId, error: error.message });
```

#### **2. Structured Logging**
```typescript
// ✅ ELITE - Always include context
logger.info('Operation started', {
  operation: 'createForm',
  formId,
  timestamp: new Date().toISOString(),
});

logger.error('Operation failed', {
  operation: 'createForm',
  formId,
  error: error.message,
  stack: error.stack,
});
```

### **Error Handling Standards**

```typescript
// ✅ ELITE - Try-catch everything async
async function fetchData() {
  try {
    const data = await api.getData();
    return { success: true, data };
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    logger.error('Failed to fetch', { error: errorMessage });
    return { success: false, error: errorMessage };
  }
}

// ❌ BAD - No try-catch
async function fetchData() {
  const data = await api.getData();  // Can throw!
  return data;
}
```

### **Import Standards**

```typescript
// ✅ ELITE - Proper import order
// 1. React imports
import React, { useState, useEffect } from 'react';

// 2. External library imports
import { z } from 'zod';

// 3. Internal absolute imports (@/)
import { Button } from '@/components/ui';
import { FormData } from '@/types/form';

// 4. Relative imports
import { useForm } from '../hooks/useForm';

// 5. Type imports (separate)
import type { NextRequest, NextResponse } from 'next';
```

### **File Naming Standards**

```typescript
// Components: PascalCase
FormCard.tsx
UserProfile.tsx

// Hooks: camelCase starting with 'use'
useForm.ts
useProfile.ts

// Services: camelCase ending with 'Service'
getFormService.ts
createUserService.ts

// APIs: camelCase ending with 'Api'
formApi.ts
profileApi.ts

// Types: camelCase
form.ts
document.ts
api.ts
```

---

## 💀 THE EMBARRASSMENT TEST

Before committing any code, ask:

> **"Would a professional developer at Google/Netflix/Airbnb be embarrassed to ship this?"**

### Embarrassing Issues:

❌ Button changes state 3 times when clicked  
❌ Page blocks when saving  
❌ Component has race conditions  
❌ State gets stuck in loading  
❌ No error handling  
❌ `any` types everywhere  
❌ No logging  
❌ 500-line component file  

### Professional Quality:

✅ Clean separation of concerns  
✅ Proper type safety  
✅ Comprehensive error handling  
✅ Structured logging  
✅ Single responsibility per file  
✅ Code is self-documenting  
✅ Easy to test  
✅ Easy to maintain  

---

## 📊 COMPLEXITY METRICS

### **Maximum Lines of Code**

| Layer | Max Lines | Reason |
|-------|-----------|--------|
| Component | 150 | Should be atomic, composable |
| Hook | 200 | Single responsibility |
| Frontend API file | 300 | One resource per file |
| Frontend API function | 30 | Simple HTTP wrapper |
| Backend API | 150 | Thin validation layer |
| Backend Service (atomic) | 80 | One operation |
| Backend Service (complex) | 200 | Orchestration only |

---

## ✅ COMPLIANCE CHECKLIST

Use this for EVERY file you create or audit:

### **Components**
- [ ] <150 lines total
- [ ] Props fully typed with interface (no `any`)
- [ ] No hooks imported (except useState for local UI)
- [ ] No lib/ imports
- [ ] Named export (not default)
- [ ] JSDoc comment explaining purpose
- [ ] No `any` types in props or state

### **Hooks**
- [ ] <200 lines total
- [ ] Explicit return type interface
- [ ] All parameters typed (no `any`)
- [ ] Calls Frontend API (not lib/)
- [ ] Try-catch on all async
- [ ] Uses logger (not console.log)
- [ ] Single responsibility

### **Frontend APIs**
- [ ] credentials: 'same-origin'
- [ ] Checks !response.ok
- [ ] Typed return values
- [ ] <30 lines per function
- [ ] JSDoc comments

### **Backend APIs**
- [ ] ZOD validation schema
- [ ] Input validation
- [ ] logger.info/error calls
- [ ] Calls service (no direct operations)
- [ ] <150 lines total
- [ ] Typed request/response

### **Backend Services**
- [ ] ServiceResult return type
- [ ] Try-catch with error handling
- [ ] <80 lines (atomic) or <200 (complex)
- [ ] Proper logging
- [ ] Type safety

---

## 🎯 THE GOLDEN RULES

1. **Separation of Concerns**: Each layer has ONE job. Never mix.
2. **Type Safety First**: No `any` types. Ever.
3. **Error Handling**: Every async operation wrapped in try-catch.
4. **Logging**: Use structured logger, never console.log.
5. **Size Limits**: Keep files small and focused.
6. **Single Responsibility**: One file, one purpose.
7. **The Embarrassment Test**: Would a pro be proud of this?

---

**Last Updated:** 2026-01-27  
**Status:** PERMANENT REFERENCE - READ BEFORE ALL WORK  
**Author:** Elite Development Standards  
**Purpose:** Maintain production-grade code quality
