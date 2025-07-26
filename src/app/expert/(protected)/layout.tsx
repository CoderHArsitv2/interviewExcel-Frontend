'use client';

import { GoogleOAuthProvider } from '@react-oauth/google';
import { AuthProvider } from '@/providers/authProvider'; 

export default function StudentProtectedLayout({ children }: { children: React.ReactNode }) {
  return (
    <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!}>
      <AuthProvider userRole="expert">
        {children}
      </AuthProvider>
    </GoogleOAuthProvider>
  );
}
