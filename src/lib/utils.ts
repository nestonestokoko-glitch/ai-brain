// Dependency-free class joiner (shadcn's `cn` uses clsx + tailwind-merge,
// which this project doesn't have). Filters out falsy values and joins.
export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(' ');
}
