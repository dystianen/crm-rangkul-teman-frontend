import {FC, useState} from "react";
import {useNavigate} from "react-router";
import RoleForm from "../../../components/backoffice/role/roleForm";
import * as Title from "devextreme-react/toolbar";
import {notifyError, notifySuccess} from "../../../utils/devExtremeUtils";
import {createRole} from "../../../api/role.api";


export const CreateRolePage: FC = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const onSubmit = (data: any) => {
        setLoading(true);
        createRole(data).then((rs) => {
            notifySuccess("Created role");
            navigate("/backoffice/role");
        }).catch(err => notifyError(err.message))
            .finally(() => setLoading(false));
    }

    return (<>
            <div className={"content-block"}>
                <h2>Buat Peran Pengguna</h2>
                <Title.Toolbar className={"dx-card"}>
                    <Title.Item location="before" widget="dxButton" options={{
                        icon: "back",
                        text: "Back",
                        onClick: () => {
                            navigate("/backoffice/role");
                        }
                    }}/>
                </Title.Toolbar>
                <RoleForm id={undefined}
                          readonly={false}
                          submit={onSubmit}
                          loading={loading}/>
            </div>
        </>
    )
}