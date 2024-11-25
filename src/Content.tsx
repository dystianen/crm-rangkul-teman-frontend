import React, {useEffect} from 'react';
import {Routes, Route, Navigate} from 'react-router-dom';
import appInfo from './app-info';
import routes from './app-routes';
import {SideNavInnerToolbar as SideNavBarLayout} from './layouts';
import {Footer} from './components';
import {useAppDispatch} from "./hooks/reduxHooks";
import * as MenuReducer from "src/store/slices/menuSlice";

export default function Content() {
    const dispatch = useAppDispatch();
    useEffect(() => {
        dispatch(MenuReducer.doFindAll());
    }, []);

    return (
        <SideNavBarLayout title={appInfo.title}>
            <Routes>
                {routes.map(({ID, title, path, element}) => (
                    <Route
                        key={ID}
                        path={path}
                        element={element}
                    />
                ))}
                <Route
                    path='*'
                    element={<Navigate to='/home'/>}
                />
            </Routes>


            <Footer>
                Copyright © 2011-{new Date().getFullYear()} {appInfo.title} Pte. Ltd.
                <br/>
                All trademarks or registered trademarks are property of their
                respective owners.
            </Footer>
        </SideNavBarLayout>
    );
}

