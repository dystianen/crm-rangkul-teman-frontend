export interface FilterPss {
  start?: number;
  length?: number;
  sort?: any;
  searchQuery?: string;
  quickFilter?: string;
}

export function setFilterPss(): FilterPss {
  return {
    start: 0,
    length: 50,
    sort: [],
    searchQuery: '[]',
  };
}
