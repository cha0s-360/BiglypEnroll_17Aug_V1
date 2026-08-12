'use client';

import * as React from 'react';
import Box from '@mui/material/Box';
import { cn } from '@/lib/utils';

const BASE = 'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70';

export const Label = React.forwardRef<HTMLLabelElement, React.ComponentPropsWithoutRef<'label'>>(
  ({ className, ...props }, ref) => (
    <Box component="label" ref={ref as any} className={cn(BASE, className)} {...(props as any)} />
  )
);
Label.displayName = 'Label';

export default Label;
