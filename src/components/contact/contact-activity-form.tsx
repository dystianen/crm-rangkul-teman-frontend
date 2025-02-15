import React, {useState, useRef, useCallback, Ref, useEffect} from 'react';
import {useNavigate} from "react-router-dom";
import Form, {
    AsyncRule,
    ButtonItem, ButtonOptions,
    EmailRule, GroupItem,
    Item,
    Label,
    PatternRule,
    RequiredRule,
    SimpleItem
} from "devextreme-react/form";
import {activityResultStore, activityTypeStore, selectBoxOptions} from "../../api/contact";
import DataSource from "devextreme/data/data_source";
import {StringLengthRule} from "devextreme-react/validator";
import {LoadIndicator, Popup} from "devextreme-react";
import {ajaxPatch, ajaxPost} from "../../api/http.api";

export interface IContactActivity {
    contactId?: string
    id?: string
    comment?: string
    resultId?: string
    typeId?: string
}

interface ActivityContactProps {
    children?: React.ReactChild | React.ReactChild[];
    className?: string;
    activityContactData: IContactActivity;
    isModalVisible: boolean;
    onSubmit: (e: any) => void;
    onCloseModal: (e: any) => void;
    formActivityRef?: Ref<any>;
}

export default function ActivityContactForm(props: ActivityContactProps) {

    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [resultDataOption, setResultDataOption] = useState<any>({});
    const [activityContactData, setActivityContactData] = useState<IContactActivity>(props.activityContactData);

    const onSubmit = async (event: any) => {
        event.preventDefault();
        console.log("activityContactData : ", activityContactData);
        if(activityContactData.id){
            const resp = await ajaxPatch(`/api/contact/activity/update/${activityContactData.id}`, activityContactData);
            console.log("update", resp);
        } else {
            const resp = await ajaxPost("/api/contact/activity/create", activityContactData);
            console.log("insert", resp);
        }
        props.onSubmit(event);
    }
    const typeOptions = selectBoxOptions(new DataSource(activityTypeStore), "Select Type");

    const onFieldAppDataChanged = (evt: any) => {
        if (evt.dataField === "typeId" && evt.value != null) {
            setResultDataOption(selectBoxOptions(
                new DataSource(activityResultStore(evt.value)),
                "Select Result"
            ));
        }

        activityContactData[evt.dataField] = evt.value;
    };

    useEffect(() => {
        setActivityContactData(prevContact => ({ ...prevContact, ...props.activityContactData }));
        if(typeof props.activityContactData.typeId !== "undefined") {
            setResultDataOption(selectBoxOptions(
                new DataSource(activityResultStore(props.activityContactData.typeId)),
                "Select Result"
            ));
        }

    },[props.activityContactData]);

    return (<Popup
            width={"40%"}
            height={"auto"}
            visible={props.isModalVisible}
            title="Activity Form"
        >
            <form onSubmit={onSubmit}>
                <Form
                    ref={props.formActivityRef}
                    id="form"
                    showColonAfterLabel={true}
                    showValidationSummary={true}
                    validationGroup="OnActivityContactData"
                    formData={activityContactData}
                    disabled={loading}
                    onFieldDataChanged={onFieldAppDataChanged}
                >
                    <SimpleItem
                        dataField="typeId"
                        label={{text: "Type"}}
                        editorType="dxSelectBox"
                        editorOptions={typeOptions}
                    >
                        <RequiredRule message="Type is required"/>
                    </SimpleItem>
                    <SimpleItem
                        dataField="resultId"
                        label={{text: "Result"}}
                        editorType="dxSelectBox"
                        editorOptions={resultDataOption}
                    >
                        <RequiredRule message="Result is required"/>
                    </SimpleItem>
                    <SimpleItem
                        dataField="comment"
                        label={{text: "Comment"}}
                        editorType={'dxTextArea'}
                        editorOptions={{}}
                    >
                        <RequiredRule message="Comment is required"/>
                    </SimpleItem>

                    <GroupItem colCount={2}>
                        <ButtonItem horizontalAlignment="left">
                            <ButtonOptions width={"100%"} onClick={props.onCloseModal}>
                                <span className="dx-button-text">Tutup</span>
                            </ButtonOptions>
                        </ButtonItem>

                        <ButtonItem horizontalAlignment="left">
                            <ButtonOptions
                                type="default"
                                width={"100%"}
                                disabled={loading}
                                useSubmitBehavior={true}
                            >
                                <div className="button-options">
                                    <LoadIndicator width="20px" height="20px" visible={loading} />
                                    <span className="dx-button-text">Simpan</span>
                                </div>
                            </ButtonOptions>
                        </ButtonItem>
                    </GroupItem>
                </Form>
            </form>
        </Popup>)
}