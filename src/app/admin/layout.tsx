import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

const ADMIN_SESSION_TOKEN =
  process.env.ADMIN_SESSION_TOKEN || 'rektgistry-admin-2025';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const session = cookieStore.get('admin_session')?.value;

  if (session !== ADMIN_SESSION_TOKEN) {
    redirect('/admin/login');
  }

  return (
    <html lang="en">
      <body
        style={{
          background: '#0b0c10',
          color: '#e2e8f0',
          fontFamily: "'Orbitron', sans-serif",
          minHeight: '100vh',
          margin: 0,
        }}
      >
        {children}
      </body>
    </html>
  );
}
