import "./globals.css";

export const metadata = {
  title: "Sticky Notes",
  description: "A lightweight sticky notes app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
