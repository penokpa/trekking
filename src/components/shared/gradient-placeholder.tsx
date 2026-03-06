import { cn } from "@/lib/utils";

const gradients = [
  "from-blue-600 to-cyan-500",       // ocean
  "from-orange-500 to-amber-400",    // sunset
  "from-emerald-600 to-teal-500",    // forest
  "from-violet-600 to-purple-500",   // twilight
  "from-rose-500 to-pink-400",       // alpine glow
  "from-slate-700 to-blue-600",      // mountain dusk
  "from-teal-500 to-emerald-400",    // glacier
  "from-indigo-600 to-blue-500",     // night sky
] as const;

interface GradientPlaceholderProps {
  index?: number;
  className?: string;
  children?: React.ReactNode;
}

export function GradientPlaceholder({
  index = 0,
  className,
  children,
}: GradientPlaceholderProps) {
  const gradient = gradients[index % gradients.length];

  return (
    <div
      className={cn(
        "relative flex items-center justify-center overflow-hidden bg-gradient-to-br",
        gradient,
        className
      )}
    >
      {/* Dot pattern overlay */}
      <div className="pattern-dots absolute inset-0" />
      {children}
    </div>
  );
}
