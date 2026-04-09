import { StoredDocument } from '../types/document';
import { logger } from '../lib/logger';

declare global {
  // eslint-disable-next-line no-var
  var documentStore: Map<string, StoredDocument> | undefined;
}

const documentStore = global.documentStore ?? new Map<string, StoredDocument>();

if (process.env.NODE_ENV !== 'production') {
  global.documentStore = documentStore;
}

const DOCUMENT_TTL_MS = 24 * 60 * 60 * 1000;

interface StorageResult<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}

export function generateDocumentId(): string {
  return `doc_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
}

export function storeDocument(documentId: string, document: StoredDocument): StorageResult<string> {
  try {
    documentStore.set(documentId, { ...document, generatedAt: new Date().toISOString() });
    setTimeout(() => {
      documentStore.delete(documentId);
      logger.info('Document expired and removed', { documentId });
    }, DOCUMENT_TTL_MS);
    logger.info('Document stored', { documentId });
    return { success: true, data: documentId };
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    logger.error('Failed to store document', { documentId, error: errorMessage });
    return { success: false, error: errorMessage };
  }
}

export function getDocument(documentId: string): StorageResult<StoredDocument> {
  try {
    const document = documentStore.get(documentId);
    if (!document) {
      logger.warn('Document not found', { documentId });
      return { success: false, error: 'Document not found or expired' };
    }
    logger.info('Document retrieved', { documentId });
    return { success: true, data: document };
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    logger.error('Failed to retrieve document', { documentId, error: errorMessage });
    return { success: false, error: errorMessage };
  }
}

export function markDocumentAsPaid(documentId: string): StorageResult<void> {
  try {
    const document = documentStore.get(documentId);
    if (!document) {
      return { success: false, error: 'Document not found' };
    }
    document.isPaid = true;
    documentStore.set(documentId, document);
    logger.info('Document marked as paid', { documentId });
    return { success: true };
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    logger.error('Failed to mark document as paid', { documentId, error: errorMessage });
    return { success: false, error: errorMessage };
  }
}

export function deleteDocument(documentId: string): StorageResult<void> {
  try {
    const existed = documentStore.delete(documentId);
    if (!existed) {
      return { success: false, error: 'Document not found' };
    }
    logger.info('Document deleted', { documentId });
    return { success: true };
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    logger.error('Failed to delete document', { documentId, error: errorMessage });
    return { success: false, error: errorMessage };
  }
}
