export const filterOperation: any = {
  string: ['contains', 'startswith', '=', '<>'],
  numeric: ['=', '<=', '>=', '<>'],
  date: ['=', '<=', '>='],
  boolean: ['=', '<>'],
  stringMulti: ['=', 'anyof'],
};
