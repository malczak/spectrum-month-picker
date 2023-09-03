import { darkTheme, defaultTheme } from "@adobe/react-spectrum";
import type { Theme } from "@react-types/provider";

export const customTheme: Theme = {
  ...defaultTheme,
  dark: darkTheme.light,
};
