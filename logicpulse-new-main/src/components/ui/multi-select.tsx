"use client";

import * as React from "react";
import { Badge } from "@/components/ui/badge";
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Command as CommandPrimitive } from "cmdk";
import { Checkbox } from "./checkbox";
import { Label } from "./label";
import { FaX } from "react-icons/fa6";

type Item = {
  unique_id: string;
  name: string;
};

interface MultiSelectProps {
  items: Item[];
  selectedItems: string; // Comma-separated values
  label: string; // Comma-separated values
  descriptoin?: string; // Comma-separated values
  onSelect: (unique_id: string) => void; // Handler to update selected items
}

export function MultiSelect({
  items,
  selectedItems,
  onSelect,
  descriptoin,
  label,
}: MultiSelectProps) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [open, setOpen] = React.useState(false);
  const [inputValue, setInputValue] = React.useState("");
  const [selectAll, setSelectAll] = React.useState(false);

  const handleUnselect = React.useCallback(
    (item: Item) => {
      const updatedSelection = selectedItems
        .split(",")
        .filter((unique_id) => unique_id !== item.unique_id)
        .join(",");
      onSelect(updatedSelection);
    },
    [selectedItems, onSelect],
  );

  const handleSelectAll = React.useCallback(() => {
    if (selectAll) {
      onSelect("");
    } else {
      const allValues = items.map((item) => item.unique_id).join(",");
      onSelect(allValues);
    }
    setSelectAll(!selectAll);
  }, [selectAll, items, onSelect]);

  const handleKeyDown = React.useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      const input = inputRef.current;
      if (input) {
        if (e.key === "Delete" || e.key === "Backspace") {
          if (input.value === "") {
            const updatedSelection = selectedItems
              .split(",")
              .slice(0, -1)
              .join(",");
            onSelect(updatedSelection);
          }
        }
        if (e.key === "Escape") {
          input.blur();
        }
      }
    },
    [selectedItems, onSelect],
  );

  const selectedArray = selectedItems.split(",");
  const selectables = items
    .filter((item) => !selectedArray.includes(item.unique_id))
    .filter(
      (item) =>
        item.name.toLowerCase().includes(inputValue.toLowerCase()) ||
        item.unique_id.toLowerCase().includes(inputValue.toLowerCase()),
    );

  React.useEffect(() => {
    const allValues = items.map((item) => item.unique_id);
    setSelectAll(allValues.length === selectedArray.length);
  }, [items, selectedArray]);
  const handleSelect = React.useCallback(
    (item: Item) => {
      const currentSelection = selectedItems.split(",").filter(Boolean); // Ensure no empty strings
      const updatedSelection = [
        ...new Set([...currentSelection, item.unique_id]),
      ].join(","); // Remove duplicates
      onSelect(updatedSelection);
    },
    [selectedItems, onSelect],
  );

  return (
    <>
      <Command
        onKeyDown={handleKeyDown}
        className="overflow-visible bg-transparent"
      >
        <div className="mt-1">
          <div className="flex items-center justify-between">
            <Label className="">{label}</Label>
            <div className="flex items-center space-x-2">
              <span>Select All</span>
              <Checkbox
                checked={selectAll}
                onCheckedChange={handleSelectAll}
                className="form-checkbox"
              />
            </div>
          </div>
          <div className="group flex max-h-[200px] flex-wrap gap-2 overflow-y-auto rounded-md border border-input px-3 py-2 text-sm ring-offset-background focus-within:ring-1 focus-within:ring-ring focus-within:ring-offset-1">
            {selectedArray.map((unique_id) => {
              const item = items.find((f) => f.unique_id === unique_id);
              return item ? (
                <Badge key={item.unique_id} variant="secondary">
                  {item.name}
                  <button
                    className="ml-1 rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleUnselect(item);
                      }
                    }}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                    onClick={() => handleUnselect(item)}
                  >
                    <FaX className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                  </button>
                </Badge>
              ) : null;
            })}
            <CommandPrimitive.Input
              ref={inputRef}
              value={inputValue}
              onValueChange={setInputValue}
              onBlur={() => setOpen(false)}
              onFocus={() => setOpen(true)}
              placeholder={`${label}...`}
              className="ml-2 flex-1 bg-transparent outline-none placeholder:text-muted-foreground"
            />
          </div>
        </div>
        <div className="relative mt-2">
          <CommandList>
            {open && selectables.length > 0 ? (
              <div className="animate-in absolute top-0 z-10 w-full rounded-md border bg-popover text-popover-foreground shadow-md outline-none">
                <CommandGroup className="h-full overflow-auto">
                  {selectables.map((item) => (
                    <CommandItem
                      key={item.unique_id}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                      }}
                      onSelect={() => {
                        handleSelect(item);
                      }}
                      className="cursor-pointer"
                    >
                      {item.name}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </div>
            ) : null}
          </CommandList>
        </div>
        {descriptoin && <p className="text-sm text-gray-500">{descriptoin}</p>}
      </Command>{" "}
    </>
  );
}
