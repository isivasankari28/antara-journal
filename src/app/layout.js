import { Playfair_Display, Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { PageTransition } from "@/components/ui/PageTransition";
import { ThemeProvider } from "@/components/layout/ThemeController";
import LayoutWrapper from "@/components/layout/LayoutWrapper";
import { AmbientPlayer } from "@/components/ui/AmbientPlayer";
import { LockScreen } from "@/components/auth/LockScreen";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Antara Journal",
  description: "A sanctuary for your thoughts.",
  manifest: "/manifest.json",
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
  },
  themeColor: "#E0E8E3",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${playfair.variable} ${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <ThemeProvider>
          <LayoutWrapper className="flex min-h-screen">
            <LockScreen>
              <AppSidebar />
              <main className="flex-1 p-6 md:p-12 overflow-y-auto h-screen bg-transparent">
                <PageTransition>
                  {children}
                </PageTransition>
              </main>
              <AmbientPlayer />
            </LockScreen>
          </LayoutWrapper>
        </ThemeProvider>
      </body>
    </html>
  );
}
