'use client';

import * as React from 'react';
import Box from '@mui/material/Box';
import { cn } from '@/lib/utils';

const BASE =
  'flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm';

export const Input = React.forwardRef<HTMLInputElement, React.ComponentPropsWithoutRef<'input'>>(
  ({ className, type, ...props }, ref) => (
    <Box component="input" type={type} ref={ref as any} className={cn(BASE, className)} {...(props as any)} />
  )
);
Input.displayName = 'Input';

export default Input;
