
interface ErrorAlertProps {
    errors: string[] | string;
}

export default function ErrorAlert({ errors }: ErrorAlertProps) {
    if (!errors || (Array.isArray(errors) && errors.length === 0)) return null;

    return (
        <div className="my-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded text-center">
            {Array.isArray(errors) ? (
                <ul>
                    {errors.map((error, index) => (
                        <li key={index} className="text-sm">
                            {error}
                        </li>
                    ))}
                </ul>
            ) : (
                <div className="text-sm">{errors}</div>
            )}
        </div>
    );
}
