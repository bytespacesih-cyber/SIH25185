import { AuthProvider } from "../context/AuthContext";
import LoadingScreen from "../components/LoadingScreen";
import "../styles/globals.css";
import "../styles/editor.css";
import { useState, useEffect } from "react";
import Script from 'next/script';

export default function MyApp({ Component, pageProps }) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate initial app loading
    const timer = setTimeout(() => {
      setLoading(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <>
      {/* Google Analytics - Measurement ID: G-DSVG4LRY6J */}
      <Script
        src="https://www.googletagmanager.com/gtag/js?id=G-DSVG4LRY6J"
        strategy="afterInteractive"
      />
      <Script id="gtag-init" strategy="afterInteractive">
        {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);} 
gtag('js', new Date());
gtag('config', 'G-DSVG4LRY6J', { page_path: window.location.pathname });`}
      </Script>
    <AuthProvider>
      <Component {...pageProps} />
    </AuthProvider>
    </>
  );
}