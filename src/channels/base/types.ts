export interface ErrorFirstCallback<Output> {
  (error: null, output: Output): void;

  (error: Error): void;
}
