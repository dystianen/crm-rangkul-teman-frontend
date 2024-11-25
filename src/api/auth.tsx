import defaultUser from '../utils/default-user';
import {ajaxGet, ajaxPostLogin} from "./http.api";
import {API_PATH} from "./path_url";
import {persistToken} from "src/utils/localStorage.util";


export async function signIn(email: string, password: string) {
    try {
        // Send request
        const res = await ajaxPostLogin(API_PATH.LOGIN, {
            name: email,
            password: password
        });
        const {mustChangePwd, token, defaultPage} = res;
        if (mustChangePwd) {
            return {
                isOk: true,
                mustChangePwd: mustChangePwd,
                defaultPage: defaultPage,
                data: token,
            };
        } else {
            persistToken(token);
            const profile = await ajaxGet(API_PATH.PROFILE_SESSION);
            return {
                isOk: true,
                mustChangePwd: mustChangePwd,
                defaultPage: defaultPage,
                data: {...defaultUser, email: profile?.data?.contactName}
            };
        }
    } catch {
        return {
            isOk: false,
            message: "Authentication failed"
        };
    }
}

export async function logOut() {
    try {
        const res = await ajaxGet(API_PATH.LOGOUT);
        return {
            isOk: true
        };
    } catch (e) {
        return {
            isOk: false
        };
    }
}

export async function getUser() {
    try {
        // Send request
        const res = await ajaxGet(API_PATH.PROFILE_SESSION);
        if (res?.data?.contactName) {
            return {
                isOk: true,
                data: {...defaultUser, email: res?.data?.contactName}
            };
        }
        return {
            isOk: false
        };
    } catch {
        return {
            isOk: false
        };
    }
}

export async function createAccount(email: string, password: string) {
    try {
        // Send request
        console.log(email, password);

        return {
            isOk: true
        };
    } catch {
        return {
            isOk: false,
            message: "Failed to create account"
        };
    }
}

export async function changePassword(oldPassword: string, newPassword: string, recoveryCode?: string) {
    try {
        const payload = {
            token: recoveryCode,
            oldPassword: oldPassword,
            newPassword: newPassword,
        }
        const res = await ajaxPostLogin(API_PATH.CHANGE_PASSWORD, payload);
        const {mustChangePwd, token, defaultPage} = res;
        persistToken(token);
        const profile = await ajaxGet(API_PATH.PROFILE_SESSION);
        return {
            isOk: true,
            mustChangePwd: mustChangePwd,
            defaultPage: defaultPage,
            data: {...defaultUser, email: profile?.data?.contactName}
        };
    } catch {
        return {
            isOk: false,
            message: "Failed to change password"
        }
    }
}

export async function resetPassword(email: string) {
    try {
        // Send request
        console.log(email);

        return {
            isOk: true
        };
    } catch {
        return {
            isOk: false,
            message: "Failed to reset password"
        };
    }
}
