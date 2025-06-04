import { LoadPanel } from "devextreme-react";

type TProps = {
  visible: boolean;
};

const LoadingPage = ({ visible = false }: TProps) => {
  return (
    <LoadPanel
      shadingColor="rgba(0,0,0,0.4)"
      visible={visible}
      showIndicator={true}
      shading={true}
      showPane={true}
      hideOnOutsideClick={false}
    />
  );
};

export default LoadingPage;
