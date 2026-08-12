import type { Metadata } from 'next';
import './globals.css';
import Providers from './providers';

export const metadata: Metadata = {
  title: 'BiglypEnroll — The leap that defines you',
  description:
    "India's complete student lifecycle & financial infrastructure for institutions.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="App">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
