import React, {useEffect, useState} from "react";
import "devextreme-react/file-uploader";
import "./loan-app.scss";

import {useNavigate} from "react-router";
import {useLocation} from "react-router-dom";
import queryString from "query-string";

import "devextreme-react/date-box";
import {DropDownButton} from "devextreme-react";
import {
    appLoanDetailActivityApi,
    appLoanDetailApi,
    getFile,
} from "src/api/apploan";
import {
    AppLoanDetailRequest,
    initAppLoanDetailValue,
} from "src/interfaces/appLoanOnboarding";
import {AppForm} from "./AppForm";

export default function DetailPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const {id} = queryString.parse(location.search);
    const [detail, setDetail] = useState<AppLoanDetailRequest>(
        initAppLoanDetailValue
    );
    const [activity, setActivity] = useState<Array<any>>([]);

    const downloadFile = (urlPath: string) => {
        var filename = urlPath.replace(/^.*[\\/]/, '');
        getFile(urlPath, {responseType: "blob"})
            .then(function (response) {
                const link = document.createElement("a");
                link.href = window.URL.createObjectURL(response);
                link.download = filename;
                link.click();
            })
            .catch((error: any) => {
                console.error("ERROR:: ", error);
            });
    };

    useEffect(() => {
        appLoanDetailApi(String(id)).then((res: unknown) => {
            const data = res as AppLoanDetailRequest;
            setDetail(data);
        });

        appLoanDetailActivityApi(String(id)).then((res) => {
            setActivity(res);
        });
    }, [id]);

    return (<>
        <div className="title-detail">
            <h2 className={"content-block"}>Detil Pengajuan</h2>
            <div>
                <DropDownButton
                    useSelectMode={false}
                    stylingMode="contained"
                    text="Activity"
                    dropDownOptions={{
                        width: 230,
                    }}
                    items={activity}
                    onItemClick={(e) => {
                        const text = e.itemData;
                        if (
                            text === "Download signed application" &&
                            detail.document.signedDocPath
                        ) {
                            downloadFile(detail.document.signedDocPath);
                        } else if (
                            text === "Download unsigned application" &&
                            detail.document.unsignedDocPath
                        ) {
                            downloadFile(detail.document.unsignedDocPath);
                        } else if (text === "Upload signed application") {
                            navigate(
                                `/loan-app/detail/upload-signed?id=${detail.application.id}`
                            );
                        }
                    }}
                    width={230}
                />
            </div>
        </div>
        <AppForm detail={detail}/>
    </>);
}
