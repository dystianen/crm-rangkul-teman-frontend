import { useEffect } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import * as MenuReducer from "src/store/slices/menuSlice";
import appInfo from "./app-info";
import routes from "./app-routes";
import { Footer } from "./components";
import { useAppDispatch } from "./hooks/reduxHooks";
import { SideNavOuterToolbar as SideNavBarLayout } from "./layouts";

export default function Content() {
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(MenuReducer.doFindAll());
  }, []);

  return (
    <SideNavBarLayout title={appInfo.title}>
      <Routes>
        {routes.map(({ ID, path, element }) => (
          <Route key={ID} path={path} element={element} />
        ))}
        <Route path="*" element={<Navigate to="/home" />} />
      </Routes>

      <Footer>
        Copyright © 2011-{new Date().getFullYear()} {appInfo.title} Pte. Ltd.
        <br />
        All trademarks or registered trademarks are property of their respective owners.
      </Footer>
    </SideNavBarLayout>
  );
}
