import {
  useIsMobile,
  useWindowDimensions,
} from "@src/common/hooks/useMediaQueries";
import { SIDE_MENU_WIDTH } from "@src/app/Constants";

export const usePanelWidth = () => {
  const { width } = useWindowDimensions();
  const isMobile = useIsMobile();

  const customWidth = isMobile ? `${width}px` : `${width - SIDE_MENU_WIDTH}px`;

  return customWidth;
};
