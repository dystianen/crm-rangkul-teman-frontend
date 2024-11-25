export const persistToken = (token: string): void => {
    localStorage.setItem('accessToken', token);
};

export const setDebugMode = (debugMode: boolean): void => {
    localStorage.setItem('debugMode', debugMode.toLocaleString());
};

export const debugMode = (): boolean => {
    return localStorage.getItem('debugMode') === 'true' ? true : false;
};

export const readToken = (): string => {
    return localStorage.getItem('accessToken') || '';
};

export const persistUser = (user: any): void => {
    localStorage.setItem('user', JSON.stringify(user));
};

export const readUser = (): any => {
    const userStr = localStorage.getItem('user');
    return userStr !== null ? JSON.parse(userStr) : null;
};

export const signOutData = (): void => localStorage.clear();
export const deleteToken = (): void => localStorage.removeItem('accessToken');
export const deleteUser = (): void => localStorage.removeItem('user');

interface storageResult {
    data: any;
    expireTime: any;
}

export const setStorageWithExpiration = (key: string, value: any, minit: number) => {
    const result: storageResult = {
        data: value,
        expireTime: 0,
    };

    if (minit) {
        result.expireTime = Date.now() + minit * 60 * 1000;
    }
    return localStorage.setItem(key, JSON.stringify(result));
};

export const getStorageWithExpiration = (key: string) => {
    const result: storageResult = JSON.parse(String(localStorage.getItem(key)));

    if (result) {
        if (result.expireTime <= Date.now()) {
            localStorage.removeItem(key);
            return null;
        }
        return result.data;
    }
    //return null if key not found
    return null;
};
