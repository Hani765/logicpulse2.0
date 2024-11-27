import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "./tooltip";
import { QuestionMarkCircledIcon } from "@radix-ui/react-icons";

export default function PopoverComponent({
    description,
}: {
    description: string;
}) {
    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger type="button">
                    <QuestionMarkCircledIcon className="w-4 h-4" />
                </TooltipTrigger>
                <TooltipContent
                    side="bottom"
                    className="inline-block text-sm font-light text-gray-500 transition-opacity duration-300 bg-white border border-gray-200 rounded-lg shadow-sm w-72 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-400"
                >
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                        Details
                    </h3>
                    <p>{description}</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
}
