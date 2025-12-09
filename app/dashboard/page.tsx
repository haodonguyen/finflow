import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import DashboardClient from './DashboardClient/DashboardClient';

export default async function DashboardPage() {
  const user = await getCurrentUser();

  // If not logged in, redirect to login
  if (!user) {
    redirect('/login');
  }

  return <DashboardClient user={user} />;
}