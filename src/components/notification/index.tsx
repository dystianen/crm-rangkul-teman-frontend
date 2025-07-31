import { Button, List, Popover } from "devextreme-react";
import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getNotification } from "src/api/whatsapp";
import { dateHandler } from "src/utils/dateUtils";
import "./notification.module.scss";

const Notification = () => {
  const navigate = useNavigate();
  const [notification, setNotification] = useState<any[]>([]);
  const [isPopoverVisible, setPopoverVisible] = useState(false);

  const handleGetNotification = useCallback(async () => {
    const res = await getNotification();
    setNotification(res.notifications);
  }, []);

  // useEffect(() => {
  //   handleGetNotification();
  // }, [handleGetNotification]);

  const handleClickNotification = (item: any) => {
    navigate(`/whatsapp/chat?phone=${item.itemData.sender}`);
    setPopoverVisible(false);
  };

  const renderContent = () => {
    return (
      <div>
        <List
          className="contact-receiver"
          selectionMode="single"
          dataSource={notification}
          onItemClick={handleClickNotification}
          itemRender={renderListItem}
          elementAttr={{ class: "list" }}
          searchExpr="contactName"
          pageLoadMode="scrollBottom"
          width={300}
          hoverStateEnabled={false}
        />
      </div>
    );
  };

  const renderListItem = useCallback(
    (item: any) => (
      <div key={`${item.sender}-key`} id={`contact-${item.sender}`} className={"contact-item"}>
        <div className="name">{item.content}</div>
        <div className="wrapper-message-meta">
          <div className="message-meta">{item.receivedAt && dateHandler(item.receivedAt)}</div>
        </div>
      </div>
    ),
    []
  );

  return (
    <>
      <div id="notification" onClick={() => setPopoverVisible(true)}>
        <Button
          icon="bell"
          type="default"
          stylingMode="text"
          activeStateEnabled={false}
          hoverStateEnabled={false}
        />
        {notification.length > 0 && (
          <span
            style={{
              position: "absolute",
              top: 6,
              right: 10,
              backgroundColor: "red",
              color: "white",
              borderRadius: "50%",
              padding: "4px",
              fontSize: "8px",
              lineHeight: 1,
              transform: "translate(50%, -50%)",
              border: "1px solid white"
            }}
          >
            {notification.length}
          </span>
        )}
      </div>

      <Popover
        target="#notification"
        visible={isPopoverVisible}
        onHiding={() => setPopoverVisible(false)}
        contentRender={renderContent}
        maxHeight={400}
      />
    </>
  );
};

export default Notification;
