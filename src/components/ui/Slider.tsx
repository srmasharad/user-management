import * as React from "react";

import { cn } from "@/lib/utils";
import * as SliderPrimitive from "@radix-ui/react-slider";

interface SliderProps
  extends Partial<React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>> {
  currentValue?: number[];
}

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  SliderProps
>(({ currentValue, className, ...props }, ref) => (
  <SliderPrimitive.Root
    ref={ref}
    className={cn(
      "relative flex w-full touch-none select-none items-center",
      className
    )}
    {...props}
  >
    <SliderPrimitive.Track className="relative w-full h-1 overflow-hidden rounded-full grow bg-secondary">
      <SliderPrimitive.Range className="absolute h-full bg-primary" />
    </SliderPrimitive.Track>
    <SliderPrimitive.Thumb className="relative flex items-center justify-center w-4 h-4 transition-colors border-2 rounded-full cursor-pointer group/item border-primary bg-background ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50">
      {currentValue && (
        <div className="absolute top-[100%] invisible px-2 py-0.5 text-xs font-medium bg-white border rounded-sm shadow-sm group-hover/item:visible border-border text-muted-foreground min-w-max mt-1">
          {currentValue.toLocaleString()}
        </div>
      )}
    </SliderPrimitive.Thumb>
  </SliderPrimitive.Root>
));
Slider.displayName = SliderPrimitive.Root.displayName;

export { Slider };
