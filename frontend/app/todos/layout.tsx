export default function TodosLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-500 px-4 py-10">
      <div className="w-full max-w-lg rounded-lg border border-neutral-300 bg-neutral-50 p-7 shadow-xl">
        {children}
      </div>
    </div>
  );
}
