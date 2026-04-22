import './globals.css';
import { Inter } from 'next/font/google';
import QueryProvider from '@/components/providers/QueryProvider';

const inter = Inter({ subsets: ['latin'], weight: ['400','500','600','700','800','900'] });

export const metadata = {
  title: 'Alpha Funding CRM',
  description: 'Enterprise lending & mortgage CRM platform',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.6.0/css/all.min.css"
        />
      </head>
      <body className={inter.className}>
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
