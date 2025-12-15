'use server';

import { 
  deleteItemById, 
  getTableSchema,
  getTableNames,
  dynamicInsert,
  dynamicUpdate,
} from '@/lib/db';
import { revalidatePath } from 'next/cache';

export async function deleteItem(formData: FormData) {
  const id = Number(formData.get('id'));
  if (id && !isNaN(id)) {
    await deleteItemById(id);
    revalidatePath('/');
    revalidatePath('/items');
  }
}

// Generic create action for any table
export async function createRecordAction(tableName: string, data: Record<string, unknown>) {
  try {
    const record = await dynamicInsert(tableName, data);
    revalidatePath('/');
    revalidatePath(`/${tableName}`);
    return { success: true, record };
  } catch (error) {
    console.error(`Create ${tableName} error:`, error);
    return { success: false, error: error instanceof Error ? error.message : `Failed to create ${tableName}` };
  }
}

// Generic update action for any table
export async function updateRecordAction(tableName: string, id: number, data: Record<string, unknown>) {
  try {
    const record = await dynamicUpdate(tableName, id, data);
    revalidatePath('/');
    revalidatePath(`/${tableName}`);
    return { success: true, record };
  } catch (error) {
    console.error(`Update ${tableName} error:`, error);
    return { success: false, error: error instanceof Error ? error.message : `Failed to update ${tableName}` };
  }
}

// Generic delete action for any table
export async function deleteRecordAction(tableName: string, id: number) {
  try {
    // For now, use the existing deleteItemById for items table
    // This can be expanded to a generic delete later
    if (tableName === 'items') {
      await deleteItemById(id);
    } else {
      // Dynamic delete would go here
      throw new Error(`Delete not implemented for table: ${tableName}`);
    }
    revalidatePath('/');
    revalidatePath(`/${tableName}`);
    return { success: true };
  } catch (error) {
    console.error(`Delete ${tableName} error:`, error);
    return { success: false, error: error instanceof Error ? error.message : `Failed to delete ${tableName}` };
  }
}

export async function fetchTableSchema(tableName: string) {
  try {
    const schema = await getTableSchema(tableName);
    return { success: true, schema };
  } catch (error) {
    console.error('Fetch schema error:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Failed to fetch schema' };
  }
}

export async function fetchTableNames() {
  try {
    const tables = await getTableNames();
    return { success: true, tables };
  } catch (error) {
    console.error('Fetch tables error:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Failed to fetch tables' };
  }
}
