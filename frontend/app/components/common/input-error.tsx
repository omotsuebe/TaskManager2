import React from "react";

export default function InputError({error}: {error: string|undefined|null}): React.JSX.Element {
    return(
        <div>
            {error && (
                <div className="text-xs text-red-500 mt-0.5">{error}</div>
            )}
        </div>
    )
}