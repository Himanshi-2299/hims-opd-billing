import * as React from "react";
import { Link as RouterLink, LinkProps } from "react-router-dom";

/**
 * SafeLink - A wrapper around react-router-dom's Link that filters out Figma inspector props
 * This prevents React warnings about unrecognized props on DOM elements
 */
export const SafeLink = React.forwardRef<
  HTMLAnchorElement,
  LinkProps & React.RefAttributes<HTMLAnchorElement>
>(({ children, ...props }, ref) => {
  // Filter out all props that start with _fg (Figma inspector props)
  const cleanProps = Object.fromEntries(
    Object.entries(props).filter(([key]) => !key.startsWith("_fg"))
  ) as LinkProps;

  return (
    <RouterLink ref={ref} {...cleanProps}>
      {children}
    </RouterLink>
  );
});

SafeLink.displayName = "SafeLink";