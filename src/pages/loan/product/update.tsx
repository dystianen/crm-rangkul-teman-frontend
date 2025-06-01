import React, {FC, useEffect, useRef, useState} from "react";
import {useNavigate} from "react-router";
import {useLocation} from "react-router-dom";
import queryString from "query-string";
import {useAuth} from "../../../contexts/auth";


export const LoanProductUpdatePage: FC = () => {
  const {user} = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const {id} = queryString.parse(location.search);
  
  const [title, setTitle] = useState("Nama Produk");
  
  useEffect(() => {
	
  }, []);
  
  return (<>
  
  </>);
}
