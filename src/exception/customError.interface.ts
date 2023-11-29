export interface CustomError {
  statusCode: () => number;
}

export const isCustomError = (obj: any): obj is CustomError => {
  return 'statusCode' in obj;
};
