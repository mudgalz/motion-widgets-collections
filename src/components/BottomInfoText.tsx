import { cn } from "@/lib/utils";

export default function ({
  text,
  className,
}: {
  text: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        className,
        "fixed bottom-4 w-full text-center opacity-60 text-xs font-mono px-4"
      )}>
      {text}
    </div>
  );
}
