import React, {FormEventHandler, useCallback, useEffect, useRef, useState} from "react";
import Form, {
  ButtonItem,
  ButtonOptions,
  EmailRule, GroupItem,
  PatternRule,
  RequiredRule,
  SimpleItem
} from "devextreme-react/form";
import {allowOnlyNumbers, allowOnlyText} from "../../../utils/helpers";
import {LoadIndicator} from "devextreme-react";
import MultiSelect from "../../multiselect";
import {getUserDetail, roleStore, schemeStore} from "../../../api/user.api";

export default function UserForm({formRef, readonly, id, submit, loading}: {
  formRef?: any,
  readonly: boolean,
  id: string | undefined,
  submit?: FormEventHandler | undefined,
  loading: boolean
}) {
  const [userFormData, setUserFormData] = useState<any>({});
  
  const onFieldDataChanged = (evt: any) => {
	const { dataField, value } = evt;
	
	setUserFormData((prevState: any) => ({
	  ...prevState,
	  [dataField]: value
	}));
  };
  
  const onSubmit = (evt: any) => {
	console.log("submit form user ", evt);
	submit && submit(userFormData);
	evt && evt.preventDefault();
  }
  
  useEffect(() => {
	setUserFormData({
	  name: "",
	  phoneNumber: "",
	  email: ""
	});
	if(typeof id !== "undefined") {
	  getUserDetail(id).then((rs)=>{
		let roleIds = rs.roles.map((m:any)=>m.id);
		let schemeIds = rs.schemes.map((m:any)=>m.id);
		setUserFormData({
		  id: rs.id,
		  name: rs.contactName,
		  phoneNumber: rs.contactPhoneNumber,
		  email: rs.contactEmail,
		  roles: roleIds,
		  schemes: schemeIds
		});
	  })
	}
  }, [id]);
  
  return <>
	<form className="form__tabs" action="submit-user" onSubmit={onSubmit}>
	  <Form
		  id="formUser"
		  ref={formRef}
		  colCount={2}
		  showColonAfterLabel={true}
		  showValidationSummary={true}
		  validationGroup="OnValidateUserData"
		  formData={userFormData}
		  disabled={loading}
		  onFieldDataChanged={onFieldDataChanged}
	  >
		<GroupItem colSpan={2} colCount={2} cssClass={"dx-card responsive-paddings next-card"}>
		  <GroupItem>
			<SimpleItem
				dataField="name"
				label={{text: "Nama"}}
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
				dataField="phoneNumber"
				label={{text: "Phone Number"}}
				editorOptions={{
				  readonly: readonly,
				  min: 0,
				  maxLength: 14,
				  onKeyDown: (e: any) => allowOnlyNumbers(e.event)
				}}
			/>
			<SimpleItem
				dataField="email"
				label={{text: "Email"}}
				editorOptions={{
				  readonly: readonly,
				  min: 0,
				  maxLength: 32
				}}
			>
			  <EmailRule message="Email is invalid"/>
			</SimpleItem>
			
			{(submit && id) && <SimpleItem dataField={"password"}
                               label={{text: "Password"}} editorOptions={{
			  readonly: readonly,
			  min: 8,
			  maxLength: 20
			}} />}
			
			<SimpleItem
				dataField="roles"
				label={{text: "Role"}}
				isRequired={true}
				render={({component, dataField}) => (
					<MultiSelect
						value={userFormData.roles}
						dataSource={roleStore}
						component={component}
						fieldName={dataField}
						placeholder={"Select Role"}
					/>
				)}
			>
			  <RequiredRule message="Role wajib pilih salah satu"/>
			</SimpleItem>
			
			<SimpleItem
				dataField="schemes"
				label={{text: "Scheme"}}
				isRequired={true}
				render={({component, dataField}) => (
					<MultiSelect
						value={userFormData.schemes}
						dataSource={schemeStore}
						component={component}
						fieldName={dataField}
						placeholder={"Select Scheme"}
					/>
				)}
			>
			  <RequiredRule message="Scheme wajib pilih salah satu"/>
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
