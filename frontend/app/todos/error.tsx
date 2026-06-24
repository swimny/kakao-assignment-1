"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div>
      <p>오류가 발생했어요: {error.message}</p>
      <button onClick={reset}>다시 시도</button>
    </div>
  );
}
