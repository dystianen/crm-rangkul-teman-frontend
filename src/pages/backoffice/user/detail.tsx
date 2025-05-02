import {useNavigate} from "react-router";
import {useLocation} from "react-router-dom";
import queryString from "query-string";
import {FC} from "react";
import UserForm from "../../../components/backoffice/user/form";

export const DetailUserPage: FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const {id} = queryString.parse(location.search);
  
  return <>
    
    <UserForm
        id={id as string}
        readonly={true}
        loading={false}/>
  </>
}
