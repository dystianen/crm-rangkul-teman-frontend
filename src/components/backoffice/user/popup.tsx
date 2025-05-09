import React, {FormEventHandler, useCallback, useEffect, useRef, useState} from "react";
import Form, {
    ButtonItem,
    Label,
    SimpleItem
} from "devextreme-react/form";
import {Popup} from "devextreme-react";
import {CheckBoxTypes} from "devextreme-react/check-box";
import {sendWhatApp} from "../../../api/user.api";
import "./user.style.scss";

const UserPopup = ({title, message, username, password, show, handleConfirm}: {
    title: string,
    message: string,
    username: string,
    password: string,
    show: boolean,
    handleConfirm: () => void
}) => {

    const [isSend, setIsSend] = useState(false);

    const onClickSubmit = (evt: any) => {
        console.log("on click ok popup success user ", evt);
        if (isSend) {
            sendWhatApp({username, password}).then(console.log);
        }
        handleConfirm();
    }

    const onValueChanged = useCallback((args: CheckBoxTypes.ValueChangedEvent) => {
        setIsSend(args.value);
    }, []);

    return <>
        <Popup width={360} height={"auto"} visible={show} showTitle={false}>
            <div className="wrapper-popup">
                <i
                    className={"dx-icon-check"}
                    style={{
                        fontSize: "80px",
                        color: "green"
                    }}
                ></i>
                <h5 className="title" style={{marginBottom: "16px"}}>
                    {title}
                </h5>
                <p>
                    <span>{message}</span>&nbsp;
                </p>

            </div>
            <div className="form-user-success-container">
                <Form
                    colCount={1}
                    id="formUserSuccess"
                >
                    <SimpleItem
                        dataField={"username"}
                        editorOptions={{
                            value: username,
                            buttons: [
                                {
                                    name: 'copyPassword',
                                    location: 'after',
                                    options: {
                                        stylingMode: 'text',
                                        icon: 'copy',
                                        onClick: () => {
                                            navigator.clipboard.writeText(username).then(console.log);
                                        },
                                    },
                                },
                            ],
                        }}>
                        <Label text={"Username"}/>
                    </SimpleItem>
                    <SimpleItem
                        dataField={"password"}
                        editorOptions={{
                            value: password,
                            buttons: [
                                {
                                    name: 'copyPassword',
                                    location: 'after',
                                    options: {
                                        stylingMode: 'text',
                                        icon: 'copy',
                                        onClick: () => {
                                            navigator.clipboard.writeText(password).then(console.log);
                                        },
                                    },
                                },
                            ],
                        }}>
                        <Label text={"Password"}/>
                    </SimpleItem>
                    <SimpleItem
                        cssClass={"checkBoxWhatsapp"}
                        dataField="isSend"
                        editorType="dxCheckBox"
                        label={{
                            text: "Send credential via Whatsapp",
                            showColon: false,
                            alignment: "center",
                            location: "right"
                        }}
                        editorOptions={{
                            defaultValue: isSend,
                            onValueChanged: onValueChanged

                        }}
                    >
                    </SimpleItem>
                    <ButtonItem
                        horizontalAlignment="left"
                        buttonOptions={{
                            text: "OK",
                            type: "normal",
                            onClick: onClickSubmit,
                        }}
                    />
                </Form>
            </div>
        </Popup>

    </>
}
export default UserPopup;