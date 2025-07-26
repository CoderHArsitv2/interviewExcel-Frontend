// app/student/(auth)/layout.tsx or app/layout.tsx
import { GoogleOAuthProvider } from '@react-oauth/google';

export default function StudentAuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!}>
      {children}
    </GoogleOAuthProvider>
  );
}
