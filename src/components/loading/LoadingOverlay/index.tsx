import React from "react";
import "./index.css";

type LoadingOverlayProps = {
  visible: boolean;
  text?: string;
};

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ visible, text }) => {
  if (!visible) return null;

  return (
    <div className="loading-overlay">
      <div className="spinner-container">
        <div className="spinner" />
        {text && <div className="loading-text">{text}</div>}
      </div>
    </div>
  );
};

export default LoadingOverlay;
