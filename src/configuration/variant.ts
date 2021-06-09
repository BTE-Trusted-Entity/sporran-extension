export const variantPublic = 'public';
export const variantInternal = 'internal';

declare const VARIANT: typeof variantPublic | typeof variantInternal;
export const isInternal =
  typeof VARIANT === 'string' && VARIANT === variantInternal;

export const contextGlobalName = 'variant';
