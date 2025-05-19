import { Button, LoadIndicator, Popup } from "devextreme-react";

type TProps = {
  message: string;
  visible: boolean;
  loading: boolean;
  handleCancel: () => void;
  handleConfirm: () => void;
};

const PopupConfirm = ({
  message,
  visible,
  loading = false,
  handleCancel,
  handleConfirm
}: TProps) => {
  return (
    <Popup width={360} height={"auto"} visible={visible} showTitle={false}>
      <div className="wrapper-popup">
        <i
          className={"dx-icon-info"}
          style={{
            fontSize: "80px",
            color: "orange"
          }}
        ></i>
        <h6 style={{ margin: 0, marginBottom: "16px" }}>{message}</h6>
        <div style={{ display: "flex", gap: 16 }}>
          <Button text="Batal" type="normal" onClick={handleCancel} />
          <Button type="default" disabled={loading} onClick={handleConfirm}>
            <div className="button-options">
              <LoadIndicator width="20px" height="20px" visible={loading} />
              <span className="dx-button-text">Oke</span>
            </div>
          </Button>
        </div>
      </div>
    </Popup>
  );
};

export default PopupConfirm;
