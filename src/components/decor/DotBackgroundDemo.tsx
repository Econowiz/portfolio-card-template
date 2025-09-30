import DotBackground from "@/components/decor/DotBackground";

export function DotBackgroundDemo() {
  return (
    <DotBackground className="flex h-[50rem] w-full items-center justify-center bg-white dark:bg-black">
      <p className="bg-gradient-to-b from-neutral-200 to-neutral-500 bg-clip-text py-8 text-4xl font-bold text-transparent sm:text-7xl">
        Backgrounds
      </p>
    </DotBackground>
  );
}

