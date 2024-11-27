import React from "react";

export default function Status({ status }: { status: string }) {
    return (
        <div>
            {status === "completed" ? (
                <div className="bg-green-500 text-white rounded shadow py-0.5 px-2">
                    Completed
                </div>
            ) : status === "closed" ? (
                <div className="bg-gray-500 text-white rounded shadow py-0.5 px-2">
                    Closed
                </div>
            ) : status === "open" ? (
                <div className="bg-yellow-500 text-white rounded shadow py-0.5 px-2">
                    Open
                </div>
            ) : status === "rejected" || status == "cancelled" ? (
                <div className="bg-red-500 text-white rounded shadow py-0.5 px-2">
                    {status}
                </div>
            ) : (
                <div className="bg-blue-500 text-white rounded shadow py-0.5 px-2">
                    {status}
                </div>
            )}
        </div>
    );
}
