import type { JSX, PropsWithChildren } from "react";
import { useLayoutEffect } from "react";

import { useThemeState } from "../model/store";

export const ThemeProvider = ({
  children,
}: PropsWithChildren): JSX.Element => {
  const theme = useThemeState((state) => state.theme);

  useLayoutEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;
    document.body.dataset.theme = theme;
  }, [theme]);

  return <>{children}</>;
};
