import {useNavigate} from "react-router";
import {useLocation} from "react-router-dom";
import queryString from "query-string";
import {FC} from "react";
import UserForm from "../../../components/backoffice/user/form";
import * as Title from "devextreme-react/toolbar";

export const DetailUserPage: FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const {id} = queryString.parse(location.search);
  
  return <>
    <div className={"content-block"}>
      
      <h2>Detil Pengguna</h2>
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
        readonly={true}
        loading={false}/>
    </div>
  </>
}
