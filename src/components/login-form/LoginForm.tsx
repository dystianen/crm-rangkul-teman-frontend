import React, {useState, useRef, useCallback} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import Form, {
    Item,
    Label,
    ButtonItem,
    ButtonOptions,
    RequiredRule,
} from 'devextreme-react/form';
import LoadIndicator from 'devextreme-react/load-indicator';
import notify from 'devextreme/ui/notify';
import {useAuth} from '../../contexts/auth';

import './LoginForm.scss';

export default function LoginForm() {
    const navigate = useNavigate();
    const {signIn} = useAuth();
    const [loading, setLoading] = useState(false);
    const formData = useRef({email: '', password: ''});
    const [showPassword, setShowPassword] = useState(false);
    const [iconPassword, setIconPassword] = useState('eyeopen');

    const onSubmit = useCallback(async (e: any) => {
        e.preventDefault();
        const {email, password} = formData.current;
        setLoading(true);

        const result = await signIn(email, password);
        if (!result.isOk) {
            setLoading(false);
            notify(result.message, 'error', 2000);
        } else {
            setLoading(false);
            const {isOk, mustChangePwd, data, defaultPage} = result;
            if (isOk && mustChangePwd) {
                navigate(`/change-password?recoveryCode=${encodeURIComponent(data)}`);
            } else {
                navigate(defaultPage);
            }
        }
    }, [signIn]);

    const onCreateAccountClick = useCallback(() => {
        navigate('/create-account');
    }, [navigate]);


    const emailEditorOptions = {stylingMode: 'filled', placeholder: 'Username'};
    const passwordEditorOptions = {
        stylingMode: 'filled',
        placeholder: 'Password',
        mode: showPassword ? 'text': 'password',
        buttons: [
            {
                name: 'copyPassword',
                location: 'after',
                options: {
                    stylingMode: 'text',
                    icon: iconPassword,
                    onClick: () => {
                        if(!showPassword){
                            setShowPassword(true);
                            setIconPassword('eyeclose');
                        } else {
                            setShowPassword(false);
                            setIconPassword('eyeopen');
                        }
                    },
                },
            },
        ],
    };
    const rememberMeEditorOptions = {text: 'Remember me', elementAttr: {class: 'form-text'}};

    return (
        <form className={'login-form'} onSubmit={onSubmit}>
            <Form formData={formData.current} disabled={loading}>
                <Item
                    dataField={'email'}
                    editorType={'dxTextBox'}
                    editorOptions={emailEditorOptions}
                >
                    <RequiredRule message="Username is required"/>
                    <Label visible={false}/>
                </Item>
                <Item
                    dataField={'password'}
                    editorType={'dxTextBox'}
                    editorOptions={passwordEditorOptions}
                >
                    <RequiredRule message="Password is required"/>
                    <Label visible={false}/>
                </Item>
                <Item
                    dataField={'rememberMe'}
                    editorType={'dxCheckBox'}
                    editorOptions={rememberMeEditorOptions}
                >
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
                      : 'Sign In'
              }
            </span>
                    </ButtonOptions>
                </ButtonItem>
                {/*<Item>*/}
                {/*  <div className={'link'}>*/}
                {/*    <Link to={'/reset-password'}>Forgot password?</Link>*/}
                {/*  </div>*/}
                {/*</Item>*/}
                {/*<ButtonItem>*/}
                {/*  <ButtonOptions*/}
                {/*    text={'Create an account'}*/}
                {/*    width={'100%'}*/}
                {/*    onClick={onCreateAccountClick}*/}
                {/*  />*/}
                {/*</ButtonItem>*/}
            </Form>
        </form>
    );
}

