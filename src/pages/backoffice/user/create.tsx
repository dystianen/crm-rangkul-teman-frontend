import {useNavigate} from "react-router";
import {useLocation} from "react-router-dom";
import {FC, useState} from "react";
import UserForm from "../../../components/backoffice/user/form";
import * as Title from "devextreme-react/toolbar";
import {createUser} from "../../../api/user.api";
import {notifyError, notifySuccess} from "../../../utils/devExtremeUtils";

export const CreateUserPage: FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const [loading, setLoading] = useState(false)
  
  const onSubmit = (data: any)=> {
    setLoading(true);
    createUser(data).then(()=>{
      notifySuccess("User was created");
      navigate("/backoffice/user");
    }).catch(err=>notifyError(err.message))
        .finally(()=>setLoading(false));
  }
  
  return <>
    <div className={"content-block"}>
      <h2>Buat Pengguna</h2>
      <Title.Toolbar className={"dx-card"}>
        <Title.Item location="before" widget="dxButton" options={{
          icon: "back",
          text: "Back",
          onClick: () => {
            navigate("/backoffice/user");
          }
        }}/>
      </Title.Toolbar>
      <UserForm
          id={undefined}
          readonly={false}
          submit={onSubmit}
          loading={loading}/>
    </div>
  </>
}
