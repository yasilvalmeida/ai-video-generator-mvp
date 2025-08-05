import fs from 'fs';
import path from 'path';
import { writeFile } from 'fs/promises';

export interface StoredFile {
  id: string;
  name: string;
  url: string;
  size: number;
  type: string;
  uploadedAt: Date;
}

// In-memory storage for MVP (replace with cloud storage in production)
const fileStorage = new Map<string, StoredFile>();

export async function uploadFile(file: File): Promise<StoredFile> {
  const id = generateFileId();
  const url = await createObjectURL(file);

  const storedFile: StoredFile = {
    id,
    name: file.name,
    url,
    size: file.size,
    type: file.type,
    uploadedAt: new Date(),
  };

  fileStorage.set(id, storedFile);
  return storedFile;
}

export async function getFile(id: string): Promise<StoredFile | null> {
  return fileStorage.get(id) || null;
}

export async function deleteFile(id: string): Promise<boolean> {
  const file = fileStorage.get(id);
  if (file) {
    URL.revokeObjectURL(file.url);
    fileStorage.delete(id);
    return true;
  }
  return false;
}

export function validateFile(file: File): { valid: boolean; error?: string } {
  const maxSize = 100 * 1024 * 1024; // 100MB
  const allowedTypes = [
    'video/mp4',
    'video/quicktime',
    'video/webm',
    'video/avi',
  ];

  if (file.size > maxSize) {
    return { valid: false, error: 'File size must be less than 100MB' };
  }

  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: 'Only MP4, MOV, WebM, and AVI files are supported',
    };
  }

  return { valid: true };
}

function generateFileId(): string {
  return `file_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

async function createObjectURL(file: File): Promise<string> {
  return URL.createObjectURL(file);
}

// Cleanup function to prevent memory leaks
export function cleanupStorage() {
  fileStorage.forEach((file) => {
    URL.revokeObjectURL(file.url);
  });
  fileStorage.clear();
}
