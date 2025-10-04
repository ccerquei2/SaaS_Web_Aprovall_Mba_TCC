import type { Metadata } from 'next';
import './globals.css';
import { ScreenshotModeProvider } from '@/hooks/useScreenshotMode';

export const metadata: Metadata = {
  title: 'Analisa IA – Work Order Auto-Approval',
  description: 'MVP demonstrativo com dados sintéticos para aprovação automática de ordens de serviço.'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>
        <ScreenshotModeProvider>{children}</ScreenshotModeProvider>
      </body>
    </html>
  );
}
