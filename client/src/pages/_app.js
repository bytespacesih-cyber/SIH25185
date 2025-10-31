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
      {/* Google Analytics - Measurement ID: G-9RT2VW4QSM */}
      <Script
        src="https://www.googletagmanager.com/gtag/js?id=G-9RT2VW4QSM"
        strategy="afterInteractive"
      />
      <Script id="gtag-init" strategy="afterInteractive">
        {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);} 
gtag('js', new Date());
gtag('config', 'G-9RT2VW4QSM', { page_path: window.location.pathname });`}
      </Script>
    <AuthProvider>
      <Component {...pageProps} />
    </AuthProvider>
    </>
  );
}