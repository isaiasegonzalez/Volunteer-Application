import type { Metadata } from "next";
import "./globals.css";

// ✅ Server Component: Define metadata here
export const metadata: Metadata = {
  title: "Vola - Volunteering Made Easy",
  description: "Connect with volunteer opportunities that match your skills and availability",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
