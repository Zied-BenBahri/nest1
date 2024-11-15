export interface PaginatedResponse<T> {
    data: T[];
    meta: {
      total: number;
      currentPage: number;
      itemsPerPage: number;
      totalPages: number;
      hasNextPage: boolean;
      hasPreviousPage: boolean;
    };
  }