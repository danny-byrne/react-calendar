import React from "react";
import { mergeStyles, Stack, Text } from "@fluentui/react";
import { getClassNames } from "./DayTime.classNames";
import { colors } from "@src/common/styles/colors";
import AsNeededIcon from "@src/assets/DayTime/AsNeededIcon";
import DayTimeIcon from "@src/assets/DayTime/DayTimeIcon";
import EveningIcon from "@src/assets/DayTime/EveningIcon";
import SunRiseSetIcon from "@src/assets/DayTime/SunRiseSetIcon";

interface ISubHeaderProps {
  time?: string;
  asNeeded?: boolean;
  testId?: string;
}

const timeStringToMinutes = (s: string): number => {
  if (s === null || s === undefined) return undefined;

  var split = s.split(":");
  if (split.length !== 2) return undefined;

  const isPM = split[1].slice(2).toUpperCase() === "PM";

  var hours = parseInt(split[0]);
  if (hours === null || hours === undefined) return undefined;
  if (hours < 0 || hours > 23) return undefined;

  if (isPM && hours > 0 && hours < 12) {
    hours += 12;
  } else if (!isPM && hours == 12) {
    hours = 0;
  }

  var minutes = parseInt(split[1].slice(0, 2));
  if (minutes === null || minutes === undefined) return undefined;
  if (minutes < 0 || minutes > 59) return undefined;

  return hours * 60 + minutes;
};

const DayTime: React.FC<ISubHeaderProps> = (props) => {
  const { time, asNeeded, testId } = props;
  const classNames = getClassNames();
  const timeInMinutes = timeStringToMinutes(time);

  const getIcon = () => {
    if (asNeeded) {
      return { icon: <AsNeededIcon />, color: colors.fabric.neutrals.gray20 };
    }

    if (timeInMinutes <= timeStringToMinutes("9:00AM")) {
      return { icon: <SunRiseSetIcon />, color: colors.windcrest.sunrise };
    } else if (
      timeInMinutes > timeStringToMinutes("9:00AM") &&
      timeInMinutes <= timeStringToMinutes("5:00PM")
    ) {
      return { icon: <DayTimeIcon />, color: colors.windcrest.daytime };
    } else if (
      timeInMinutes > timeStringToMinutes("5:00PM") &&
      timeInMinutes < timeStringToMinutes("7:00PM")
    ) {
      return { icon: <SunRiseSetIcon />, color: colors.windcrest.sunset };
    } else {
      return { icon: <EveningIcon />, color: colors.windcrest.evening };
    }
  };

  const { icon, color } = getIcon();

  const timeContainer = mergeStyles(classNames["wc-Daytime--container"], {
    backgroundColor: color,
  });

  return (
    <Stack className={classNames["wc-Daytime--wrapper"]}>
      <Stack className={timeContainer} horizontal>
        <div
          className={classNames["wc-Daytime--iconContainer"]}
          data-testid={testId}
        >
          {icon}
        </div>
        <Text className={classNames["wc-Daytime--timeText"]}>
          {asNeeded ? "As Needed" : time}
        </Text>
      </Stack>
    </Stack>
  );
};

export default DayTime;
