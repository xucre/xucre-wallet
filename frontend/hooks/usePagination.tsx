import { useState, useMemo, useCallback, useEffect } from 'react';

type SortOrder = 'asc' | 'desc';

interface PaginationOptions<T> {
  initialPage?: number;
  initialPageSize?: number;
  initialSortKey?: keyof T;
  initialSortOrder?: SortOrder;
  append?: boolean; // New option to support appending pages
  uniqueKey?: keyof T; // New option to support unique key for each item
}

interface UsePaginationResult<T> {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  paginatedData: T[];
  sortKey: keyof T | null;
  sortOrder: SortOrder;
  setPage: (page: number) => void;
  setPageSize: (size: number) => void;
  setSortKey: (key: keyof T) => void;
  setSortOrder: (order: SortOrder) => void;
  nextPage: () => void;
  prevPage: () => void;
  loadMore: () => void; // New function to load more pages
}

function usePagination<T>(data: T[], options: PaginationOptions<T> = {}): UsePaginationResult<T> {
  const {
    initialPage = 1,
    initialPageSize = 10,
    initialSortKey = null,
    initialSortOrder = 'asc',
    append = false
  } = options;

  const [currentPage, setCurrentPage] = useState(initialPage);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [sortKey, setSortKey] = useState<keyof T | null>(initialSortKey);
  const [sortOrder, setSortOrder] = useState<SortOrder>(initialSortOrder);
  const [loadedData, setLoadedData] = useState<T[]>([]);

  const sortedData = useMemo(() => {
    if (!sortKey) return data;

    return [...data].sort((a, b) => {
      const aValue = a[sortKey];
      const bValue = b[sortKey];

      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
  }, [data, sortKey, sortOrder]);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    const newPageData = sortedData.slice(start, end);

    if (append) {
      return [...loadedData, ...newPageData.filter(item => !loadedData.find((i) => { return i[options.uniqueKey as keyof T] === item[options.uniqueKey as keyof T] }))];
    } else {
      return newPageData;
    }
  }, [sortedData, currentPage, pageSize, append, loadedData]);

  const totalPages = Math.ceil(data.length / pageSize);

  const setPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  const nextPage = () => {
    setPage(currentPage + 1);
  };

  const prevPage = () => {
    setPage(currentPage - 1);
  };

  const loadMore = useCallback(() => {
    const nextPage = currentPage + 1;
    if (nextPage <= totalPages) {
      const start = (nextPage - 1) * pageSize;
      const end = start + pageSize;
      const newPageData = sortedData.slice(start, end);

      setLoadedData(prevData => [...prevData, ...newPageData.filter(item => !prevData.includes(item))]);
      setCurrentPage(nextPage);
    }
  }, [currentPage, totalPages, pageSize, sortedData]);

  return {
    currentPage,
    totalPages,
    pageSize,
    paginatedData,
    sortKey,
    sortOrder,
    setPage,
    setPageSize,
    setSortKey,
    setSortOrder,
    nextPage,
    prevPage,
    loadMore,
  };
}

export default usePagination;
