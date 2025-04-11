import { Button, Popup } from "devextreme-react";

type TProps = {
  message: string;
  visible: boolean;
  handleConfirm: () => void;
};

const PopupMessage = ({ message, visible, handleConfirm }: TProps) => {
  return (
    <Popup width={360} height={"auto"} visible={visible} showTitle={false}>
      <div className="wrapper-popup">
        <h5 className="title">{message}</h5>
        <Button text="Oke" type="normal" onClick={handleConfirm} />
      </div>
    </Popup>
  );
};

export default PopupMessage;
