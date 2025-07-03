'use server';

import { redirect } from 'next/navigation';

export async function register(formData: FormData) {
  const firstName = formData.get('firstName') as string;
  const lastName = formData.get('lastName') as string;
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ firstName, lastName, email, password }),
  });

  if (res.ok) {
    redirect('/login');
  } else {
    const { message } = await res.json();
    redirect(`/register?error=${message}&firstName=${firstName}&lastName=${lastName}&email=${email}`);
  }
}