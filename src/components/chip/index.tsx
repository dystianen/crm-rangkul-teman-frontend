import React from "react";
import "./styles.scss";

type ChipVariant = "default" | "primary" | "success" | "danger" | "warning";

interface ChipProps {
  label: string;
  variant?: ChipVariant;
  onClick?: () => void;
}

const Chip: React.FC<ChipProps> = ({ label, variant = "default", onClick }) => {
  return (
    <div className={`chip chip-${variant} ${onClick ? "chip-clickable" : ""}`} onClick={onClick}>
      <span>{label}</span>
    </div>
  );
};

export default Chip;
