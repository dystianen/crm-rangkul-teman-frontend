import React, {FC, useRef, useState} from "react";
import {TextBox} from "devextreme-react/text-box";
import {AsyncRule, RequiredRule, Validator} from "devextreme-react/validator";
import Form, {ButtonItem, PatternRule, SimpleItem, GroupItem} from "devextreme-react/form";
import {Button} from "devextreme-react/button";
import ValidationSummary from "devextreme-react/validation-summary";
import {Popup} from "devextreme-react/popup";
import {approvalApp1, getDetail} from "../../api/approval1";
import {AppLoanDetailRequest} from "../../interfaces/appLoanOnboarding";
import {useNavigate} from "react-router";
import {Toast} from 'devextreme-react/toast';
import {confirm} from 'devextreme/ui/dialog';

export const ApprovePopup: FC<any> = (props, context) => {

    const navigate = useNavigate();
    const formRef = useRef<Form>(null);
    const [request, setRequest] = useState({});
    const {popupVisible, hide, data} = props;
    const [toastConfig, setToastConfig] = useState<any>({
        isVisible: false,
        type: 'info',
        message: '',
    });

    const onFormSubmit = (e: any) => {
        const form = formRef.current!.instance;
        const {isValid} = form.validate();
        if (isValid && data?.application?.id) {
            confirm("<i>Ada yakin melanjutkan proses ini?</i>", "Konfirmasi Approval").then((dialogResult) => {
                if (dialogResult) {
                    approvalApp1(data?.application?.id, request).then((res) => {
                        setToastConfig({
                            ...toastConfig,
                            isVisible: true,
                            type: 'success',
                            message: "Successfully approve application"
                        });
                        navigate(`/approval1`);
                    }).catch(() => setToastConfig({
                        ...toastConfig,
                        isVisible: true,
                        type: 'error',
                        message: "Failed approve application"
                    })).finally(() => form.resetValues());
                }
            });
        }
        console.log(data);
        e.event.stopPropagation();
    }

    const onFieldDataChanged = (evt: any) => {
        request[evt.dataField] = evt.value;
    }

    return (<>
        <Toast
            visible={toastConfig.isVisible}
            message={toastConfig.message}
            type={toastConfig.type}
            onHiding={onHiding}
            displayTime={600}
        />
        <Popup
            width={360}
            height={"auto"}
            visible={popupVisible}
            onHiding={hide}
            hideOnOutsideClick={true}
            showCloseButton={true}
            title="Approve Application">
            <form action="#">
                <Form
                    ref={formRef}
                    colCount={1}
                    id="form"
                    showColonAfterLabel={true}
                    showValidationSummary={false}
                    validationGroup="approveApp"
                    onFieldDataChanged={onFieldDataChanged}
                >
                    <SimpleItem
                        dataField="description"
                        editorType="dxTextArea"
                        label={{text: "Description"}}
                        editorOptions={{height: 120}}
                    >
                        <RequiredRule message="description is required"/>
                    </SimpleItem>
                    <ButtonItem
                        horizontalAlignment="left"
                        buttonOptions={{
                            width: "100%",
                            text: "Submit",
                            type: "success",
                            onClick: onFormSubmit,
                        }}
                    />
                </Form>
            </form>
        </Popup>
    </>);

    function onHiding() {
        setToastConfig({
            ...toastConfig,
            isVisible: false,
        });
    }
}