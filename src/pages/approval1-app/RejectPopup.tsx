import React, {FC, useRef, useState} from "react";
import {TextBox} from "devextreme-react/text-box";
import {AsyncRule, RequiredRule, Validator} from "devextreme-react/validator";
import Form, {ButtonItem, PatternRule, SimpleItem, GroupItem} from "devextreme-react/form";
import {Button} from "devextreme-react/button";
import ValidationSummary from "devextreme-react/validation-summary";
import {Popup} from "devextreme-react/popup";
import {rejectApp1, rejectReasonStore} from "../../api/approval1";
import {useNavigate} from "react-router";
import {Toast} from "devextreme-react/toast";

export const RejectPopup: FC<any> = (props, context) => {

    const navigate = useNavigate();
    const formRef = useRef<Form>(null);
    const [request, setRequest] = useState({});
    const [rejectList, setRejectList] = useState([]);
    const {popupVisible, hide, data} = props;
    const [toastConfig, setToastConfig] = useState<any>({
        isVisible: false,
        type: 'info',
        message: '',
    });

    const onFormSubmit = (e: any) => {
        const form = formRef.current!.instance;
        const payload = {
            ...request,
            appId: data?.application?.id,
            approvalId: data?.approvalId,
        };
        rejectApp1(payload).then((res) => {
            hide();
            setToastConfig({
                ...toastConfig,
                isVisible: true,
                type: 'success',
                message: "Successfully reject application"
            });
            navigate(`/approval1`);
            form.resetValues();
        }).catch(() => setToastConfig({
            ...toastConfig,
            isVisible: true,
            type: 'error',
            message: "Failed reject application"
        }));
        console.log(payload);
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
            title="Reject Application">
            <form action="#">
                <Form
                    ref={formRef}
                    colCount={1}
                    id="form"
                    showColonAfterLabel={true}
                    showValidationSummary={false}
                    validationGroup="rejectApp"
                    onFieldDataChanged={onFieldDataChanged}
                >
                    <SimpleItem
                        dataField="rejectReasonId"
                        editorType="dxSelectBox"
                        editorOptions={{
                            dataSource: rejectReasonStore,
                            valueExpr: "id",
                            displayExpr: "name",
                            placeholder: "Select reason",
                            showClearButton: true,
                            deferRendering: true,
                            hoverStateEnabled: true,
                            searchEnabled: true,
                        }}
                        label={{text: "Reject Reason"}}
                    >
                        <RequiredRule message="Reject reason is required"/></SimpleItem>
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