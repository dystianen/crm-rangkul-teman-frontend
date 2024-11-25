import React, {useState, useRef, useCallback} from 'react';
import {useLocation, useNavigate} from 'react-router-dom';
import Form, {
    Item,
    Label,
    ButtonItem,
    ButtonOptions,
    RequiredRule,
    CustomRule,
} from 'devextreme-react/form';
import LoadIndicator from 'devextreme-react/load-indicator';
import notify from 'devextreme/ui/notify';
import {ValidationCallbackData} from 'devextreme-react/common';
import {changePassword} from '../../api/auth';
import queryString from "query-string";

export default function ChangePasswordForm() {
    const location = useLocation();
    const {recoveryCode} = queryString.parse(location.search);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const formData = useRef({oldPassword: '', newPassword: ''});

    const onSubmit = useCallback(async (e: any) => {
        e.preventDefault();

        const {oldPassword, newPassword} = formData.current;
        setLoading(true);

        const result = await changePassword(oldPassword, newPassword, decodeURIComponent(recoveryCode));
        setLoading(false);

        if (result.isOk) {
            navigate(result?.defaultPage);
        } else {
            notify(result.message, 'error', 2000);
        }
    }, [navigate, recoveryCode]);

    const confirmPassword = useCallback(
        ({value}: ValidationCallbackData) => value === formData.current.newPassword,
        []
    );

    return (
        <form onSubmit={onSubmit}>
            <Form formData={formData.current} disabled={loading}>
                <Item
                    dataField={'oldPassword'}
                    editorType={'dxTextBox'}
                    editorOptions={oldPasswordEditorOptions}
                >
                    <RequiredRule message="Password lama wajib diisi"/>
                    <Label visible={false}/>
                </Item>
                <Item
                    dataField={'newPassword'}
                    editorType={'dxTextBox'}
                    editorOptions={passwordEditorOptions}
                >
                    <RequiredRule message="Password baru wajib diisi"/>
                    <Label visible={false}/>
                </Item>
                <Item
                    dataField={'confirmedPassword'}
                    editorType={'dxTextBox'}
                    editorOptions={confirmedPasswordEditorOptions}
                >
                    <RequiredRule message="Konfirmasi password wajib diisi"/>
                    <CustomRule
                        message={'Password tidak cocok'}
                        validationCallback={confirmPassword}
                    />
                    <Label visible={false}/>
                </Item>
                <ButtonItem>
                    <ButtonOptions
                        width={'100%'}
                        type={'default'}
                        useSubmitBehavior={true}
                    >
            <span className="dx-button-text">
              {
                  loading
                      ? <LoadIndicator width={'24px'} height={'24px'} visible={true}/>
                      : 'Lanjutkan'
              }
            </span>
                    </ButtonOptions>
                </ButtonItem>
            </Form>
        </form>
    );
}

const oldPasswordEditorOptions = {stylingMode: 'filled', placeholder: 'Password lama', mode: 'password'};
const passwordEditorOptions = {stylingMode: 'filled', placeholder: 'Password baru', mode: 'password'};
const confirmedPasswordEditorOptions = {stylingMode: 'filled', placeholder: 'Konfirmasi Password', mode: 'password'};
