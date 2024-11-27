import React from "react";
import { Button } from "./button";
import { ReloadIcon } from "@radix-ui/react-icons";

export default function SubmitBtn({
    processing,
    label,
    className,
    variant,
    onClick,
}: {
    processing: any;
    label: string;
    className?: string;
    variant?: any;
    onClick?: any;
}) {
    return (
        <Button
            onClick={onClick}
            type={onClick ? "button" : "submit"}
            disabled={processing}
            variant={variant || "default"}
            className={className}
        >
            {processing ? (
                <React.Fragment>
                    <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                </React.Fragment>
            ) : (
                <>{label}</>
            )}
        </Button>
    );
}
