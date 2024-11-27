import { useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { FaQuestionCircle, FaSearch } from "react-icons/fa";
import { cn } from "@/lib/utils";
import { Button } from "./button";
import { Input } from "./input";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./tooltip";
import { Label } from "./label";
import { LuChevronsUpDown } from "react-icons/lu";
import { CheckIcon } from "@radix-ui/react-icons";
export default function SearchSelect({
  items,
  selected_value,
  onSelect,
  label,
  description,
  bottomMessage,
  errorMessage,
}: {
  items: any;
  label: string;
  selected_value: string;
  onSelect: any;
  description?: string;
  bottomMessage?: string;
  errorMessage?: string;
}) {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const filteredItems = items.filter(
    (item: any) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.unique_id.toLowerCase().includes(searchTerm.toLowerCase()),
  );
  return (
    <div className="space-y-1 pt-1">
      {label && (
        <Label
          className={`flex items-center gap-1 ${
            errorMessage && "text-red-500"
          }`}
        >
          {label}
          {description && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger type="button">
                  <FaQuestionCircle size={12} className="mb-0.5" />
                </TooltipTrigger>
                <TooltipContent className="max-w-[300px]">
                  {description}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </Label>
      )}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between bg-gray-50 dark:border-white dark:bg-gray-800"
          >
            <span className="overflow-x-hidden">
              {selected_value !== ""
                ? items.find(
                    (tracker: any) => tracker.unique_id === selected_value,
                  )?.name
                : `${label}...`}
            </span>
            <LuChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="max-h-[250px] w-full p-0">
          <Command className="w-full">
            <div className="relative m-0 flex justify-center p-0">
              <FaSearch className="absolute left-1 top-3 ml-2 text-lg text-muted" />
              <Input
                placeholder={`${label}...`}
                className="w-full rounded-none border-none pl-8 focus-visible:ring-0 focus-visible:ring-offset-0"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <CommandList className="overflow-y-auto">
              <CommandEmpty>No data found.</CommandEmpty>
              <CommandGroup className="">
                {filteredItems.map((item: any) => (
                  <CommandItem
                    key={item.unique_id}
                    value={item.unique_id}
                    onSelect={(unique_id) => {
                      onSelect(unique_id);
                      setOpen(false);
                    }}
                  >
                    <CheckIcon
                      className={cn(
                        "mr-2 h-4 w-4",
                        selected_value === item.unique_id
                          ? "opacity-100"
                          : "opacity-0",
                      )}
                    />
                    {item.name}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      {errorMessage && (
        <p className="mt-1 text-sm text-red-500">{errorMessage}</p>
      )}
      {bottomMessage && (
        <p className="mt-1 text-sm text-gray-500">{bottomMessage}</p>
      )}
    </div>
  );
}
