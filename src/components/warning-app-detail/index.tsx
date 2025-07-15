import { Button, Popup } from "devextreme-react";
import {useEffect, useState} from "react";
import {useNavigate} from "react-router";
import {isAllowedDetail} from "../../api/apploan";

type TProps = {
  appId: string;
};

const PopupForbiddenMessage = ({ appId }: TProps) => {
  const navigate = useNavigate();
  const [isShowPopupMessage, setShowPopupMessage] = useState(false);
  
  useEffect(() => {
	isAllowedDetail(appId).then(res=>setShowPopupMessage(!res.isShow));
  }, [appId]);
  
  const handleConfirm = (e:any) => {
	navigate("/loan-app");
  }
  
  return (
	  <Popup width={360} height={"auto"} visible={isShowPopupMessage} showTitle={false}>
		<div className="wrapper-popup">
		  <i
			  className={"dx-icon-info"}
			  style={{
				fontSize: "80px",
				color: "orange"
			  }}
		  ></i>
		  <h5 className="title" style={{ marginBottom: "16px" }}>
			User tidak diperkenankan mengakses halaman ini!!
		  </h5>
		  <Button text="Oke" type="normal" onClick={handleConfirm} />
		</div>
	  </Popup>
  );
};

export default PopupForbiddenMessage;
