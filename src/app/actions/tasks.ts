'use server';

import { revalidatePath } from 'next/cache';
import pool from '@/lib/db';
import { uploadFile, deleteFile } from '@/lib/storage';
import type { RowDataPacket, ResultSetHeader } from 'mysql2';

export async function createTask(formData: FormData) {
  const title = formData.get('title') as string;
  const description = formData.get('description') as string;
  const file = formData.get('file') as File | null;

  let filePath = null;
  let fileType = null;
  let fileName = null;

  if (file && file.size > 0) {
    const buffer = Buffer.from(await file.arrayBuffer());
    fileName = file.name;
    fileType = file.type;
    filePath = await uploadFile(buffer, fileName, fileType);
  }

  const query = `
    INSERT INTO tasks (title, description, file_path, file_type, file_name)
    VALUES (?, ?, ?, ?, ?)
  `;
  await pool.execute(query, [title, description, filePath, fileType, fileName]);

  revalidatePath('/');
}

export async function updateTask(id: number, formData: FormData) {
  const title = formData.get('title') as string;
  const description = formData.get('description') as string;

  const query = `
    UPDATE tasks
    SET title = ?, description = ?
    WHERE id = ?
  `;
  await pool.execute(query, [title, description, id]);

  revalidatePath('/');
}

export async function deleteTask(id: number) {
  // First get the task to find the file_path
  const [rows] = await pool.execute<RowDataPacket[]>('SELECT file_path FROM tasks WHERE id = ?', [id]);
  
  if (rows && rows.length > 0) {
    const task = rows[0];
    if (task.file_path) {
      await deleteFile(task.file_path);
    }
  }

  // Then delete from DB
  await pool.execute<ResultSetHeader>('DELETE FROM tasks WHERE id = ?', [id]);

  revalidatePath('/');
}
