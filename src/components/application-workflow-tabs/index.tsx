import { DataGrid } from "devextreme-react";
import { Column, Pager, Paging, Scrolling } from "devextreme-react/cjs/data-grid";
import Form, { Tab, TabbedItem } from "devextreme-react/cjs/form";
import ContactActivity from "../contact/contact-activity";

const ApplicationWorkflowTabs = ({ contactId }: { contactId: string }) => {
  return (
    <div className="form__tabs dx-card responsive-paddings next-card">
      <Form>
        <TabbedItem
          tabPanelOptions={{
            scrollByContent: true,
            showNavButtons: true
          }}
        >
          <Tab title="Application">
            <DataGrid
              dataSource={[]}
              remoteOperations={true}
              columnAutoWidth={true}
              wordWrapEnabled={false}
              showBorders={true}
              dateSerializationFormat={"yyyy-MM-ddTHH:mm:ss.SSSxxx"}
              repaintChangesOnly={true}
            >
              <Scrolling showScrollbar={"always"} />

              <Column dataField={"no"} caption={"No."} />
              <Column dataField={"name"} caption={"Name"} />
              <Column dataField={"value"} caption={"Value"} />
              <Paging defaultPageSize={50} />
              <Pager showPageSizeSelector={true} showInfo={true} allowedPageSizes={[10, 50, 100]} />
            </DataGrid>
          </Tab>
          <Tab title="Disbursement">
            <DataGrid
              dataSource={[]}
              remoteOperations={true}
              columnAutoWidth={true}
              wordWrapEnabled={false}
              showBorders={true}
              dateSerializationFormat={"yyyy-MM-ddTHH:mm:ss.SSSxxx"}
              repaintChangesOnly={true}
            >
              <Scrolling showScrollbar={"always"} />

              <Column dataField={"no"} caption={"No."} />
              <Column dataField={"name"} caption={"Name"} />
              <Column dataField={"value"} caption={"Value"} />
              <Paging defaultPageSize={50} />
              <Pager showPageSizeSelector={true} showInfo={true} allowedPageSizes={[10, 50, 100]} />
            </DataGrid>
          </Tab>
          <Tab title="Repayment">
            <DataGrid
              dataSource={[]}
              remoteOperations={true}
              columnAutoWidth={true}
              wordWrapEnabled={false}
              showBorders={true}
              dateSerializationFormat={"yyyy-MM-ddTHH:mm:ss.SSSxxx"}
              repaintChangesOnly={true}
            >
              <Scrolling showScrollbar={"always"} />

              <Column dataField={"no"} caption={"No."} />
              <Column dataField={"name"} caption={"Name"} />
              <Column dataField={"value"} caption={"Value"} />
              <Paging defaultPageSize={50} />
              <Pager showPageSizeSelector={true} showInfo={true} allowedPageSizes={[10, 50, 100]} />
            </DataGrid>
          </Tab>
          <Tab title="Contact Activity">
            <ContactActivity contactId={contactId} />
          </Tab>
        </TabbedItem>
      </Form>
    </div>
  );
};

export default ApplicationWorkflowTabs;
