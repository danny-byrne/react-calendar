import React from "react";
import { useNavigate } from "react-router-dom";
import { ActionButton, FontWeights } from "@fluentui/react";
import { colors } from "@src/common/styles/colors";

interface IBackProps {
  style?: React.CSSProperties;
  href?: string;
  onClick?: () => void;
  title?: string;
}

const Back: React.FC<IBackProps> = ({
  style,
  href,
  onClick,
  title = "Back",
}) => {
  const navigate = useNavigate();

  if (!href && !onClick) {
    onClick = () => navigate(-1);
  }

  return (
    <ActionButton
      data-testid="back-button"
      iconProps={{ iconName: "ChevronLeft" }}
      href={href}
      onClick={() => onClick()}
      style={style}
      styles={{
        textContainer: {
          color: colors.fabric.neutrals.WCprimary,
          fontWeight: FontWeights.semibold,
        },
      }}
    >
      {title}
    </ActionButton>
  );
};

export default Back;
