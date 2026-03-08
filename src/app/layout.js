import './globals.css';
import { Header1 } from '@/components/ui/header';
import Footer from '@/components/Footer';
import LoaderWrapper from '@/components/LoaderWrapper';
import Providers from '@/components/Providers';

export const metadata = {
  title: 'Murgan Store - Premium Women\'s Dresses',
  description: 'Welcome to Murgan Store - Your destination for premium quality women\'s dresses with best prices and styles.',
  keywords: 'women dresses, store, dresses, shopping, fashion, online store',
  author: 'Murgan Store',
  icons: {
    icon: '/logo.png',
    apple: '/logo.png',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/logo.png" type="image/png" sizes="any" />
        <link rel="shortcut icon" href="/logo.png" type="image/png" />
        <link rel="apple-touch-icon" href="/logo.png" />
        <meta name="theme-color" content="#ffffff" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
        />
      </head>

      <body>
        <LoaderWrapper />
        <Providers>
          <Header1 />
          <main className="min-h-screen pt-[120px]">
            {children}
          </main>
          <Footer />
        </Providers>
      </body>

    </html>
  );
}