export interface CustomError {
  code: () => number;
}

export const isCustomError = (obj: any): obj is CustomError => {
  return 'code' in obj;
};
