import './globals.css';
import { AppProvider } from '../context/AppContext';

export const metadata = {
  title: 'SquatGym',
  description: 'Sistema de gestión para SquatGym'
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>
        <AppProvider>
          {children}
        </AppProvider>
      </body>
    </html>
  );
}
