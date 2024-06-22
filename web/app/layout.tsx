import { Inter } from "next/font/google";
import "./globals.css";
import Nav from "./components/navbar";
import Footer from "./components/footer";
import AuthProvider from "./context/AuthProvider";
import BtnScrollToTop from "./components/buttons/BtnScrollToTop";

const inter = Inter({ subsets: ["latin"] });

// get APP_NAME from env
const APP_NAME = process.env.APP_NAME;

export const metadata = {
  title: APP_NAME,
  description: "",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <Nav />
          <div className="bg-base-100">{children}</div>
          <Footer />
          <div className="fixed bottom-5 right-5">
            <BtnScrollToTop />
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
