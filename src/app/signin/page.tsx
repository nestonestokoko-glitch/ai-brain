import type { Metadata } from 'next';
import AuthForm from '@/components/auth/AuthForm';

export const metadata: Metadata = {
  title: 'Sign in — Second Brain AI',
  description: 'Sign in to your Second Brain AI account.',
};

export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<{ redirect?: string }>;
}) {
  const { redirect } = await searchParams;

  return <AuthForm mode="signin" redirect={redirect ?? '/studio'} />;
}
