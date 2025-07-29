import { Popover, Popup } from "devextreme-react";
import { Button } from "devextreme-react/button";
import DropDownButton, { DropDownButtonTypes } from "devextreme-react/drop-down-button";
import FileUploader, { FileUploaderTypes } from "devextreme-react/file-uploader";
import List, { ListTypes } from "devextreme-react/list";
import { LoadPanel } from "devextreme-react/load-panel";
import TextArea from "devextreme-react/text-area";
import EmojiPicker from "emoji-picker-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  getMessage,
  getMessageProfile,
  getReceiver,
  sendMessageFile,
  sendMessageText,
  uploadFile
} from "src/api/whatsapp";
import IconChat from "src/assets/images/chat.png";
import Chip from "src/components/chip";
import { dateHandler } from "../../utils/dateUtils";
import "./index.scss";

// Types
interface Contact {
  phoneNumber: string;
  contactName: string;
  receiveAt: string;
  unreadTotal: number;
}

interface Message {
  id: string;
  category: "RECEIVER" | "SENDER";
  text?: string;
  messageType: "TEXT" | "STICKER" | "IMAGE" | "DOCUMENT";
  mediaUrl?: string;
  createdOn: string;
  sentBy?: string;
}

interface AttachmentType {
  id: "image" | "document";
  name: string;
  icon: string;
}

interface FileAttachment {
  contentType: string;
  attach: string;
}

interface ProfileData {
  contactId: string;
  contractId: string;
  applicationId: string;
  contactType: string;
  isRepeat: boolean | null;
}

// Constants
const ATTACHMENT_TYPES: AttachmentType[] = [
  { id: "image", name: "Image", icon: "image" },
  { id: "document", name: "Document", icon: "file" }
];

const FILE_EXTENSIONS = {
  document: [".docx", ".doc", ".pptx", ".ppt", ".xlsx", ".xls", ".pdf"],
  image: [".jpg", ".jpeg", ".gif", ".png"]
};

const listAttrs = { class: "list" };

const INITIAL_CONTACT: Contact = {
  phoneNumber: "",
  contactName: "",
  receiveAt: new Date().toDateString(),
  unreadTotal: 0
};

export default function WhatsAppChat() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // State management
  const [textMsg, setTextMsg] = useState<string>("");
  const [emojiVisible, setEmojiVisible] = useState<boolean>(false);
  const [attachType, setAttachType] = useState<AttachmentType | null>(null);
  const [receiver, setReceiver] = useState<Contact[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentContact, setCurrentContact] = useState<Contact>(INITIAL_CONTACT);
  const [selectedItemKeys, setSelectedItemKeys] = useState<string[]>([]);
  const [allowedFileExtensions, setAllowedFileExtensions] = useState<string[]>([]);
  const [targetElement, setTargetElement] = useState<HTMLElement>();
  const [fileAttach, setFileAttach] = useState<FileAttachment | null>(null);
  const [loadPanelVisible, setLoadPanelVisible] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [shouldTriggerFileDialog, setShouldTriggerFileDialog] = useState(false);
  const [isListOpen, setIsListOpen] = useState(true);
  const [isMobileView, setIsMobileView] = useState(false);
  const [actionButtons, setActionButtons] = useState<string[]>([]);
  const [justSelectedEmoji, setJustSelectedEmoji] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isPopupImageVisible, setPopupImageVisible] = useState(false);
  const [mediaUrl, setMediaUrl] = useState("");
  const [profile, setProfile] = useState<ProfileData>({
    contactId: "",
    contractId: "",
    applicationId: "",
    contactType: "",
    isRepeat: null
  });

  // Refs
  const textRef = useRef<any>(null);
  const listRefs = useRef<Record<string, HTMLElement>>({});
  const fileUploaderRef = useRef<any>(null);
  const emojiPickerRef = useRef<HTMLDivElement | null>(null);

  const scrollToLatestMessage = useCallback(() => {
    if (messages.length > 0) {
      const latestMsgElement = document.querySelector(`#msg-${messages.length - 1}`);
      latestMsgElement?.scrollIntoView(true);
    }
  }, [messages.length]);

  const resetMessageState = () => {
    setTextMsg("");
    setEmojiVisible(false);
    setAttachType(null);
    setFileAttach(null);
  };

  const resetActionButton = useCallback(() => {
    setActionButtons([]);
    setProfile({
      contactId: "",
      contractId: "",
      applicationId: "",
      contactType: "",
      isRepeat: null
    });
  }, []);

  const handleListSelectionChange = useCallback(
    async (e: ListTypes.SelectionChangedEvent) => {
      try {
        const contact = e.addedItems?.[0] as Contact;
        if (!contact || contact.phoneNumber === currentContact.phoneNumber) return;

        setLoadPanelVisible(true);
        setCurrentContact(contact);
        setSelectedItemKeys([contact.phoneNumber]);
        resetMessageState();
        resetActionButton();

        if (isMobileView) {
          setIsListOpen(false);
        }

        const res = await getMessage(contact.phoneNumber);
        setMessages(res);
        window.history.replaceState(null, "", `?phone=${contact.phoneNumber}`);
      } catch (err) {
        setMessages([]);
        console.error("Error loading message:", err);
      } finally {
        setLoadPanelVisible(false);
      }
    },
    [currentContact.phoneNumber, isMobileView, resetActionButton]
  );

  const handleTextAreaValueChanged = useCallback((value: string) => {
    setTextMsg(value);
  }, []);

  const handleEmoji = useCallback(() => {
    setEmojiVisible((prev) => !prev);
  }, []);

  const onSelectEmoji = useCallback((emojiData: any) => {
    const { emoji } = emojiData;
    const ref = textRef.current;

    if (ref?._element) {
      const textAreaElement = ref._element.querySelector("textarea") as HTMLTextAreaElement;

      if (textAreaElement) {
        const fullText = textAreaElement.value;
        const start = textAreaElement.selectionStart ?? 0;
        const end = textAreaElement.selectionEnd ?? 0;

        const before = fullText.slice(0, start);
        const after = fullText.slice(end);
        const newText = before + emoji + after;

        setTextMsg(newText);

        // Set penanda agar Popover tidak langsung muncul lagi
        setJustSelectedEmoji(true);

        setTimeout(() => {
          textAreaElement.focus();
          const newCursor = start + emoji.length;
          textAreaElement.setSelectionRange(newCursor, newCursor);
          setJustSelectedEmoji(false); // reset setelah fokus
        }, 0);
      }
    } else {
      setTextMsg((prev) => prev + emoji);
    }
  }, []);

  const onItemClick = useCallback((e: DropDownButtonTypes.ItemClickEvent) => {
    const item = e.itemData;
    setAttachType(item);
    if (item.id === "document") {
      setAllowedFileExtensions(FILE_EXTENSIONS.document);
    } else {
      setAllowedFileExtensions(FILE_EXTENSIONS.image);
    }

    setShouldTriggerFileDialog(true);
  }, []);

  const onUploaded = useCallback((e: FileUploaderTypes.UploadedEvent) => {
    const { file } = e;
    if (!file) return;

    const fileReader = new FileReader();
    fileReader.onload = () => {
      if (fileReader.result) {
        setFileAttach({
          contentType: file.type || "application/octet-stream",
          attach: fileReader.result as string
        });
      }
    };
    fileReader.onerror = () => {
      setFileAttach(null);
    };
    fileReader.readAsDataURL(file);
  }, []);

  const onClickSend = useCallback(async () => {
    if (!textMsg.trim() || !currentContact.phoneNumber || isLoading) return;

    setIsLoading(true);
    try {
      const waReq = {
        to: currentContact.phoneNumber,
        content: { text: textMsg.trim() }
      };

      await sendMessageText(waReq);
      const updatedMessages = await getMessage(currentContact.phoneNumber);
      setMessages(Array.isArray(updatedMessages) ? updatedMessages : []);
      setTextMsg("");
    } catch (error) {
      console.error("Failed to send message:", error);
    } finally {
      setIsLoading(false);
    }
  }, [textMsg, currentContact.phoneNumber, isLoading]);

  const hideLoadPanel = useCallback(() => {
    setLoadPanelVisible(false);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(e.target as Node) &&
        e.target instanceof HTMLElement &&
        !e.target.closest("#emoji")
      ) {
        setEmojiVisible(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const initChatFromUrl = async () => {
      const phone = searchParams.get("phone");
      if (phone) {
        try {
          const receivers = await getReceiver();
          const selectedContact = receivers.find((r: Contact) => r.phoneNumber === phone);
          if (selectedContact) {
            setReceiver(receivers);
            setCurrentContact(selectedContact);
            setSelectedItemKeys([selectedContact.phoneNumber]);
            const messages = await getMessage(phone);
            setMessages(Array.isArray(messages) ? messages : []);

            if (isMobileView) {
              setIsListOpen(false);
            }
          }
        } catch (err) {
          console.error("Failed to load chat from URL", err);
        }
      } else {
        const receivers = await getReceiver();
        setReceiver(Array.isArray(receivers) ? receivers : []);
      }
    };

    initChatFromUrl();
  }, [searchParams, isMobileView]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth <= 768);
      if (window.innerWidth > 768) {
        setIsListOpen(true);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (currentContact.phoneNumber) {
      getMessageProfile(currentContact.phoneNumber)
        .then((res) => {
          const { buttons, ...profileData } = res;
          setActionButtons(buttons);
          setProfile(profileData);
        })
        .catch(resetActionButton);
    }
  }, [currentContact.phoneNumber, resetActionButton]);

  useEffect(() => {
    const loadReceivers = async () => {
      try {
        const receivers = await getReceiver();
        setReceiver(Array.isArray(receivers) ? receivers : []);
      } catch (error) {
        console.error("Failed to load receivers:", error);
        setReceiver([]);
      }
    };

    loadReceivers();
  }, []);

  useEffect(() => {
    scrollToLatestMessage();
  }, [scrollToLatestMessage]);

  useEffect(() => {
    const element = document.querySelector(".open-button") as HTMLElement;
    setTargetElement(element);
  }, []);

  useEffect(() => {
    if (shouldTriggerFileDialog && allowedFileExtensions.length > 0) {
      const fileUploadButton = document.querySelector(".open-button") as HTMLElement;
      fileUploadButton?.click();

      setShouldTriggerFileDialog(false);
    }
  }, [shouldTriggerFileDialog, allowedFileExtensions]);

  useEffect(() => {
    const handleFileUpload = async () => {
      if (!attachType || !currentContact.phoneNumber || !fileAttach) return;

      try {
        setIsUploading(true);
        const attachData = fileAttach.attach.includes(",")
          ? fileAttach.attach.split(",")[1]
          : fileAttach.attach;

        const uploadResponse = await uploadFile({
          contentType: fileAttach.contentType,
          attach: attachData
        });

        if (uploadResponse?.path) {
          const pathUrl = `${process.env.REACT_APP_BACKEND}api/file/get/${uploadResponse.path}`;
          const waReq = {
            to: currentContact.phoneNumber,
            content: { mediaUrl: pathUrl }
          };

          await sendMessageFile(attachType.id, waReq);
          const updatedMessages = await getMessage(currentContact.phoneNumber);
          setMessages(Array.isArray(updatedMessages) ? updatedMessages : []);
        }
      } catch (error) {
        console.error("Failed to upload file:", error);
      } finally {
        setAttachType(null);
        setFileAttach(null);
        setIsUploading(false);
      }
    };

    handleFileUpload();
  }, [attachType, currentContact.phoneNumber, fileAttach]);

  const repeatChipElement = useMemo(
    () => (
      <Chip
        label={profile.isRepeat ? "RO" : "New"}
        variant={profile.isRepeat ? "warning" : "success"}
      />
    ),
    [profile.isRepeat]
  );

  const renderListItem = useCallback(
    (item: Contact) => (
      <div
        ref={(el) => {
          if (el) listRefs.current[`receiver-${item.phoneNumber}`] = el;
        }}
        key={`${item.phoneNumber}-key`}
        id={
          item.phoneNumber === currentContact.phoneNumber
            ? "id-item-selected"
            : `contact-${item.phoneNumber}`
        }
        className={
          item.phoneNumber === currentContact.phoneNumber
            ? "contact-item-selected contact-item"
            : "contact-item"
        }
      >
        <div className="contact">
          <div className="wrapper-contact">
            <div className="wrapper-contact-name">
              {profile.isRepeat != null && repeatChipElement}
              <div className="name">{item.contactName}</div>
            </div>
            {item.unreadTotal > 0 && <div className="unread">{item.unreadTotal}</div>}
          </div>
          <div className="wrapper-message-meta">
            <div className="message-meta">{item.receiveAt && dateHandler(item.receiveAt)}</div>
          </div>
        </div>
      </div>
    ),
    [currentContact.phoneNumber, profile.isRepeat, repeatChipElement]
  );

  const renderMessage = useCallback((item: Message, index: number) => {
    const isReceiver = item.category === "RECEIVER";
    const isMediaMessage = ["STICKER", "IMAGE"].includes(item.messageType);
    const isDocumentMessage = item.messageType === "DOCUMENT";
    const hasMediaUrl = item.mediaUrl && item.mediaUrl !== "";
    const isExternalUrl = item.mediaUrl?.includes("http");

    const url = isExternalUrl
      ? `${item.mediaUrl}`
      : `${process.env.REACT_APP_BACKEND}api/file/get/${item.mediaUrl}`;

    return (
      <div
        key={`${item.id}-msg-key`}
        id={`msg-${index}`}
        className={`chat-message ${isReceiver ? "receiver" : "sender"}`}
      >
        <div className={`bubble ${isReceiver ? "receiver" : "sender"}`}>
          {item.text && (
            <div
              className="message-text"
              dangerouslySetInnerHTML={{
                __html: item.text.replace(/\n/g, "<br />")
              }}
            />
          )}

          {isMediaMessage && hasMediaUrl && (
            <div
              style={{ cursor: "pointer" }}
              onClick={() => {
                setMediaUrl(url);
                setPopupImageVisible(true);
              }}
            >
              <img className="chat-image" src={url} alt={item.messageType} />
            </div>
          )}

          {isDocumentMessage && hasMediaUrl && (
            <a href={url} target="_blank" rel="noopener noreferrer" download>
              <Button icon="file" text="Download File" />
            </a>
          )}

          <div className="message-meta">
            <span>{item.createdOn && dateHandler(item.createdOn)}</span>
            {!isReceiver && item.sentBy && <span> • {item.sentBy}</span>}
          </div>
        </div>
      </div>
    );
  }, []);

  return (
    <div className="chat-card">
      {(!isMobileView || isListOpen) && (
        <div className={`left ${!isListOpen ? "closed" : ""}`}>
          <List
            className="contact-receiver"
            selectionMode="single"
            dataSource={receiver}
            searchEnabled={true}
            selectedItemKeys={selectedItemKeys}
            onSelectionChanged={handleListSelectionChange}
            itemRender={renderListItem}
            elementAttr={listAttrs}
            searchExpr="contactName"
            searchMode="contains"
            pageLoadMode="scrollBottom"
          />
        </div>
      )}

      {(!isMobileView || !isListOpen) && (
        <div className="right">
          {currentContact.contactName ? (
            <>
              <div className="header">
                <div className="name-container">
                  {isMobileView && !isListOpen && (
                    <Button
                      icon={"chevronleft"}
                      stylingMode="outlined"
                      onClick={() => {
                        setIsListOpen(!isListOpen);
                        navigate("?", { replace: true });
                      }}
                      hint={isListOpen ? "Tutup daftar kontak" : "Buka daftar kontak"}
                    />
                  )}
                  <div className="wrapper-contact-name">
                    <div className="name">{currentContact.contactName}</div>
                    {profile.isRepeat != null && repeatChipElement}
                  </div>
                </div>
                <div className="action-container">
                  <Button
                    type="danger"
                    visible={actionButtons.includes("Detail Contact")}
                    onClick={() => {
                      if (profile.contactType === "contact") {
                        navigate(`/contact/edit?id=${profile.contactId}`);
                      } else {
                        navigate(`/contact/leads/edit?id=${profile.contactId}`);
                      }
                    }}
                  >
                    Detail Kontak
                  </Button>
                  <Button
                    type="default"
                    visible={actionButtons.includes("Detail Application")}
                    onClick={() => navigate(`/loan-app/detail?id=${profile.applicationId}`)}
                  >
                    Pengajuan Aktif
                  </Button>
                  <Button
                    type="success"
                    visible={actionButtons.includes("Detail Loan")}
                    onClick={() => navigate(`/contract/detail?id=${profile.contractId}`)}
                  >
                    Pinjaman Aktif
                  </Button>
                </div>
              </div>

              <div id="whatsapp-container" className="chat-container">
                <div className="description">
                  {messages.map((item, index) => renderMessage(item, index))}
                </div>
              </div>

              <LoadPanel
                shadingColor="rgb(242, 242, 242, 0.8)"
                position={{ of: "#whatsapp-container" }}
                onHiding={hideLoadPanel}
                visible={loadPanelVisible}
                showIndicator={true}
                shading={true}
                showPane={true}
              />

              <div className="options">
                <div className="options-container">
                  <div className="option tools">
                    <Popover
                      visible={emojiVisible}
                      target="#emoji"
                      position="top"
                      onHiding={() => {
                        if (!justSelectedEmoji) setEmojiVisible(false);
                      }}
                    >
                      <div ref={emojiPickerRef}>
                        <EmojiPicker onEmojiClick={onSelectEmoji} />
                      </div>
                    </Popover>

                    <Button
                      id="emoji"
                      text="😃"
                      className="btn-emoji"
                      stylingMode="outlined"
                      onClick={handleEmoji}
                    />

                    <DropDownButton
                      splitButton={false}
                      useSelectMode={false}
                      text={isUploading ? "Uploading..." : ""}
                      icon={isUploading ? "" : "attach"}
                      items={ATTACHMENT_TYPES}
                      displayExpr="name"
                      keyExpr="id"
                      onItemClick={onItemClick}
                      dropDownOptions={{ width: 125 }}
                      showArrowIcon={!isUploading}
                      disabled={isUploading}
                    />
                  </div>

                  <div className="option textarea">
                    <TextArea
                      ref={textRef}
                      id="msg-textarea"
                      placeholder="Ketik pesan"
                      value={textMsg}
                      onValueChange={handleTextAreaValueChanged}
                      stylingMode="underlined"
                      autoResizeEnabled={true}
                      minHeight={10}
                      maxHeight={120}
                      disabled={isLoading}
                    />
                  </div>

                  <div className="option send">
                    <Button type="default" icon="send" onClick={onClickSend} disabled={isLoading} />
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="empty-state">
              <img src={IconChat} alt="Chat" width={100} height={100} />
              <h2>Belum Ada Pesan yang Dipilih</h2>
              <p>
                Silakan pilih percakapan di sebelah kiri untuk melihat isi pesan.
                <br />
                Anda dapat mulai mengirim atau membalas pesan, serta melihat riwayat obrolan di
                sini.
              </p>
            </div>
          )}
        </div>
      )}

      <FileUploader
        ref={fileUploaderRef}
        dialogTrigger={targetElement}
        className="open-button"
        dropZone={".open-button"}
        uploadMode="instantly"
        uploadUrl={process.env.REACT_APP_BACKEND + "api/vendor/infobip/upload/tmp"}
        onUploaded={onUploaded}
        allowedFileExtensions={allowedFileExtensions}
        accept={allowedFileExtensions.join(",")}
        multiple={false}
        visible={false}
      />

      <Popup
        visible={isPopupImageVisible}
        onHiding={() => setPopupImageVisible(false)}
        showTitle={false}
        dragEnabled={false}
        hideOnOutsideClick
        maxWidth={700}
        height={"auto"}
        maxHeight={"80vh"}
      >
        <div
          style={{
            position: "relative",
            overflow: "hidden"
          }}
        >
          <img src={mediaUrl} alt="Document" style={{ maxWidth: "100%" }} />
        </div>
      </Popup>
    </div>
  );
}
