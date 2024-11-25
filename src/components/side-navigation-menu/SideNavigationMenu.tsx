import React, { useEffect, useRef, useCallback, useState } from "react";
import TreeView from "devextreme-react/tree-view";
import { useNavigation } from "../../contexts/navigation";
import "./SideNavigationMenu.scss";
import type { SideNavigationMenuProps } from "../../types";

import * as events from "devextreme/events";
import { getUserMenu } from "src/api/menu";

export default function SideNavigationMenu(
  props: React.PropsWithChildren<SideNavigationMenuProps>
) {
  const { children, selectedItemChanged, openMenu, compactMode, onMenuReady } =
    props;
  const [menus, setMenus] = useState<any[]>([]);
  // const {isLarge} = useScreenSize();
  useEffect(() => {
    getUserMenu().then((value) => {
      console.log("value",value)
      setMenus(value);
    });
  }, []);
  const {
    navigationData: { currentPath },
  } = useNavigation();

  const treeViewRef = useRef<TreeView>(null);
  const wrapperRef = useRef<HTMLDivElement>();
  const getWrapperRef = useCallback(
    (element: HTMLDivElement) => {
      const prevElement = wrapperRef.current;
      if (prevElement) {
        events.off(prevElement, "dxclick");
      }

      wrapperRef.current = element;
      events.on(element, "dxclick", (e: React.PointerEvent) => {
        openMenu(e);
      });
    },
    [openMenu]
  );

  useEffect(() => {
    const treeView = treeViewRef.current && treeViewRef.current.instance;
    if (!treeView) {
      return;
    }

    if (currentPath !== undefined) {
      treeView.selectItem(currentPath);
      treeView.expandItem(currentPath);
    }

    if (compactMode) {
      treeView.collapseAll();
    }
  }, [currentPath, compactMode]);

  return (
    <div
      className={"dx-swatch-additional side-navigation-menu"}
      ref={getWrapperRef}
    >
      {children}
      <div className={"menu-container"}>
        <TreeView
          ref={treeViewRef}
          items={menus}
          keyExpr={"path"}
          selectionMode={"single"}
          focusStateEnabled={false}
          expandEvent={"click"}
          onItemClick={selectedItemChanged}
          onContentReady={onMenuReady}
          width={"100%"}
        />
      </div>
    </div>
  );
}
