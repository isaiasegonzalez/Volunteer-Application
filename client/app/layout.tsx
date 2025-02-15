import type { Metadata } from "next";
import "./globals.css";

// Define or import geistSans and geistMono
const geistSans = { variable: "geist-sans" };
const geistMono = { variable: "geist-mono" };

// ✅ Server Component: Define metadata here
export const metadata: Metadata = {
  title: "Vola",
  description:
    "Connect with volunteer opportunities that match your skills and availability",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-pinkish`}
      >
        {children}
      </body>
    </html>
  );
}
