
'use server';

import { revalidatePath } from 'next/cache';

export async function revalidateEvents() {
  revalidatePath('/');
  revalidatePath('/dashboard');
  revalidatePath('/my-events');
}
