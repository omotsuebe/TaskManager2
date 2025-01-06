export default function LoadingIndicator({size = 'w-12 h-12', color = 'text-blue-500'}:{size?: string; color?: string;}){
    return (
        <div className={`flex items-center justify-center mt-4`}>
            <div
                className={`${size} ${color} border-4 border-t-transparent border-solid rounded-full animate-spin`}
                role="status"
            />
        </div>
    );
};

