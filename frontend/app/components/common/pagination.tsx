import React from 'react';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
    const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

    return (
        <nav className="flex justify-center items-center mt-6">
            <button
                className={`px-4 py-2 border rounded-md ${
                    currentPage === 1 ? 'bg-gray-200 cursor-not-allowed' : 'hover:bg-gray-300'
                }`}
                disabled={currentPage === 1}
                onClick={() => onPageChange(currentPage - 1)}
            >
                Previous
            </button>
            <ul className="flex space-x-2 mx-4">
                {pages.map((page) => (
                    <li key={page}>
                        <button
                            className={`px-4 py-2 border rounded-md ${
                                page === currentPage
                                    ? 'bg-blue-500 text-white font-bold'
                                    : 'hover:bg-gray-300 text-gray-700'
                            }`}
                            onClick={() => onPageChange(page)}
                        >
                            {page}
                        </button>
                    </li>
                ))}
            </ul>
            <button
                className={`px-4 py-2 border rounded-md ${
                    currentPage === totalPages ? 'bg-gray-200 cursor-not-allowed' : 'hover:bg-gray-300'
                }`}
                disabled={currentPage === totalPages}
                onClick={() => onPageChange(currentPage + 1)}
            >
                Next
            </button>
        </nav>
    );
}
