
'use server';

import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';

export async function login(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/login` , {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  if (res.ok) {
    const { token } = await res.json();
    cookies().set('token', token);
    redirect('/dashboard');
  } else {
    const { message } = await res.json();
    redirect(`/login?error=${message}`);
  }
}
