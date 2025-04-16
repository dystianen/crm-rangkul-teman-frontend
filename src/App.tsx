import LoadPanel from "devextreme-react/load-panel";
import "devextreme/dist/css/dx.common.css";
import { BrowserRouter as Router } from "react-router-dom";
import Content from "./Content";
import { AuthProvider, useAuth } from "./contexts/auth";
import { NavigationProvider } from "./contexts/navigation";
import "./dx-styles.scss";
import "./themes/generated/theme.additional.css";
import "./themes/generated/theme.base.css";
import UnauthenticatedContent from "./UnauthenticatedContent";
import { readToken } from "./utils/localStorage.util";
import { useScreenSizeClass } from "./utils/media-query";

function App() {
  const { loading } = useAuth();

  if (loading) {
    return <LoadPanel visible={true} />;
  }

  return readToken() ? <Content /> : <UnauthenticatedContent />;
}

export default function Root() {
  const screenSizeClass = useScreenSizeClass();

  return (
    <Router>
      <AuthProvider>
        <NavigationProvider>
          <div className={`app ${screenSizeClass}`}>
            <App />
          </div>
        </NavigationProvider>
      </AuthProvider>
    </Router>
  );
}
