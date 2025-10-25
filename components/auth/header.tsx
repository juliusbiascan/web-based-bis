import { Poppins } from "next/font/google";
import Image from "next/image";
import { cn } from "@/lib/utils";

const font = Poppins({
  subsets: ["latin"],
  weight: ["600"],
});

interface HeaderProps {
  label: string;
  className?: string;
}

export const Header = ({
  label,
  className,
}: HeaderProps) => {
  return (
    <div className={cn("w-full flex flex-col gap-y-4 items-center justify-center", className)}>
      <div className="flex items-center space-x-3">
        <Image
          src="/logo.png"
          alt="AgriLink Logo"
          width={60}
          height={60}

        />
        <h1 className={cn(
          "text-2xl font-bold bg-clip-text",
          font.className,
        )}>
          eBarangay Macatiw
        </h1>
      </div>
      <p className="text-muted-foregroundtext-sm">
        {label}
      </p>
    </div>
  );
};
