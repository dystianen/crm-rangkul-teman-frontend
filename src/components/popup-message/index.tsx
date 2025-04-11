import { Button, Popup } from "devextreme-react";

type TProps = {
  message: string;
  visible: boolean;
  handleConfirm: () => void;
};

const PopupMessage = ({ message, visible, handleConfirm }: TProps) => {
  const lowerMessage = message?.toLowerCase();
  const isApproved = lowerMessage?.includes("disetujui");
  const isRejected = lowerMessage?.includes("ditolak");

  const statusConfig = isApproved
    ? { icon: "dx-icon-check", color: "green" }
    : isRejected
      ? { icon: "dx-icon-close", color: "red" }
      : { icon: "dx-icon-info", color: "orange" };

  return (
    <Popup width={360} height={"auto"} visible={visible} showTitle={false}>
      <div className="wrapper-popup">
        <i
          className={statusConfig.icon}
          style={{
            fontSize: "80px",
            color: statusConfig.color
          }}
        ></i>
        <h5 className="title" style={{ marginBottom: "16px" }}>
          {message}
        </h5>
        <Button text="Oke" type="normal" onClick={handleConfirm} />
      </div>
    </Popup>
  );
};

export default PopupMessage;
