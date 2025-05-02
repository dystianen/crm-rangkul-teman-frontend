import React, {FormEventHandler, useCallback, useRef, useState} from "react";
import Form, {
  ButtonItem,
  ButtonOptions,
  EmailRule,
  PatternRule,
  RequiredRule,
  SimpleItem
} from "devextreme-react/form";
import {allowOnlyNumbers, allowOnlyText} from "../../../utils/helpers";
import {LoadIndicator} from "devextreme-react";
import MultiSelect from "../../multiselect";
import {roleStore, schemeStore} from "../../../api/user.api";

export default function UserForm({formRef, readonly, id, submit, loading}:{formRef?: any, readonly: boolean, id:string|undefined, submit?: FormEventHandler | undefined, loading: boolean}) {
  const [userFormData, setUserFormData] = useState<any>({});
  
  const onFieldAppDataChanged = useCallback((evt: any) => {
	userFormData[evt.dataField] = evt.value;
  }, []);
  
  const onSubmit = (evt: any) => {
	console.log("submit form user ", evt);
	submit && submit(userFormData);
  }
  
  return <>
	<form onSubmit={onSubmit}>
	  <Form
		  id="formUser"
		  ref={formRef}
		  showColonAfterLabel={true}
		  showValidationSummary={true}
		  validationGroup="OnValidateUserData"
		  formData={userFormData}
		  disabled={loading}
		  onFieldDataChanged={onFieldAppDataChanged}
	  >
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
			dataField="mobileNumber"
			label={{ text: "Mobile Number" }}
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
		  <EmailRule message="Email is invalid" />
		</SimpleItem>
		<SimpleItem
			dataField="roles"
			label={{ text: "Role" }}
			render={({ component, dataField }) => (
				<MultiSelect
					value={userFormData.roles}
					dataSource={roleStore}
					component={component}
					fieldName={dataField}
					placeholder={"Select Role"}
				/>
			)}
		/>
		<SimpleItem
			dataField="scheme"
			label={{ text: "Scheme" }}
			render={({ component, dataField }) => (
				<MultiSelect
					value={userFormData.scheme}
					dataSource={schemeStore}
					component={component}
					fieldName={dataField}
					placeholder={"Select Scheme"}
				/>
			)}
		/>
		{submit && <ButtonItem horizontalAlignment="left">
          <ButtonOptions type="success" disabled={loading} useSubmitBehavior>
            <div className="button-options">
              <LoadIndicator width="20px" height="20px" visible={loading}/>
              <span className="dx-button-text">{id ? "Update" : "Simpan" }</span>
            </div>
          </ButtonOptions>
        </ButtonItem>}
	  </Form>
	</form>
  </>
}
