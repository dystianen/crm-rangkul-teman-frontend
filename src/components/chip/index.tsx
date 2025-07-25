import React from "react";
import "./styles.scss";

type ChipVariant = "default" | "primary" | "success" | "danger";

interface ChipProps {
  label: string;
  variant?: ChipVariant;
  onClick?: () => void;
  onRemove?: () => void;
}

const Chip: React.FC<ChipProps> = ({ label, variant = "default", onClick, onRemove }) => {
  return (
    <div className={`chip chip-${variant} ${onClick ? "chip-clickable" : ""}`} onClick={onClick}>
      <span>{label}</span>
      {onRemove && (
        <span
          className="chip-close"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
        >
          ×
        </span>
      )}
    </div>
  );
};

export default Chip;
