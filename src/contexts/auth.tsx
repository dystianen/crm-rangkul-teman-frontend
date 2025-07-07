import React, {useState, useEffect, createContext, useContext, useCallback} from 'react';
import {getUser, logOut, signIn as sendSignInRequest} from '../api/auth';
import type {User, AuthContextType} from '../types';
import {readToken, signOutData} from "../utils/localStorage.util";

function AuthProvider(props: React.PropsWithChildren<unknown>) {
    const [user, setUser] = useState<User>();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        (async function () {
            if (readToken()) {
                const result = await getUser();
                if (result?.isOk) {
                    setUser(result.data);
                }
            } else {
                setUser(undefined);
            }
            setLoading(false);
        })();
    }, []);

    const signIn = useCallback(async (email: string, password: string) => {
        const result = await sendSignInRequest(email, password);
        if (!result?.mustChangePwd) {
            const userData = await getUser();
            if (userData?.isOk) {
                setUser(userData.data);
            } else {
                setUser(result.data); 
            }
        }
        return result;
    }, []);
    

    const signOut = useCallback(() => {
        logOut().then((result) => {
            if (result?.isOk) {
                setUser(undefined);
                signOutData();
                window.location.reload();
            }
        });
    }, []);

    return (
        <AuthContext.Provider value={{user, signIn, signOut, loading}} {...props} />
    );
}

const AuthContext = createContext<AuthContextType>({loading: false} as AuthContextType);
const useAuth = () => useContext(AuthContext);

export {AuthProvider, useAuth}
