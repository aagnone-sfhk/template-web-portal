'use server';

import { deleteItemById } from '@/lib/db';
import { revalidatePath } from 'next/cache';

export async function deleteItem(formData: FormData) {
  const id = Number(formData.get('id'));
  if (id && !isNaN(id)) {
    await deleteItemById(id);
    revalidatePath('/');
    revalidatePath('/items');
  }
}
