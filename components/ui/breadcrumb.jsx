"use client";

import React from "react";
import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";
import { cn } from "@/lib/utils";

const Breadcrumb = ({ items, className }) => {
  return (
    <nav 
      className={cn(
        "flex items-center space-x-1 text-sm text-gray-600 mb-6 p-4 bg-gray-50 rounded-lg border",
        className
      )}
      aria-label="Breadcrumb"
    >
      <ol className="flex items-center space-x-1 overflow-hidden">
        {items.map((item, index) => (
          <li key={index} className="flex items-center">
            {index > 0 && (
              <ChevronRight className="h-4 w-4 text-gray-400 mx-2 flex-shrink-0" />
            )}
            
            {item.href ? (
              <Link 
                href={item.href}
                className={cn(
                  "flex items-center gap-1 hover:text-red-600 transition-colors duration-200 truncate",
                  index === 0 && "text-red-600" // First item (Home) is always red
                )}
              >
                {index === 0 && <Home className="h-4 w-4 flex-shrink-0" />}
                <span className="truncate">{item.label}</span>
              </Link>
            ) : (
              <span className={cn(
                "text-gray-900 font-medium truncate flex items-center gap-1",
                index === items.length - 1 && "text-gray-900" // Last item is current page
              )}>
                {index === 0 && <Home className="h-4 w-4 flex-shrink-0" />}
                <span className="truncate">{item.label}</span>
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumb;
