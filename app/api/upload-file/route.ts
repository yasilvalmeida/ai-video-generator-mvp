import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { writeFile } from 'fs/promises';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Validate file type
    const allowedTypes = [
      'video/mp4',
      'video/quicktime',
      'video/webm',
      'video/avi',
    ];

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        {
          error:
            'Invalid file type. Only MP4, MOV, WebM, and AVI files are supported',
        },
        { status: 400 }
      );
    }

    // Validate file size (100MB max)
    const maxSize = 100 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File size must be less than 100MB' },
        { status: 400 }
      );
    }

    // Generate unique filename
    const id = `file_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const fileName = `${id}_${file.name}`;
    const filePath = path.join('/tmp', fileName);

    // Convert File to Buffer and save to server
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    await writeFile(filePath, buffer);

    // Create a file:// URL that the backend can access
    const url = `file://${filePath}`;

    // Return the file URL
    return NextResponse.json({
      success: true,
      fileUrl: url,
      fileName: fileName,
      fileSize: file.size,
    });
  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json(
      {
        error: 'Failed to upload file',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
