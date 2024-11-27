import Link from "next/link";

export function Footer() {
  return (
    <div className="z-20 w-full">
      <div className="mx-4 md:mx-8 flex h-14 items-center">
        <p className="text-xs md:text-sm leading-loose text-muted-foreground text-left">
          © 2024 LogicPulse. All Rights Reserved.
        </p>
      </div>
    </div>
  );
}
