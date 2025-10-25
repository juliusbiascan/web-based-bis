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
    <div className={cn("w-full flex flex-col gap-y-3 sm:gap-y-4 items-center justify-center", className)}>
      <div className="flex items-center space-x-3 w-full justify-center">
        <div className="relative w-full max-w-[250px] sm:max-w-[300px] md:max-w-[350px]">
          <Image
            src="/logo-macatiw-ebrgy-dark.png"
            alt="AgriLink Logo"
            width={1000}
            height={111}
            className="w-full h-auto"
          />
        </div>
      </div>

      <p className="text-muted-foreground text-xs sm:text-sm text-center px-2">
        {label}
      </p>
    </div>
  );
};
