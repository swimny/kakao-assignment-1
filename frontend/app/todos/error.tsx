"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex flex-col items-center gap-4 py-10 text-center">
      <h2 className="text-lg font-bold text-slate-900">문제가 발생했습니다</h2>
      <p className="text-sm text-neutral-500">{error.message}</p>
      <button
        onClick={() => reset()}
        className="rounded-sm bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
      >
        다시 시도
      </button>
    </div>
  );
}
