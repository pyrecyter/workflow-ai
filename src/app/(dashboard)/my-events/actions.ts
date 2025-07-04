
'use server';

import { revalidatePath } from 'next/cache';

export async function revalidateMyEvents() {
  revalidatePath('/dashboard/my-events');
}
