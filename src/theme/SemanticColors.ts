import { ISemanticColors } from "@fluentui/react";
import { colors } from "@src/common/styles/colors";
import { palette } from "./Palette";

export const semanticColors: Partial<ISemanticColors> = {
  primaryButtonBackground: palette.themePrimary,
  primaryButtonBackgroundHovered: "#4A32E2",
  primaryButtonBackgroundPressed: palette.themePrimary,
  primaryButtonBackgroundDisabled: colors.fabric.neutrals.gray20,
  primaryButtonText: colors.fabric.neutrals.white,
  buttonBorder: palette.themePrimary,
  buttonBorderDisabled: "none",
  buttonBackground: colors.windcrest.transparent,
  buttonBackgroundHovered: colors.windcrest.transparent,
  buttonBackgroundPressed: colors.windcrest.transparent,
  buttonBackgroundDisabled: colors.fabric.neutrals.gray20,
  buttonText: palette.themePrimary,
};
