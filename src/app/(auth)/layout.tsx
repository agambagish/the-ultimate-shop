export default function Layout({ children }: React.PropsWithChildren) {
  return (
    <main className="flex min-h-screen items-center justify-center">
      {children}
    </main>
  );
}
