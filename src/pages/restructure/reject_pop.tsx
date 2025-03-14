import React, {FC, useEffect, useRef, useState} from "react";
import {AsyncRule, RequiredRule, Validator} from "devextreme-react/validator";
import Form, {Item, ButtonItem, PatternRule, SimpleItem, GroupItem} from "devextreme-react/form";
import { Popup } from "devextreme-react";
import {calc, frequencyStore, reject, submit} from "../../api/restructure_v2";
import {notifyError, notifySuccess} from "../../utils/devExtremeUtils";

import {confirm} from 'devextreme/ui/dialog';


interface rejectRequest {
    restructureId?: string;
    message?: string;
}


export const RejectRestructurePopup: FC<any> = (props, context) => {

    const formRef = useRef<Form>(null);
    const [request, setRequest] = useState<rejectRequest>({});
    const {popupVisible, hide, data} = props;

    const onFormSubmit = (e: any) => {
        const form = formRef.current!.instance;
        console.log(data, request);
        const {isValid} = form.validate();
        if (isValid && data?.id) {

            confirm("Apakah anda yakin akan me-reject restructure?", "Reject Restruktur").then((dialogResult) => {
                if (dialogResult) {
                    reject(request).then(sr=>{
                        notifySuccess("Submit data berhasil!!");
                        hide();
                    }).catch(()=>notifyError("Reject restructure GAGAL!!"));
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
            title="Reject Restruktur">
            <form onSubmit={onFormSubmit}>
                <Form
                    ref={formRef}
                    colCount={1}
                    id="restructureRejectForm"
                    formData={request}
                    showColonAfterLabel={true}
                    showValidationSummary={true}
                    validationGroup="restructureApprovalForm"
                    onFieldDataChanged={onFieldDataChanged}
                >
                    <SimpleItem
                        dataField="message"
                        editorType="dxTextArea"
                        label={{text: "Keterangan"}}
                        editorOptions={{height: 120}}
                    >
                        <RequiredRule message="keterangan wajib diisi"/>
                    </SimpleItem>
                    <ButtonItem
                        horizontalAlignment="left"
                        buttonOptions={{
                            width: "100%",
                            text: "Submit",
                            type: "success",
                            useSubmitBehavior: true,
                        }}
                    />
                </Form>
            </form>
        </Popup>
    </>);

}
