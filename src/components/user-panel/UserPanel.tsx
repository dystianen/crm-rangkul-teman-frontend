import ContextMenu, { Position } from "devextreme-react/context-menu";
import List from "devextreme-react/list";
import { useMemo } from "react";
import { useAuth } from "../../contexts/auth";
import type { UserPanelProps } from "../../types";
import "./UserPanel.scss";

export default function UserPanel({ menuMode }: UserPanelProps) {
  const { user, signOut } = useAuth();

  const menuItems = useMemo(
    () => [
      {
        text: "Logout",
        icon: "runner",
        onClick: signOut
      }
    ],
    [signOut]
  );
  return (
    <div className={"user-panel"}>
      <div className={"user-info"}>
        <div className={"image-container"}>
          <div
            style={{
              background: `url(${user!.avatarUrl}) no-repeat #fff`,
              backgroundSize: "cover"
            }}
            className={"user-image"}
          />
        </div>
        <div className={"user-name"}>{user!.email}</div>
      </div>

      {menuMode === "context" && (
        <ContextMenu
          items={menuItems}
          target={".user-button"}
          showEvent={"dxclick"}
          width={210}
          cssClass={"user-menu"}
        >
          <Position my={{ x: "center", y: "top" }} at={{ x: "center", y: "bottom" }} />
        </ContextMenu>
      )}
      {menuMode === "list" && <List className={"dx-toolbar-menu-action"} items={menuItems} />}
    </div>
  );
}
