import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "./utils/AuthContext";
import { BackgroundProvider } from "./utils/BackgroundContext";
import BackgroundWrapper from "./components/BackgroundWrapper";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "AGA",
  description: "Advance Guidance Assistant",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          <BackgroundProvider>
            <BackgroundWrapper>
              {children}
            </BackgroundWrapper>
          </BackgroundProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
