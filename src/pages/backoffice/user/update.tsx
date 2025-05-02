import {useNavigate} from "react-router";
import {useLocation} from "react-router-dom";
import queryString from "query-string";
import {FC, useState} from "react";
import UserForm from "../../../components/backoffice/user/form";

export const UpdateUserPage: FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const {id} = queryString.parse(location.search);
  
  const [loading, setLoading] = useState(false)
  
  const onSubmit = (data: any)=> {
  
  }
  
  return <>
  
    <UserForm
        id={id as string}
        readonly={false}
        submit={onSubmit}
        loading={loading}/>
  </>
}
