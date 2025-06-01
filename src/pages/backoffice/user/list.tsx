import React, {FC, useRef, useState} from "react";
import {useNavigate} from "react-router";
import DataGrid, {Column, FilterRow, Item, Pager, Paging, Scrolling, Toolbar} from "devextreme-react/data-grid";
import {Button} from "devextreme-react/button";
import ReactDOM from "react-dom/client";
import {OnClickLink} from "../../../components/alink";
import {filterOperation} from "../../../constants/FilterOperation";
import {disableUser, enableUser, listUserStore, resetPasswordUser} from "../../../api/user.api";
import {
  calculateFilterExpressionCustom,
  confirmNotify,
  notifyError,
  notifySuccess
} from "../../../utils/devExtremeUtils";
import UserPopup from "../../../components/backoffice/user/popup";


export const UserListPage: FC = () => {
  const navigate = useNavigate();

  const [notifyPopup, setNotifyPopup] = useState({
    title: "Sukses menambahkan user",
    message: "Telah berhasil dibuat user baru",
    username: "",
    password: "",
    visible: false
  });

  const dataGrid: any = useRef();
  
  return <>
    <div className={"content-block"}>
      <h2>Pengguna</h2>
      <div className={"dx-card"}>
        <DataGrid
            ref={dataGrid}
            dataSource={listUserStore}
            focusedRowEnabled={true}
            remoteOperations={true}
            columnAutoWidth={true}
            wordWrapEnabled={true}
            showBorders={true}
            dateSerializationFormat={"yyyy-MM-ddTHH:mm:ss.SSSxxx"}
            repaintChangesOnly={true}
            editing={{
              allowDeleting: true
            }}
        >
          <Toolbar>
            <Item location="after">
              <Button
                  text="Buat Pengguna"
                  type="default"
                  stylingMode="contained"
                  onClick={()=>navigate("/backoffice/user/create")}
              />
            </Item>
          </Toolbar>
          <Scrolling showScrollbar={"always"} />
          <FilterRow visible={true} />
          <Column
              alignment={"center"}
              dataField={"seqId"}
              caption={"#NO"}
              width={50}
              cellTemplate={function (container: any, options: any) {
                const dom = ReactDOM.createRoot(container);
                dom.render(
                    <OnClickLink
                        onClick={() => {
                          navigate(`/backoffice/user/update?id=${options.data.id}`);
                        }}
                    >
                      {options.data.seqId}
                    </OnClickLink>
                );
              }}
              filterOperations={filterOperation.numeric}
          />
          
          <Column
              dataField={"createdByName"}
              caption={"Dibuat oleh"}
              filterOperations={filterOperation.string}
          />
          <Column
              width={100}
              dataField={"createdOn"}
              caption={"Tanggal Dibuat"}
              dataType={"date"}
              format={"dd MMM yyyy HH:mm:ss"}
              calculateFilterExpression={calculateFilterExpressionCustom}
              filterOperations={filterOperation.date}
          />
          <Column
              dataField={"modifiedByName"}
              caption={"Diubah oleh"}
              filterOperations={filterOperation.string}
          />
          
          <Column
              width={100}
              dataField={"modifiedOn"}
              caption={"Tanggal Diubah"}
              dataType={"date"}
              format={"dd MMM yyyy HH:mm:ss"}
              calculateFilterExpression={calculateFilterExpressionCustom}
              filterOperations={filterOperation.date}
          />
          <Column
              dataField={"name"}
              caption={"Username"}
              filterOperations={filterOperation.string}
          />
          <Column
              dataField={"contactName"}
              caption={"Name"}
              filterOperations={filterOperation.string}
          />
          <Column
              dataField={"contactPhoneNumber"}
              caption={"No. HP"}
              filterOperations={filterOperation.string}
          />
          <Column
              dataField={"contactEmail"}
              caption={"Email"}
              filterOperations={filterOperation.string}
          />
          <Column
              dataField={"listRoleName"}
              caption={"Role"}
              encodeHtml={false}
              cssClass="pre-line"
              filterOperations={filterOperation.string}
          />
          <Column
              dataField={"listBranchName"}
              caption={"Branch"}
              encodeHtml={false}
              cssClass="pre-line"
              filterOperations={filterOperation.string}
          />
          <Column
              dataField={"isActive"}
              caption={"Active"}
              filterOperations={filterOperation.boolean}
              cellTemplate={function (container: any, options: any) {
                const dom = ReactDOM.createRoot(container);
                const active = options.data.isActive ? "true" : "false";
                dom.render(active);
              }}
          />
          <Column
              width={100}
              dataField={"lastActive"}
              caption={"Last Active"}
              dataType="date"
              format="dd MMM yyyy HH:mm:ss"
              calculateFilterExpression={calculateFilterExpressionCustom}
              filterOperations={filterOperation.date}
          />
          
          <Column
              caption={"Action"}
              type={"buttons"}
              alignment={"center"}
              buttons={[
                {
                  hint: "Reset Password",
                  icon: "lock",
                  name: "resetPassword",
                  onClick: function (e: any) {
                    const key = e.row.data.id;
                    confirmNotify(
                        `Apakah yakin reset password user ini #${e.row.data.seqId} ??`
                    ).then((result) => {
                      if (result) {
                        resetPasswordUser(key)
                        .then((rs: any) => {
                          setNotifyPopup((prevState) => ({
                            ...prevState,
                            title: "Reset password berhasil",
                            message: "Password user telah direset",
                            username: rs.username,
                            password: rs.password,
                            visible: true
                          }));

                          e.component.refresh(true).done(function () {
                            e.component.cancelEditData();
                          });
                        })
                        .catch((e) => notifyError(e.message));
                      }
                    });
                    
                    e.event.preventDefault();
                  }
                },
                {
                  hint: "Enable User",
                  icon: "check",
                  name: "enable",
                  
                  onClick: function (e: any) {
                    const key = e.row.data.id;
                    confirmNotify(
                        `Apakah yakin mengaktifkan user ini #${e.row.data.seqId} ??`
                    ).then((result) => {
                      if (result) {
                        enableUser(key)
                        .then((rs: any) => {
                          setNotifyPopup((prevState) => ({
                            ...prevState,
                            title: "User Aktif",
                            message: "User berhasil diaktifkan",
                            username: rs.username,
                            password: rs.password,
                            visible: true
                          }));

                          e.component.refresh(true).done(function () {
                            e.component.cancelEditData();
                          });
                        })
                        .catch((e) => notifyError(e.message));
                      }
                    });
                    
                    e.event.preventDefault();
                  }
                },
                {
                  hint: "Disable User",
                  icon: "close",
                  name: "disable",
                  onClick: function (e: any) {
                    const key = e.row.data.id;
                    confirmNotify(
                        `Apakah yakin disable user ini #${e.row.data.seqId} ??`
                    ).then((result) => {
                      if (result) {
                        disableUser(key)
                        .then((resp: boolean) => {
                          notifySuccess("User sudah dinon-aktifkan");
                          e.component.refresh(true).done(function () {
                            e.component.cancelEditData();
                          });
                        })
                        .catch((e) => notifyError(e.message));
                      }
                    });
                    
                    e.event.preventDefault();
                  }
                }
              ]}
              width={90}
          ></Column>
          <Paging defaultPageSize={50} />
          <Pager showPageSizeSelector={true} showInfo={true} allowedPageSizes={[10, 50, 100]} />
        </DataGrid>
      </div>

      <UserPopup
          title={notifyPopup.title}
          message={notifyPopup.message}
          username={notifyPopup.username}
          password={notifyPopup.password}
          show={notifyPopup.visible}
          handleConfirm={() => {
            setNotifyPopup((prevState) => ({
              ...prevState,
              visible: false
            }));
          }}
      />
    </div>
  </>
}
