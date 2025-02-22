import DataGrid, { Column, Pager, Paging } from "devextreme-react/data-grid";
import DataSource from "devextreme/data/data_source";
import React, { useCallback, useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom/client";
import { loanDocumentListStore } from "src/api/apploan";
import ButtonDoc from "../doc-viewer/ButtonDoc";
import DocumentForm from "./DocumentForm";

interface DocumentCardProps {
  appId: string;
  disabled?: boolean;
}

interface DocumentFormData {
  id?: string;
  typeId: string;
  name: string;
  urlPath: string;
}

const INITIAL_FORM_DATA: DocumentFormData = {
  id: undefined,
  typeId: "",
  name: "",
  urlPath: ""
};

interface FileData {
  id?: string;
  typeName: string;
  urlPath: string;
  name: string;
  typeId: string;
}

const ButtonDocCell = React.memo<{ data: FileData }>(({ data }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const rootRef = useRef<ReactDOM.Root | null>(null);

  useEffect(() => {
    if (containerRef.current && !rootRef.current) {
      rootRef.current = ReactDOM.createRoot(containerRef.current);
      rootRef.current.render(<ButtonDoc fileUrl={data?.urlPath} fileName={data?.name} />);
    }

    return () => {
      if (rootRef.current) {
        rootRef.current.unmount();
        rootRef.current = null;
      }
    };
  }, [data?.urlPath, data?.name]);

  return <div ref={containerRef} />;
});

const DocumentCard: React.FC<DocumentCardProps> = ({ appId, disabled = false }) => {
  const [formData, setFormData] = useState<DocumentFormData>(INITIAL_FORM_DATA);
  const [isModalVisible, setModalVisible] = useState(false);

  const documentListStoreRef = useRef(new DataSource(loanDocumentListStore(appId)));
  const documentListStore = documentListStoreRef.current;

  const refreshData = useCallback(() => {
    documentListStoreRef.current.reload();
  }, []);

  const handleOpen = useCallback((formData: DocumentFormData) => {
    setFormData(formData);
    setModalVisible(true);
  }, []);

  const handleSubmit = useCallback(() => {
    refreshData();
    setFormData(INITIAL_FORM_DATA);
    setModalVisible(false);
  }, [refreshData]);

  const handleClose = useCallback(() => {
    setModalVisible(false);
    setFormData(INITIAL_FORM_DATA);
  }, []);

  return (
    <>
      <div className="dx-card responsive-paddings next-card">
        <h3 style={{ marginBottom: disabled ? 16 : 0 }}>Documents</h3>
        <DataGrid
          dataSource={documentListStore}
          columnAutoWidth
          wordWrapEnabled={false}
          showBorders
          dateSerializationFormat="yyyy-MM-ddTHH:mm:ss.SSSxxx"
          repaintChangesOnly
          {...(!disabled && {
            onToolbarPreparing: (e: any) => {
              const items = e.toolbarOptions.items;
              items.unshift({
                location: "after",
                widget: "dxButton",
                options: {
                  hint: "Add new",
                  icon: "add",
                  onClick: handleOpen
                }
              });
            },
            editing: {
              allowUpdating: true,
              allowDeleting: true
            }
          })}
        >
          <Column
            caption="No."
            width={70}
            alignment="center"
            allowSorting={false}
            cellTemplate={(container, options) => {
              container.innerText = options.rowIndex + 1;
            }}
          />
          <Column dataField="typeName" caption="File Type" allowSorting={false} />
          <Column
            dataField="typeId"
            caption="File"
            cellRender={({ data }) => <ButtonDocCell data={data} />}
            allowSorting={false}
          />
          <Column
            type={"buttons"}
            buttons={[
              {
                name: "edit",
                onClick: function (e: any) {
                  handleOpen(e.row.data);
                  e.event.preventDefault();
                }
              },
              {
                name: "delete"
              }
            ]}
          />
          <Paging defaultPageSize={50} />
          <Pager showPageSizeSelector showInfo allowedPageSizes={[10, 50, 100]} />
        </DataGrid>
      </div>
      <DocumentForm
        appId={appId}
        documentData={formData}
        isModalVisible={isModalVisible}
        onSubmit={handleSubmit}
        onCloseModal={handleClose}
        contactId={appId}
      />
    </>
  );
};

export default React.memo(DocumentCard);
