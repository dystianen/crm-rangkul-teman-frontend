import "./index.scss";
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import TextArea, {TextAreaTypes} from 'devextreme-react/text-area';
import {Button} from "devextreme-react/button";
import List, {ListTypes} from 'devextreme-react/list';
import {getMessage, getReceiver, sendMessageFile, sendMessageText, uploadFile} from "src/api/whatsapp";
import {SelectBoxTypes} from "devextreme-react/select-box";
import {dateHandler} from "../../utils/dateUtils";
import {IPopoverOptions, Popover} from 'devextreme-react/popover';
import EmojiPicker from "emoji-picker-react";
import DropDownButton, {DropDownButtonTypes} from 'devextreme-react/drop-down-button';
import FileUploader, {FileUploaderTypes} from 'devextreme-react/file-uploader';
import {LoadPanel} from 'devextreme-react/load-panel';

const listAttrs = {class: 'list'};

export default function Index() {
    const [textMsg, setTxtMsg] = useState("");
    const textRef: any = useRef();
    const [cursorPosition, setCursorPosition]: any = useState();
    const [emojiVisible, setEmojiVisible] = useState(false);

    const [attachType, setAttachType]: any = useState(undefined);
    const [receiver, setReceiver]: any[] = useState([]);
    const [messages, setMessage]: any[] = useState([]);
    const [currentContact, setCurrentContact] = useState({
        phoneNumber: "",
        contactName: "",
        receiveAt: new Date().toDateString(),
        unreadTotal: 0
    });

    // useEffect(() => {
    //     const interval = setInterval(() => getReceiver().then((rsp: any) => {
    //         setReceiver(rsp);
    //     }), 15000);
    //     return () => clearInterval(interval);
    // }, []);

    const [selectedItemKeys, setSelectedItemKeys] = useState([currentContact?.phoneNumber]);
    const handleListSelectionChange = useCallback((e: ListTypes.SelectionChangedEvent) => {
        const contact = e.addedItems[0];
        setLoadPanelVisible(true);
        setCurrentContact(contact);
        setSelectedItemKeys([contact?.phoneNumber]);
        getMessage(contact?.phoneNumber)
            .then((rsp: any) => {
                setMessage(rsp);
                setLoadPanelVisible(false);
            });

        // getReceiver().then((rsp: any) => {
        //     setReceiver(rsp);
        //     setLoadPanelVisible(false);
        // });

        e.component.scrollToItem(contact);
    }, [setCurrentContact, setSelectedItemKeys]);

    useEffect(() => {
        getReceiver().then((rsp: any) => setReceiver(rsp));
    }, []);

    useEffect(() => {
        let msgWAFocus = document.querySelector(`#msg-${messages.length - 1}`);
        msgWAFocus?.scrollIntoView(true);
    }, [messages]);

    useEffect(() => {
        if (currentContact.phoneNumber.length > 0) {
            listRefs.current["receiver-" + currentContact.phoneNumber].scrollIntoView({behavior: 'smooth'});
        }
    }, [currentContact]);

    const [searchMode, setSearchMode] = useState<ListTypes.Properties['searchMode']>('contains');

    const onSearchModeChange = useCallback((args: SelectBoxTypes.ValueChangedEvent) => {
        setSearchMode(args.value);
    }, [setSearchMode]);

    const onTextAreaValueChanged = (e: any) => setTxtMsg(e);

    const handleEmoji = useCallback(() => {
        if (emojiVisible) {
            setEmojiVisible(false);
        } else {
            setEmojiVisible(true);
        }
    }, [emojiVisible, setEmojiVisible]);

    const onSelectEmoji = (emojiData: any, e: any) => {
        const {emoji} = emojiData;
        const ref = textRef.current;
        console.log("emoji selected", textMsg, emoji, ref);
        if (ref) {
            const txtArea = ref._element.children[0].children[0].children[2];
            if (txtArea) {
                txtArea.focus();
                const start = ref.props.value.substring(0, txtArea.selectionStart);
                const end = ref.props.value.substring(txtArea.selectionStart);
                const newText = start + emoji + end;
                setTxtMsg(newText);
                setCursorPosition(start.length + emoji.length);
            }
        }
        setEmojiVisible(false);
    }

    const onItemClick = useCallback((e: DropDownButtonTypes.ItemClickEvent) => {
        setAttachType(e.itemData);
        if (e.itemData.id == "document") {
            setFileExtensionAllow([".docx", '.doc', '.pptx', '.ppt', '.xlsx', '.xls', '.pdf']);
        } else {
            setFileExtensionAllow([".jpg", '.jpeg', '.gif', '.png']);
        }
    }, []);

    const [allowedFileExtensions, setFileExtensionAllow]: any[] = useState([]);
    const [targetElement, setTargetElement]: any = useState(null);
    const [fileAttach, setFileAttach]: any = useState<any>(undefined);
    useEffect(() => {
        setTargetElement(document.querySelector('.open-button'));
    }, []);
    useEffect(() => {
        if (currentContact?.phoneNumber != "") {
            let fileUpload: any = document.querySelector('.open-button');
            fileUpload?.click();
        }
    }, [allowedFileExtensions]);
    const onUploaded = useCallback((e: FileUploaderTypes.UploadedEvent) => {
        const {file} = e;
        const fileReader = new FileReader();
        console.log("file", file);
        fileReader.onload = () => {
            setFileAttach({contentType: file?.type, attach: fileReader.result});
        };
        fileReader.readAsDataURL(file);
    }, []);

    useEffect(() => {
        if (attachType && currentContact?.phoneNumber != "" && fileAttach) {
            const attach = fileAttach?.attach ? fileAttach?.attach.split(",")[1] : null;
            uploadFile({contentType: fileAttach.contentType, attach})
                .then((rsp: any) => {
                    const pathUrl = process.env.REACT_APP_BACKEND + "api/file/get/" + rsp?.path;
                    const waReq = {
                        to: currentContact?.phoneNumber,
                        content: {
                            mediaUrl: pathUrl,
                        }
                    };
                    sendMessageFile(attachType?.id, waReq)
                        .then(() => getMessage(currentContact?.phoneNumber)
                            .then((rsp: any) => setMessage(rsp)));
                });
        }
    }, [fileAttach]);

    const onClickSend = () => {
        if (textMsg != "" && currentContact?.phoneNumber != "") {
            const waReq = {
                to: currentContact?.phoneNumber,
                content: {
                    text: textMsg,
                }
            };
            sendMessageText(waReq)
                .then(() => getMessage(currentContact?.phoneNumber)
                    .then((rsp: any) => {
                        setMessage(rsp);
                        setTxtMsg("");
                    }));
        }
    }

    const [loadPanelVisible, setLoadPanelVisible] = useState(false);
    const hideLoadPanel = useCallback(() => {
        setLoadPanelVisible(false);
    }, [setLoadPanelVisible]);

    const listRefs: React.MutableRefObject<any[]> = useRef([]);
    const renderListItem = (item: any, i: any) => (
        <div ref={(el) => (listRefs.current["receiver-" + item.phoneNumber] = el)} key={item.phoneNumber + "-key"}
             id={item.phoneNumber == currentContact.phoneNumber ? "id-item-selected" : "contact-" + item.phoneNumber}
             className={item.phoneNumber == currentContact.phoneNumber ? "contact-item-selected contact-item" : "contact-item"}>
            <div className={"contact"}>
                <div className="name">{item.contactName}</div>
                {item.unreadTotal > 0 && <div className="unread">{`${item.unreadTotal}`}</div>}<br/>
                <div className={`receive pull-right`}>{item?.receiveAt && dateHandler(item.receiveAt)}</div>
            </div>
        </div>
    );

    // const onFocusedItem = (e: any) => {
    //     e.component.scrollToItem(currentContact);
    // };
    return (<>
        <div className={"chat-card"}>
            <div className="left">
                <List
                    className={"contact-receiver"}
                    selectionMode="single"
                    dataSource={receiver}
                    searchEnabled={true}
                    selectedItemKeys={selectedItemKeys}
                    onSelectionChanged={handleListSelectionChange}
                    itemRender={renderListItem}
                    elementAttr={listAttrs}
                    searchExpr="contactName"
                    searchMode={searchMode}
                    pageLoadMode="scrollBottom"
                />
            </div>

            <div className="right">
                <div className="header">
                    <div className="name-container">
                        <div className="name">{currentContact?.contactName}</div>
                    </div>
                </div>
                <div id={"whatsapp-container"} className={"chat-container"}>
                    <div className="description">
                        {messages.map((item: any, index: any) => {
                            // console.log("messages", item, index);
                            return <div key={item?.id + "msg-key"} id={"msg-" + index}>
                                {(item?.category == "RECEIVER") && <>
                                    <div className="row message-body">
                                        <div className="col-sm-12 message-main-receiver">
                                            <div className="receiver">
                                                {item?.text && <div className="message-text"><span
                                                    dangerouslySetInnerHTML={{__html: item?.text.replaceAll('\n', '<br />')}}></span>
                                                </div>}
                                                {(['STICKER', 'IMAGE'].includes(item?.messageType) && item?.mediaUrl !== "") &&
                                                    <img width={"25%"}
                                                         src={process.env.REACT_APP_BACKEND + "api/file/get/" + item?.mediaUrl}/>}
                                                {(['DOCUMENT'].includes(item?.messageType) && item?.mediaUrl !== "" && !item?.mediaUrl.includes("http")) &&
                                                    <a href={process.env.REACT_APP_BACKEND + "api/file/get/" + item?.mediaUrl}
                                                       target="_blank"
                                                       rel="noopener noreferrer" download>
                                                        <Button icon={'file'} text={"file"}/>
                                                    </a>}
                                                <div
                                                    className="message-time pull-right">{item?.createdOn && dateHandler(item?.createdOn)}</div>
                                            </div>
                                        </div>
                                    </div>
                                </>}
                                {(item?.category == "SENDER") && <>
                                    <div className="row message-body">
                                        <div className="col-sm-12 message-main-sender">
                                            <div className="sender pull-right">
                                                {(item?.text) && <div className="message-text"><span
                                                    dangerouslySetInnerHTML={{__html: item?.text.replaceAll('\n', '<br />')}}></span>
                                                </div>}
                                                {(['STICKER', 'IMAGE'].includes(item?.messageType) && item?.mediaUrl !== "" && !item?.mediaUrl.includes("http")) &&
                                                    <img width={"25%"}
                                                         src={process.env.REACT_APP_BACKEND + "api/file/get/" + item?.mediaUrl}/>}
                                                {(['STICKER', 'IMAGE'].includes(item?.messageType) && item?.mediaUrl !== "" && item?.mediaUrl.includes("http")) &&
                                                    <img width={"25%"}
                                                         src={item?.mediaUrl}/>}
                                                {(['DOCUMENT'].includes(item?.messageType) && item?.mediaUrl !== "" && !item?.mediaUrl.includes("http")) &&
                                                    <a href={process.env.REACT_APP_BACKEND + "api/file/get/" + item?.mediaUrl}
                                                       target="_blank"
                                                       rel="noopener noreferrer" download>
                                                        <Button icon={'file'} text={"file"}/>
                                                    </a>}
                                                {(['DOCUMENT'].includes(item?.messageType) && item?.mediaUrl !== "" && item?.mediaUrl.includes("http")) &&
                                                    <a href={item?.mediaUrl} target="_blank" rel="noopener noreferrer"
                                                       download>
                                                        <Button icon={'file'} text={"file"}/>
                                                    </a>}
                                                <div
                                                    className="message-time pull-right">{item?.createdOn && dateHandler(item?.createdOn)}</div>
                                                <div
                                                    className="message-time pull-right">Sent by: {item?.sentBy}</div>
                                            </div>
                                        </div>
                                    </div>
                                </>}
                            </div>;
                        })}
                    </div>
                </div>
                <LoadPanel
                    shadingColor="rgba(0,0,0,0.4)"
                    position={{of: '#whatsapp-container'}}
                    onHiding={hideLoadPanel}
                    visible={loadPanelVisible}
                    showIndicator={true}
                    shading={true}
                    showPane={true}
                />
                <div className="options">
                    <div className="options-container">
                        <Popover
                            visible={emojiVisible}
                            target="#emoji"
                            position={"top"}
                        ><EmojiPicker onEmojiClick={onSelectEmoji}/></Popover>
                        <div className="option">
                            <Button id="emoji" text={"😃"} className={"btn-emoji"}
                                    onClick={handleEmoji}/>
                            <DropDownButton
                                splitButton={false}
                                useSelectMode={false}
                                text=" "
                                icon="attach"
                                items={[
                                    {id: "image", name: 'Image', icon: 'image'},
                                    {id: "document", name: 'Document', icon: 'file'}]}
                                displayExpr="name"
                                keyExpr="id"
                                onItemClick={onItemClick}
                                dropDownOptions={{width: 125}}
                            />
                            <FileUploader
                                className="open-button"
                                dialogTrigger={targetElement}
                                dropZone={".open-button"}
                                multiple={false}
                                visible={false}
                                allowedFileExtensions={allowedFileExtensions}
                                uploadMode="instantly"
                                uploadUrl={process.env.REACT_APP_BACKEND + "api/vendor/infobip/upload/tmp"}
                                onUploaded={onUploaded}
                            ></FileUploader>
                        </div>
                        <div className="option">
                            <div className="textarea-wrapper">
                                <TextArea
                                    ref={textRef}
                                    id={"msg-textarea"}
                                    autoResizeEnabled={false}
                                    placeholder={"Ketik pesan"}
                                    value={textMsg}
                                    onValueChange={onTextAreaValueChanged}
                                />
                            </div>
                        </div>
                        <div className="option">
                            <div className="btn-send">
                                <Button text={" "} icon="send"
                                        onClick={onClickSend}/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </>)
}
