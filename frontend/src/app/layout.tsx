import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "GatiSathi - Fast & Safety First",
  description: "Full-stack BlaBlaCar clone with a dual-mode (Bike/Car) architecture.",
};

import { VehicleProvider } from "@/context/VehicleContext";
import { UserProvider } from "@/context/UserContext";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} antialiased`}>
        <UserProvider>
          <VehicleProvider>
            {children}
          </VehicleProvider>
        </UserProvider>
      </body>
    </html>
  );
}
