export default function ContainerLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="mx-auto w-full max-w-screen-xl px-4 sm:px-6 md:px-10">
      {children}
    </div>
  );
}
