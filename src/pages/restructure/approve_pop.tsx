import React, {FC, useEffect, useRef, useState} from "react";
import {AsyncRule, RequiredRule, Validator} from "devextreme-react/validator";
import Form, {Item, ButtonItem, PatternRule, SimpleItem, GroupItem} from "devextreme-react/form";
import { Popup } from "devextreme-react";
import {approve, calc, frequencyStore, submit} from "../../api/restructure_v2";
import {notifyError, notifySuccess} from "../../utils/devExtremeUtils";

import {confirm} from 'devextreme/ui/dialog';


interface approveRequest {
    restructureId?: string;
    validFrom?: string;
    validTo?: string;
}

export const ApproveRestructurePopup: FC<any> = (props, context) => {

    const formRef = useRef<Form>(null);
    const [request, setRequest] = useState<approveRequest>({});
    const {popupVisible, hide, data} = props;

    const onFormSubmit = (e: any) => {
        const form = formRef.current!.instance;
        console.log(data, request);
        const {isValid} = form.validate();
        if (isValid && data?.id) {

            confirm("Apakah anda yakin menyetujui restructure ini?", "Konfirmasi Restruktur").then((dialogResult) => {
                if (dialogResult) {
                    approve(request).then(sr=>{
                        notifySuccess("Submit approval berhasil!!");
                        hide();
                    }).catch(()=>notifyError("Approval restructure GAGAL!!"));
                }
            });
        }
        e.preventDefault();
    }

    const onFieldDataChanged = (evt: any) => {
        request[evt.dataField] = evt.value;
        request["restructureId"] = data?.id;
    }

    const asyncValidation = (params: { value: any; }) => {
        const isVal = params.value >= 1 && params.value <= 100;
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(isVal);
            }, 1000);
        });
    };

    useEffect(() => {
    }, [props]);

    return (<>
        <Popup
            width={480}
            visible={popupVisible}
            onHiding={hide}
            showCloseButton={true}
            title="Persetujuan Restruktur">
            <form onSubmit={onFormSubmit}>
                <Form
                    ref={formRef}
                    colCount={1}
                    id="restructureApprovalForm"
                    formData={request}
                    showColonAfterLabel={true}
                    showValidationSummary={true}
                    validationGroup="restructureApprovalForm"
                    onFieldDataChanged={onFieldDataChanged}
                >
                    <SimpleItem
                        dataField="validFrom"
                        label={{text: "Berlaku dari"}}
                        editorOptions={{
                            displayFormat: "dd MMM yyyy",
                            type: "date"
                        }}
                        editorType="dxDateBox"
                    >
                        <RequiredRule message="Berlaku dari wajib diisi"/>
                    </SimpleItem>
                    <SimpleItem
                        dataField="validTo"
                        label={{text: "Berlaku sampai"}}
                        editorOptions={{
                            displayFormat: "dd MMM yyyy",
                            type: "date"
                        }}
                        editorType="dxDateBox"
                    >
                        <RequiredRule message="Berlaku sampai wajib diisi"/>
                    </SimpleItem>
                    <ButtonItem
                        horizontalAlignment="left"
                        buttonOptions={{
                            width: "100%",
                            text: "Approve",
                            type: "success",
                            useSubmitBehavior: true,
                        }}
                    />
                </Form>
            </form>
        </Popup>
    </>);

}
