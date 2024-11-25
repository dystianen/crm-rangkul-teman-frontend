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
import {submitRestructure} from "../../api/contract";

export const RestructurePopup: FC<any> = (props, context) => {

    const formRef = useRef<Form>(null);
    const [request, setRequest] = useState<any>({});
    const {popupVisible, hide, data} = props;
    const [toastConfig, setToastConfig] = useState<any>({
        isVisible: false,
        type: 'info',
        message: '',
    });

    const onFormSubmit = (e: any) => {
        const form = formRef.current!.instance;
        console.log(data, request);
        const {isValid} = form.validate();
        if (isValid && data?.id) {
            confirm("<i>Anda yakin untuk restruktur kontrak dengan nilai minimum pembayaran " + request?.percentage + "% dari sisa cicilan</i>", "Konfirmasi Restruktur").then((dialogResult) => {
                if (dialogResult) {
                    submitRestructure({...request, contractId: data?.id}).then((res) => {
                        setToastConfig({
                            ...toastConfig,
                            isVisible: true,
                            type: 'success',
                            message: "Restruktur Sukses"
                        });
                        request['percentage'] = 50;
                        hide();
                    }).catch(() => setToastConfig({
                        ...toastConfig,
                        isVisible: true,
                        type: 'error',
                        message: "Restruktur Gagal"
                    }));
                }
            });
        }
        e.preventDefault();
    }

    const onFieldDataChanged = (evt: any) => {
        request[evt.dataField] = evt.value;
    }

    const asyncValidation = (params: { value: any; }) => {
        const isVal = params.value >= 1 && params.value <= 100;
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(isVal);
            }, 1000);
        });
    };

    return (<>
        <Toast
            visible={toastConfig.isVisible}
            message={toastConfig.message}
            type={toastConfig.type}
            onHiding={onHiding}
            displayTime={600}
        />
        <Popup
            width={480}
            height={"auto"}
            visible={popupVisible}
            onHiding={hide}
            hideOnOutsideClick={true}
            showCloseButton={true}
            title="Restruktur">
            <form onSubmit={onFormSubmit}>
                <Form
                    ref={formRef}
                    colCount={1}
                    id="restructureForm"
                    showColonAfterLabel={true}
                    showValidationSummary={true}
                    validationGroup="restructureForm"
                    onFieldDataChanged={onFieldDataChanged}
                >
                    <SimpleItem
                        dataField="percentage"
                        editorType="dxNumberBox"
                        label={{text: "Minimum payment in percentage to restructure from the installment outstanding"}}
                        editorOptions={{
                            value: 50,
                            max: 100,
                        }}
                    >
                        <RequiredRule message="percentage is required"/>
                        <AsyncRule
                            message="Minimum pembayaran restruktur: 1 sampai 100 % dari nilai cicilan"
                            validationCallback={asyncValidation}/>
                    </SimpleItem>
                    <ButtonItem
                        horizontalAlignment="left"
                        buttonOptions={{
                            width: "100%",
                            text: "OK",
                            type: "success",
                            useSubmitBehavior: true,
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
