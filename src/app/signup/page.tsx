import type { Metadata } from 'next';
import AuthForm from '@/components/auth/AuthForm';

export const metadata: Metadata = {
  title: 'Sign up — Second Brain AI',
  description: 'Create your Second Brain AI account.',
};

export default async function SignUpPage({
  searchParams,
}: {
  searchParams: Promise<{ redirect?: string }>;
}) {
  const { redirect } = await searchParams;

  return <AuthForm mode="signup" redirect={redirect ?? '/studio'} />;
}
