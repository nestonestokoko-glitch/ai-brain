import type { Metadata } from 'next';
import AuthCard from '@/components/auth/AuthCard';

export const metadata: Metadata = {
  title: 'Sign in — Second Brain AI',
  description: 'Sign in or create your Second Brain AI account.',
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ redirect?: string }>;
}) {
  const { redirect } = await searchParams;

  return <AuthCard redirect={redirect ?? '/studio'} />;
}
