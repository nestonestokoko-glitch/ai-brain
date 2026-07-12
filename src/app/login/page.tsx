import { redirect } from 'next/navigation';
import AuthShell from '@/components/AuthShell';
import AuthForm from '@/components/AuthForm';
import { hasValidSessionCookie } from '@/lib/session';

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;
  if (await hasValidSessionCookie()) {
    redirect(next?.startsWith('/') ? next : '/studio');
  }

  return (
    <AuthShell
      title="Welcome back"
      subtitle="Sign in to pick up where you left off."
    >
      <AuthForm mode="signin" next={next ?? '/studio'} />
    </AuthShell>
  );
}
