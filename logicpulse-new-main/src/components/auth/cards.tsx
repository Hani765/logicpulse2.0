"use client";
import { CardStack } from "../ui/card-stack";
import { cn } from "@/utils/cn";
export function CardStackDemo() {
    return (
        <div className="flex h-full justify-center w-full">
            <CardStack items={CARDS} />
        </div>
    );
}

// Small utility to highlight the content of specific section of a testimonial content
export const Highlight = ({
    children,
    className,
}: {
    children: React.ReactNode;
    className?: string;
}) => {
    return (
        <span
            className={cn(
                "font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-700/[0.2] dark:text-emerald-500 px-1 py-0.5",
                className
            )}
        >
            {children}
        </span>
    );
};

const CARDS = [
    {
        id: 0,
        name: "Manu Arora",
        designation: "Senior Software Engineer",
        content: "images/app-ui.png"
    },
    {
        id: 1,
        name: "Elon Musk",
        designation: "Senior Shitposter",
        content: "images/app-ui.png"

    },
    {
        id: 2,
        name: "Tyler Durden",
        designation: "Manager Project Mayhem",
        content: "images/app-ui.png"
    },
];
