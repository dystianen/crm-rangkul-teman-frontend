import {useNavigate} from "react-router";
import {useLocation} from "react-router-dom";
import queryString from "query-string";
import {FC, useState} from "react";
import UserForm from "../../../components/backoffice/user/form";
import * as Title from "devextreme-react/toolbar";
import {updateUser} from "../../../api/user.api";
import {notifyError, notifySuccess} from "../../../utils/devExtremeUtils";

export const UpdateUserPage: FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const {id} = queryString.parse(location.search);
  
  const [loading, setLoading] = useState(false)
  
  const onSubmit = (data: any)=> {
    setLoading(true);
    updateUser(data.id, data).then(()=>{
      notifySuccess("User already updated");
      navigate("/backoffice/user");
    }).catch(err=>notifyError(err.message))
    .finally(()=>setLoading(false));
  }
  
  return <>
    <div className={"content-block"}>
      
      <h2>Edit Pengguna</h2>
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
          id={id as string}
          readonly={false}
          submit={onSubmit}
          loading={loading}/>
    </div>
  </>
}
