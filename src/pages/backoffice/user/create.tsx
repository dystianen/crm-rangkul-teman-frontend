import {useNavigate} from "react-router";
import {useLocation} from "react-router-dom";
import {FC, useState} from "react";
import UserForm from "../../../components/backoffice/user/form";

export const CreateUserPage: FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const [loading, setLoading] = useState(false)
  
  const onSubmit = (data: any)=> {
  
  }
  
  return <>
    
    <UserForm
        id={undefined}
        readonly={false}
        submit={onSubmit}
        loading={loading}/>
  </>
}
