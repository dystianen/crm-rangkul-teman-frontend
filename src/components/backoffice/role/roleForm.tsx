import React, {FormEventHandler, useEffect, useState} from "react";
import {roleStore, accessStore, getRoleDetail} from "../../../api/role.api";
import Form, {
    ButtonItem,
    ButtonOptions,
    EmailRule,
    GroupItem,
    PatternRule,
    RequiredRule,
    SimpleItem
} from "devextreme-react/form";
import {allowOnlyNumbers, allowOnlyText} from "../../../utils/helpers";
import MultiSelect from "../../multiselect";
import {LoadIndicator} from "devextreme-react";
import "./role.style.scss";


export default function RoleForm({formRef, readonly, id, submit, loading}: {
    formRef?: any,
    readonly: boolean,
    id: string | undefined,
    submit?: FormEventHandler | undefined,
    loading: boolean
}) {
    const [roleFormData, setRoleFormData] = useState<any>({isRoot: false, accessIds: []});

    const onFieldDataChanged = (evt: any) => {
        const {dataField, value} = evt;

        setRoleFormData((prevState: any) => ({
            ...prevState,
            [dataField]: value
        }));
    };

    const onSubmit = (evt: any) => {
        console.log("submit form role ", evt);
        submit && submit(roleFormData);
        evt && evt.preventDefault();
    }

    useEffect(() => {
        setRoleFormData({
            name: "",
            isRoot: false,
            defaultPage: "",
            accessIds: []

        });
        if (typeof id !== "undefined") {
            getRoleDetail(id).then((rs) => {
                let accessIds = rs.accesses.map((m: any) => m.id);
                setRoleFormData({
                    id: rs.id,
                    name: rs.name,
                    isRoot: rs.isRoot,
                    defaultPage: rs.defaultPage,
                    accessIds: accessIds
                });
            })
        }
    }, [id]);

    return <>
        <form className="form__tabs" action="submit-role" onSubmit={onSubmit}>
            <Form
                id="formUser"
                ref={formRef}
                colCount={2}
                showColonAfterLabel={true}
                showValidationSummary={true}
                validationGroup="OnValidateUserData"
                formData={roleFormData}
                disabled={loading}
                onFieldDataChanged={onFieldDataChanged}
            >
                <GroupItem colSpan={2} colCount={2} cssClass={"dx-card responsive-paddings next-card"}>
                    <GroupItem>
                        <SimpleItem
                            dataField="name"
                            label={{text: "Nama Peran"}}
                            editorOptions={{
                                readonly: readonly,
                                min: 0,
                                maxLength: 150,
                                onKeyDown: (e: any) => allowOnlyText(e.event)
                            }}
                        >
                            <RequiredRule message="Nama wajib diisi"/>
                            <PatternRule message="Tidak boleh angka" pattern={/^[^0-9]+$/}/>
                        </SimpleItem>

                        <SimpleItem
                            cssClass={"checkBoxIsRoot"}
                            dataField="isRoot"
                            editorType="dxCheckBox"
                            label={{
                                text: "is root",
                                showColon: false,
                                alignment: "center",
                                location: "right"
                            }}
                        />

                        <SimpleItem
                            dataField="defaultPage"
                            label={{text: "Default Page"}}
                            editorOptions={{
                                readonly: readonly,
                                min: 0,
                                maxLength: 100
                            }}
                        >
                            <RequiredRule message="Default Page wajib diisi"/>
                        </SimpleItem>

                        <SimpleItem
                            dataField="accessIds"
                            label={{text: "Akses"}}
                            isRequired={true}
                            render={({component, dataField}) => (
                                <MultiSelect
                                    value={roleFormData.access}
                                    dataSource={accessStore}
                                    component={component}
                                    fieldName={dataField}
                                    placeholder={"Select Access"}
                                />
                            )}
                        >
                            <RequiredRule message="Akses wajib pilih salah satu"/>
                        </SimpleItem>
                    </GroupItem>
                    <GroupItem>&nbsp;</GroupItem>
                </GroupItem>
                {submit && <ButtonItem horizontalAlignment="left">
                    <ButtonOptions type="success" disabled={loading} useSubmitBehavior>
                        <div className="button-options">
                            <LoadIndicator width="20px" height="20px" visible={loading}/>
                            <span className="dx-button-text">{id ? "Update" : "Simpan"}</span>
                        </div>
                    </ButtonOptions>
                </ButtonItem>}
            </Form>
        </form>
    </>
}