import { Loader2 } from 'lucide-react';

interface LoadingProps {
  message?: string;
  fullScreen?: boolean;
}

export default function Loading({ message = 'Loading…', fullScreen = false }: LoadingProps) {
  const content = (
    <div className="flex flex-col items-center justify-center gap-3 py-12" role="status" aria-live="polite">
      <Loader2 className="h-8 w-8 animate-spin text-blue-500" aria-hidden="true" />
      <p className="text-sm text-slate-500 dark:text-slate-400">{message}</p>
    </div>
  );

  if (fullScreen) {
    return <div className="flex min-h-[50vh] items-center justify-center">{content}</div>;
  }

  return content;
}
