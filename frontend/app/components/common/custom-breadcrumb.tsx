import React from 'react';
import { Link, useLocation } from "@remix-run/react";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbList, BreadcrumbPage,
    BreadcrumbSeparator
} from "~/components/ui/breadcrumb";

export default function CustomBreadcrumb() {
    const location = useLocation();
    const breadcrumbItems = location.pathname
        .split("/")
        .filter(Boolean) // Remove empty strings
        .map((segment, index, arr) => {
            const isLast = index === arr.length - 1;
            const href = `/${arr.slice(0, index + 1).join("/")}`;
            const formattedSegment = segment.replace(/-/g, " ");
            return (
                <React.Fragment key={segment}>
                    <BreadcrumbItem>
                        {isLast ? (
                            <BreadcrumbPage>{formattedSegment}</BreadcrumbPage>
                        ) : (
                            <Link to={href}>{formattedSegment}</Link>
                        )}
                    </BreadcrumbItem>
                    {!isLast && <BreadcrumbSeparator />}
                </React.Fragment>
            );
        });
    return (
        <Breadcrumb>
            <BreadcrumbList className="capitalize">{breadcrumbItems}</BreadcrumbList>
        </Breadcrumb>
    )
}