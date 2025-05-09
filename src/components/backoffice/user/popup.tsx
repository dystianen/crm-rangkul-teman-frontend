import React, {FormEventHandler, useCallback, useEffect, useRef, useState} from "react";
import Form, {
    Label,
    SimpleItem
} from "devextreme-react/form";
import {Button, Popup} from "devextreme-react";

const UserPopup = ({title, message, username, password, show, handleConfirm}: {
    title: string,
    message: string,
    username: string,
    password: string,
    show: boolean,
    handleConfirm: () => void
}) => {

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
                </Form>
            </div>
            <Button text="OK" type="normal" onClick={handleConfirm}/>
        </Popup>

    </>
}
export default UserPopup;