import { redirect } from 'next/navigation';
import AuthShell from '@/components/AuthShell';
import AuthForm from '@/components/AuthForm';
import { hasValidSessionCookie } from '@/lib/session';

export default async function SignupPage({
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
      title="Create your account"
      subtitle="Start building your second brain in minutes."
    >
      <AuthForm mode="signup" next={next ?? '/studio'} />
    </AuthShell>
  );
}
