import { Button } from "devextreme-react/button";
import React from "react";

interface LoanDetailsAccordionProps {
  children: React.ReactNode;
  title?: string;
  isOpen: boolean;
  onToggle: () => void;
}

const LoanDetailsAccordion: React.FC<LoanDetailsAccordionProps> = ({
  children,
  title = "Kalkulator Pinjaman",
  isOpen,
  onToggle
}) => {
  return (
    <div className="dx-card responsive-paddings">
      <div
        style={{
          cursor: "pointer",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center"
        }}
        onClick={onToggle}
      >
        <p style={{ fontSize: 16, margin: 0 }}>{title}</p>
        <Button icon={isOpen ? "chevronup" : "chevrondown"} stylingMode="text" />
      </div>

      {isOpen && <div style={{ marginTop: 16 }}>{children}</div>}
    </div>
  );
};

export default LoanDetailsAccordion;
