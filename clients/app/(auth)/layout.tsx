export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <main className="bg-black-3 min-h-screen flex items-center justify-center">{children}</main>;
}
