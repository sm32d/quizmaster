import { Inter } from "next/font/google";
import "./globals.css";
import Nav from "./components/navbar";
import Footer from "./components/footer";
import AuthProvider from "./context/AuthProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "QuizMaster",
  description: "",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <Nav />
          <div className="bg-base-100">
          {children}
          </div>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}