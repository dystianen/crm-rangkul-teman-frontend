import { Button, Popup } from "devextreme-react";
import Form, {ButtonItem, RequiredRule, SimpleItem} from "devextreme-react/form";
import {useRef, useState} from "react";
import {getAssignSales, getAssignVerificator, submitAssignSales, submitAssignVerificator} from "../../api/apploan";
import {notifyError, notifySuccess} from "../../utils/devExtremeUtils";
import {selectBoxOptions} from "../../api/contact";
import DataSource from "devextreme/data/data_source";

type TProps = {
    assign: any;
    visible: boolean;
    handleSubmit: (e: any) => void;
    hide: () => void;
};

const AssignSalesPopup = ({ assign, visible, handleSubmit, hide }: TProps) => {
    const formRef = useRef<Form>(null);

    const onFieldDataChanged = (evt: any) => {
        assign[evt.dataField] = evt.value;
    };

    const listAssign = selectBoxOptions(
        new DataSource(getAssignSales(assign.appId)),
        "Select sales"
    );

    return (<>
        <Popup
            width={360}
            height={200}
            visible={visible}
            onHiding={hide}
            hideOnOutsideClick={true}
            showCloseButton={true}
            title="Assign Sales"
        >
            <form onSubmit={handleSubmit}>
                <Form
                    ref={formRef}
                    colCount={1}
                    id="form"
                    showColonAfterLabel={true}
                    showValidationSummary={false}
                    validationGroup="assignSalesForm"
                    formData={assign}
                    onFieldDataChanged={onFieldDataChanged}
                >
                    <SimpleItem
                        dataField="salesBy"
                        editorType="dxSelectBox"
                        editorOptions={listAssign}
                        label={{ text: "Assign to" }}
                    >
                        <RequiredRule message="Assign to is required!" />
                    </SimpleItem>
                    <ButtonItem
                        horizontalAlignment="left"
                        buttonOptions={{
                            width: "100%",
                            text: "Submit",
                            type: "success",
                            useSubmitBehavior: true
                        }}
                    />
                </Form>
            </form>
        </Popup>
    </>);
};

export default AssignSalesPopup;
