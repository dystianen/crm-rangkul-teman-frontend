import React, {FC, useEffect} from "react";
import {useNavigate} from "react-router";
import {useLocation} from "react-router-dom";
import queryString from "query-string";
import {notifyError} from "../../utils/devExtremeUtils";

export const ReinvestInterestForm: FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const {token} = queryString.parse(location.search);
  
  useEffect(() => {
	if (token == null) {
	  notifyError("Not valid token");
	  navigate("/login");
	}
  }, []);
  
  return (<></>);
}
