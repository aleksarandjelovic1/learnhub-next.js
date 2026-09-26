import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "LearnHub - Learn something new",
  description: "LearnHub is modern platform for learing NextJS and other modern technologies.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body className="layout">

        <Header></Header>

        <main className="layout-main">
          {children}
        </main>

        <Footer />

      </body>
    </html>
  );
}
