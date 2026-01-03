import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Mrror - Daily Accountability",
  description: "A simple accountability tool keeping you aligned",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
