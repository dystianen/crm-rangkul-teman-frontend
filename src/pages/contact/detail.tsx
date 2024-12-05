import React, {useEffect, useState} from "react";
import Form, {
    ButtonItem,
    GroupItem,
    Tab,
    TabbedItem,
    Tab as HistoryTab,
    TabbedItem as HistoryTabbedItem,
    Tab as LogTab,
    TabbedItem as LogTabbedItem,
    Item,
    PatternRule,
    RequiredRule,
    SimpleItem,
    AsyncRule
} from "devextreme-react/form";
import TabPanel from "devextreme-react/tab-panel";
import {
    addressOwnershipStore,
    cityStore,
    contactDetailApi,
    countryStore,
    districtStore,
    educationStore,
    genderStore,
    getFile,
    maritalStatusStore,
    provinceStore,
    religionStore,
    selectBoxOptions,
    subDistrictStore, updateContact, validateEmail, validateIdNumber, validatePhone
} from "src/api/contact";
import {useLocation} from "react-router-dom";
import queryString from 'query-string';
import {ContactRequest, initContactValue} from "src/interfaces/contactDto";
import DataSource from "devextreme/data/data_source";
import {formatDate} from "../../utils/dateUtils";
import notify from "devextreme/ui/notify";
import Resizer from "react-image-file-resizer";
import {useNavigate} from "react-router";
import * as Title from "devextreme-react/toolbar";
import {Column, Pager, Paging, Scrolling} from "devextreme-react/data-grid";
import {DataGrid} from "devextreme-react";
import ContactActivity from "../../components/contact/contact-activity";

export default function DetailPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const {id} = queryString.parse(location.search);
    const [contact, setContact] = useState<ContactRequest>(initContactValue);
    const [ktpSrc, setKtpSrc] = useState<any>(undefined);

    const genderOptions = selectBoxOptions(new DataSource(genderStore), "Select gender");
    const religionOptions = selectBoxOptions(new DataSource(religionStore), "Select religion");
    const educationOptions = selectBoxOptions(new DataSource(educationStore), "Select education");
    const maritalStatusOptions = selectBoxOptions(new DataSource(maritalStatusStore), "Select marital status");
    const ownerStatusOptions = selectBoxOptions(new DataSource(addressOwnershipStore), "");
    const countryOptions = selectBoxOptions(new DataSource(countryStore), "");

    const [proviceOptions, setProvinceOptions] = useState({});
    const [cityOptions, setCityOptions] = useState({});
    const [districtOptions, setDistrictOptions] = useState({});
    const [subDistrictOptions, setSubDistrictOptions] = useState({});

    useEffect(() => {
        contactDetailApi(String(id)).then((res: any) => {
            const data: any = {
                idNumber: res.idNumber,
                nameBorrower: res.name,
                birthPlace: res.birthPlace,
                birthDate: res.birthDate,
                idGender: res.genderId,
                idReligion: res.religionId,
                idEducation: res.educationId,
                idMarital: res.maritalId,
                motherMaidenName: res.motherMaidenName,
                lengthOfJob: res?.workExperienceMonth ? res?.workExperienceMonth : 0,

                idCountry: res?.contactAddressCountryId,
                idCity: res?.contactAddressCityId,
                idProvince: res?.contactAddressProvinceId,
                districtId: res?.contactAddressDistrictId,
                subdistrictId: res?.contactAddressSubdistrictId,
                address: res?.contactAddress,
                postalCode: res?.contactAddressPostalCode,
                neighborhoodUnit: res?.contactAddressNeighborhoodUnit,
                communityUnit: res?.contactAddressCommunityUnit,
                livingAddressStatus: res?.contactAddressOwnershipId,

                mobilePhone: res?.contactPhone,
                email: res?.contactEmail,

                ktpImage: "",
            }
            if (res?.contactAddressCountryId) {
                setProvinceOptions(selectBoxOptions(new DataSource(provinceStore(String(res?.contactAddressCountryId))), ""));
            }
            if (res?.contactAddressProvinceId) {
                setCityOptions(selectBoxOptions(new DataSource(cityStore(res?.contactAddressProvinceId)), ""));
            }
            if (res?.contactAddressCityId) {
                setDistrictOptions(selectBoxOptions(new DataSource(districtStore(res?.contactAddressCityId)), ""));
            }
            if (res?.contactAddressDistrictId) {
                setSubDistrictOptions(selectBoxOptions(new DataSource(subDistrictStore(res?.contactAddressDistrictId)), ""));
            }
            if (res?.contactIdentFileUrlPath) {
                getFile(res?.contactIdentFileUrlPath)
                    .then(function (response) {
                        setKtpSrc(response);
                    })
                    .catch((error: any) => {
                        console.error('ERROR:: ', error);
                    });
            }

            setContact(data);
        });
    }, [id]);

    const backButtonOptions = {
        icon: 'back',
        text: "Kembali",
        onClick: () => {
            navigate(-1);
        },
    };
    return (<>
        <h2 className={'content-block'}>Personal Data</h2>
        <div className={'content-block'}>
            <Title.Toolbar className={'dx-card'}>
                <Title.Item location="before"
                            widget="dxButton"
                            options={backButtonOptions}/>
            </Title.Toolbar>
            <div className={'dx-card responsive-paddings'}>
                <form>
                    <Form
                        colCount={2}
                        id="form"
                        formData={contact}
                        showColonAfterLabel={true}
                        showValidationSummary={true}
                        validationGroup="contactData"
                    >
                        <GroupItem colSpan={2}>
                            <GroupItem caption="Personal Data" colCount={2}>
                                <SimpleItem dataField="idNumber" label={{text: "No.KTP"}}
                                            editorOptions={{
                                                readOnly: true,
                                            }}>
                                </SimpleItem>
                                <SimpleItem dataField="nameBorrower" label={{text: "Nama Lengkap"}}
                                            editorOptions={{
                                                readOnly: true,
                                            }}>
                                    <RequiredRule message="Name is required"/>
                                    <PatternRule message="Do not use digits in the Name"
                                                 pattern={/^[^0-9]+$/}/>
                                </SimpleItem>
                                <SimpleItem dataField="birthPlace" label={{text: "Tempat Lahir"}}
                                            editorOptions={{
                                                readOnly: true,
                                            }}>
                                    <RequiredRule message="Place of birth is required"/>
                                </SimpleItem>
                                <SimpleItem dataField="birthDate" label={{text: "Tanggal Lahir"}}
                                            editorType="dxDateBox"
                                            editorOptions={{
                                                readOnly: true,
                                                type: "date",
                                                pickerType: "calender",
                                                displayFormat: "dd/MM/yyyy",
                                            }} >
                                    <RequiredRule message="Date of birth is required"/>
                                </SimpleItem>
                                <SimpleItem dataField="idGender"
                                            label={{text: "Jenis Kelamin"}}
                                            editorType="dxSelectBox" editorOptions={{...genderOptions, readOnly: true}}
                                >
                                    <RequiredRule message="Gender is required"/>
                                </SimpleItem>
                                <SimpleItem dataField="idReligion"
                                            editorType="dxSelectBox" editorOptions={{...religionOptions, readOnly: true}}
                                            label={{text: "Agama"}}>
                                    <RequiredRule message="Religion is required"/>
                                </SimpleItem>
                                <SimpleItem dataField="idEducation"
                                            editorType="dxSelectBox" editorOptions={{...educationOptions, readOnly: true}}
                                            label={{text: "Pendidikan Terakhir"}}>
                                    <RequiredRule message="Last education is required"/>
                                </SimpleItem>
                                <SimpleItem dataField="idMarital"
                                            editorType="dxSelectBox" editorOptions={{...maritalStatusOptions, readOnly: true}}
                                            label={{text: "Marital Status"}}>
                                    <RequiredRule message="Marital status is required"/>
                                </SimpleItem>
                                <SimpleItem dataField="motherMaidenName" label={{text: "Nama Ibu Kandung"}}
                                            editorOptions={{
                                                readOnly: true,
                                            }}>
                                    <RequiredRule message="Mother maiden name is required"/>
                                </SimpleItem>
                                <SimpleItem dataField="lengthOfJob" editorType="dxNumberBox" editorOptions={{min: 0, readOnly: true}}
                                            label={{text: "Lama kerja"}}>
                                    <RequiredRule message="Length of job is required"/>
                                </SimpleItem>
                                <SimpleItem dataField="mobilePhone" label={{text: "No. HP"}}
                                            editorOptions={{
                                                readOnly: true,
                                                mask: "+00 (X00) 000-0000",
                                                maskRules: {X: /[02-9]/},
                                            }}>
                                </SimpleItem>
                                <SimpleItem dataField="email" label={{text: "Email"}}
                                            editorOptions={{
                                                readOnly: true,
                                            }}>
                                </SimpleItem>
                            </GroupItem>
                            <GroupItem colSpan={2}>
                                {ktpSrc && <Item><img id="dropzone-ktp" src={ktpSrc} alt="ktp" width={"240px"}/></Item>}
                            </GroupItem>
                        </GroupItem>
                        <GroupItem colSpan={2}>
                            <GroupItem caption="Alamat Tinggal"
                                       name="HomeAddress" colCount={2}>
                                <SimpleItem dataField="livingAddressStatus"
                                            editorType="dxSelectBox" editorOptions={{...ownerStatusOptions, readOnly: true}}
                                            label={{text: "Status Tempat Tinggal"}}>
                                    <RequiredRule message="Living address status is required"/>
                                </SimpleItem>
                                <SimpleItem dataField="idCountry"
                                            editorType="dxSelectBox" editorOptions={{...countryOptions, readOnly: true}}
                                            label={{text: "Negara"}}/>
                                <SimpleItem dataField="idProvince"
                                            editorType="dxSelectBox" editorOptions={{...proviceOptions, readOnly: true}}
                                            label={{text: "Provinsi"}}>
                                    <RequiredRule message="Province is required"/>
                                </SimpleItem>
                                <SimpleItem dataField="idCity"
                                            editorType="dxSelectBox" editorOptions={{...cityOptions, readOnly: true}}
                                            label={{text: "Kota"}}>
                                    <RequiredRule message="City is required"/>
                                </SimpleItem>
                                <SimpleItem dataField="address" editorType="dxTextArea" label={{text: "Alamat"}}
                                            editorOptions={{
                                                readOnly: true,
                                            }}>
                                    <RequiredRule message="Address is required"/>
                                </SimpleItem>
                                <SimpleItem dataField="districtId"
                                            editorType="dxSelectBox" editorOptions={{...districtOptions, readOnly: true}}
                                            label={{text: "Kecamatan"}}/>
                                <SimpleItem dataField="subdistrictId"
                                            editorType="dxSelectBox" editorOptions={{...subDistrictOptions, readOnly: true}}
                                            label={{text: "Kelurahan"}}/>
                                <SimpleItem dataField="postalCode" editorOptions={{
                                    readOnly: true,
                                }}
                                            label={{text: "Kodepos"}}/>
                                <SimpleItem dataField="neighborhoodUnit"
                                            editorOptions={{
                                                readOnly: true,
                                            }} label={{text: "RT"}}/>
                                <SimpleItem dataField="communityUnit"
                                            editorOptions={{
                                                readOnly: true,
                                            }}
                                            label={{text: "RW"}}/>
                            </GroupItem>
                        </GroupItem>
                    </Form>
                </form>
                <div className="form__tabs">
                    <Form>
                        <TabbedItem
                            tabPanelOptions={{
                                scrollByContent: true,
                                showNavButtons: true,
                            }}
                        >
                            <Tab title="Application">
                                <DataGrid
                                    dataSource={[]}
                                    // focusedRowEnabled={true}
                                    remoteOperations={true}
                                    columnAutoWidth={true}
                                    wordWrapEnabled={false}
                                    showBorders={true}
                                    dateSerializationFormat={"yyyy-MM-ddTHH:mm:ss.SSSxxx"}
                                    repaintChangesOnly={true}
                                >
                                    <Scrolling showScrollbar={"always"}/>

                                    <Column dataField={"no"} caption={"No."}/>
                                    <Column dataField={"name"} caption={"Name"}/>
                                    <Column dataField={"value"} caption={"Value"}/>
                                    <Paging defaultPageSize={50}/>
                                    <Pager
                                        showPageSizeSelector={true}
                                        showInfo={true}
                                        allowedPageSizes={[10, 50, 100]}
                                    />
                                </DataGrid>
                            </Tab>
                            <Tab title="Disbursement">
                                <DataGrid
                                    dataSource={[]}
                                    // focusedRowEnabled={true}
                                    remoteOperations={true}
                                    columnAutoWidth={true}
                                    wordWrapEnabled={false}
                                    showBorders={true}
                                    dateSerializationFormat={"yyyy-MM-ddTHH:mm:ss.SSSxxx"}
                                    repaintChangesOnly={true}
                                >
                                    <Scrolling showScrollbar={"always"}/>

                                    <Column dataField={"no"} caption={"No."}/>
                                    <Column dataField={"name"} caption={"Name"}/>
                                    <Column dataField={"value"} caption={"Value"}/>
                                    <Paging defaultPageSize={50}/>
                                    <Pager
                                        showPageSizeSelector={true}
                                        showInfo={true}
                                        allowedPageSizes={[10, 50, 100]}
                                    />
                                </DataGrid>
                            </Tab>
                            <Tab title="Repayment">
                                <DataGrid
                                    dataSource={[]}
                                    // focusedRowEnabled={true}
                                    remoteOperations={true}
                                    columnAutoWidth={true}
                                    wordWrapEnabled={false}
                                    showBorders={true}
                                    dateSerializationFormat={"yyyy-MM-ddTHH:mm:ss.SSSxxx"}
                                    repaintChangesOnly={true}
                                >
                                    <Scrolling showScrollbar={"always"}/>

                                    <Column dataField={"no"} caption={"No."}/>
                                    <Column dataField={"name"} caption={"Name"}/>
                                    <Column dataField={"value"} caption={"Value"}/>
                                    <Paging defaultPageSize={50}/>
                                    <Pager
                                        showPageSizeSelector={true}
                                        showInfo={true}
                                        allowedPageSizes={[10, 50, 100]}
                                    />
                                </DataGrid>
                            </Tab>
                            <Tab>
                                <ContactActivity contactId={id as string}/>
                            </Tab>
                        </TabbedItem>
                    </Form>
                </div>
            </div>
        </div>
    </>)
}