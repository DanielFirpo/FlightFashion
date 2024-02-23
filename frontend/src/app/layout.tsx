import type { Metadata } from "next";
import { Alumni_Sans, DM_Sans } from "next/font/google";
import "@/src/app/globals.css";
import Navbar from "@/src/app/_components/navbar/Navbar";
import Footer from "./_components/footer/Footer";
import AuthProvider from "./_providers/AuthProvider";
import AuthenticationDialog from "@/src/app/_components/auth/AuthenticationDialogs";
import { Toaster } from "@/src/app/_components/shadcn/toaster";

const dmSans = DM_Sans({
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
  variable: "--font-dm-sans",
  subsets: ["latin"],
});

const alumniSans = Alumni_Sans({
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
  variable: "--font-alumni-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Flight Fashion",
  description: "We'll get you looking fly",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${dmSans.variable} ${alumniSans.variable} bg-imageBackground`}>
      <body>
        <div className="mx-auto min-h-screen max-w-[1366px] items-center bg-backgroundGray px-10 pb-10 pt-5 font-dmSans">
          <AuthProvider>
            <Toaster />
            <AuthenticationDialog></AuthenticationDialog>
            <Navbar></Navbar>
            <div className="min-h-96">{children}</div>
            <Footer></Footer>
          </AuthProvider>
        </div>
      </body>
    </html>
  );
}
