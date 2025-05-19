import {useNavigate} from "react-router";
import {useLocation} from "react-router-dom";
import queryString from "query-string";
import {FC, useState} from "react";
import * as Title from "devextreme-react/toolbar";
import {notifyError, notifySuccess} from "../../../utils/devExtremeUtils";
import {updateRole} from "../../../api/role.api";
import RoleForm from "../../../components/backoffice/role/roleForm";

export const UpdateRolePage: FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const {id} = queryString.parse(location.search);

    const [loading, setLoading] = useState(false)

    const onSubmit = (data: any)=> {
        setLoading(true);
        updateRole(data).then(()=>{
            notifySuccess("Role already updated");
            navigate("/backoffice/role");
        }).catch(err=>notifyError(err.message))
            .finally(()=>setLoading(false));
    }

    return (<>
        <div className={"content-block"}>

            <h2>Edit Peran Pengguna</h2>dev

            <Title.Toolbar className={"dx-card"}>
                <Title.Item location="before" widget="dxButton" options={{
                    icon: "back",
                    text: "Back",
                    onClick: () => {
                        navigate("/backoffice/role");
                    }
                }}/>
            </Title.Toolbar>
            <RoleForm
                id={id as string}
                readonly={false}
                submit={onSubmit}
                loading={loading}/>
        </div>
    </>);
}