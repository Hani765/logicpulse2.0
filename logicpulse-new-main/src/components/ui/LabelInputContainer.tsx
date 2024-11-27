import * as React from "react";
import { cn } from "@/lib/utils";
import { Label } from "./label";
import { IoEye, IoEyeOff } from "react-icons/io5";
import PopoverComponent from "./popover-component";
import { Input } from "./input";

interface LabelInputContainerProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
  containerClassName?: string;
  label?: string;
  description?: string;
  errorMessage?: string;
  popoverMessage?: string;
  successMessage?: string;
  Icon?: React.ComponentType<any>;
}

const LabelInputContainer = React.forwardRef<
  HTMLInputElement,
  LabelInputContainerProps
>(
  (
    {
      className,
      containerClassName,
      label,
      description,
      errorMessage,
      popoverMessage,
      successMessage,
      Icon,
      type,
      ...inputProps
    },
    ref,
  ) => {
    const [isPasswordVisible, setIsPasswordVisible] = React.useState(false);
    const isPasswordField = type === "password";
    const inputType = isPasswordField && isPasswordVisible ? "text" : type;

    return (
      <div className={cn("mb-2 space-y-2", containerClassName)}>
        {label && (
          <Label
            htmlFor={inputProps.id || inputProps.name}
            className={`flex items-center gap-1 ${
              errorMessage ? "text-red-500" : ""
            }`}
          >
            {Icon && <Icon size={16} className="text-muted-foreground" />}
            {label}
            {popoverMessage && (
              <PopoverComponent description={popoverMessage} />
            )}
            {inputProps.required ? (
              <span className="text-red-500">*</span>
            ) : (
              <span className="text-muted-foreground">(Optional)</span>
            )}
          </Label>
        )}

        <div className="relative">
          <Input
            ref={ref}
            type={inputType}
            className={cn(className, errorMessage ? "border-red-500" : "")}
            {...inputProps}
          />
          {isPasswordField && (
            <button
              type="button"
              className="absolute inset-y-0 right-4 flex items-center text-muted-foreground"
              onClick={() => setIsPasswordVisible((prev) => !prev)}
              aria-label="Toggle password visibility"
            >
              {isPasswordVisible ? <IoEye /> : <IoEyeOff />}
            </button>
          )}
        </div>

        {errorMessage && (
          <p className="mt-1 text-sm text-red-500">{errorMessage}</p>
        )}
        {successMessage && (
          <p className="mt-1 text-sm text-green-500">{successMessage}</p>
        )}
        {description && (
          <p className="mt-1 text-sm text-gray-500">{description}</p>
        )}
      </div>
    );
  },
);

LabelInputContainer.displayName = "LabelInputContainer";

export { LabelInputContainer };
