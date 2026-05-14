'use client';

import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './Button';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  maxVisiblePages?: number;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  maxVisiblePages = 5,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const getVisiblePages = () => {
    const pages: (number | string)[] = [];
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, '...', totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
      }
    }
    
    return pages;
  };

  return (
    <div className="flex items-center justify-center gap-1 mt-6">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="gap-1"
      >
        <ChevronLeft className="w-4 h-4" />
        Anterior
      </Button>

      <div className="flex items-center gap-1 mx-2">
        {getVisiblePages().map((page, index) => (
          typeof page === 'number' ? (
            <motion.button
              key={page}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => onPageChange(page)}
              className={`w-9 h-9 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                page === currentPage
                  ? 'bg-primary text-white shadow-lg shadow-primary/25'
                  : 'bg-slate-100 text-text-secondary hover:bg-slate-200'
              }`}
            >
              {page}
            </motion.button>
          ) : (
            <span key={`ellipsis-${index}`} className="px-2 text-text-muted">
              {page}
            </span>
          )
        ))}
      </div>

      <Button
        variant="ghost"
        size="sm"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="gap-1"
      >
        Siguiente
        <ChevronRight className="w-4 h-4" />
      </Button>
    </div>
  );
}