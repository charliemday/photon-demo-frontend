/**
 * Takes a type and converts all of its keys from snake_case to camelCase
 */
export type CamelToSnakeCase<S extends any> = S extends `${infer T}${infer U}`
  ? `${T extends Capitalize<T> ? "_" : ""}${Lowercase<T>}${CamelToSnakeCase<U>}`
  : S;

export type ConvertToSnakeCase<
  T extends {
    [key: string]: any;
  }
> = { [K in keyof T as CamelToSnakeCase<K>]: T[K] };

/**
 * Takes a type and converts all of its keys from camelCase to snake_case
 */
export type SnakeToCamelCase<S extends any> = S extends `${infer T}_${infer U}`
  ? `${T}${Capitalize<SnakeToCamelCase<U>>}`
  : S;

export type ConvertToCamelCase<
  T extends {
    [key: string]: any;
  }
> = { [K in keyof T as SnakeToCamelCase<K>]: T[K] };



// API Error Response
export interface APIErrorResponse {
  error: {
    status_code: number;
    message: string;
    details: {
      [key: string]: string[];
    };
  }
}