interface BrandMarkProps {
  size?: "sm" | "md" | "lg";
  showWordmark?: boolean;
}

const sizes = {
  sm: "h-8 w-8",
  md: "h-10 w-10",
  lg: "h-14 w-14",
};

export function BrandMark({ size = "md", showWordmark = true }: BrandMarkProps) {
  return (
    <div className="flex items-center gap-2.5">
      <svg
        className={`${sizes[size]} shrink-0`}
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden
      >
        <rect width="64" height="64" rx="16" fill="#6B1742" />
        <path
          d="M32 14c-1.2 4.8-4.8 8.4-9.6 9.6 4.8 1.2 8.4 4.8 9.6 9.6 1.2-4.8 4.8-8.4 9.6-9.6C36.8 22.4 33.2 18.8 32 14z"
          fill="#FFC4D6"
        />
        <path
          d="M20 40h24v3.5c0 4.4-5.4 8-12 8s-12-3.6-12-8V40z"
          fill="#FFF6FA"
        />
        <path d="M18 40h28v2H18v-2z" fill="#FF9EC0" />
        <path d="M31 28h2v10h-2z" fill="#FFC4D6" />
      </svg>
      {showWordmark && (
        <span className="font-display text-xl font-bold tracking-tight text-ink sm:text-2xl">
          Bumblearn
        </span>
      )}
    </div>
  );
}
