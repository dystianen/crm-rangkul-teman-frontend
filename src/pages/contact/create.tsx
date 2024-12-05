import React, {useEffect, useRef, useState} from "react";
import Form, {
    ButtonItem,
    GroupItem,
    Item,
    PatternRule,
    RequiredRule,
    SimpleItem,
    AsyncRule,
} from "devextreme-react/form";
import {
    addressOwnershipStore,
    cityStore, contactRelativeStore,
    countryStore,
    createContact,
    districtStore,
    educationStore,
    genderStore,
    maritalStatusStore,
    provinceStore,
    religionStore, salesChannelStore,
    selectBoxOptions,
    subDistrictStore,
    validateEmail,
    validateIdNumber,
    validatePhone,
} from "src/api/contact";
import DataSource from "devextreme/data/data_source";
import "devextreme-react/file-uploader";
import "./contact.scss";
import {ContactRelativeDto, ContactRequest, initContactValue} from "src/interfaces/contactDto";
import {formatDate} from "src/utils/dateUtils";
import notify from "devextreme/ui/notify";
import Resizer from "react-image-file-resizer";
import {useNavigate} from "react-router";
import {useLocation} from "react-router-dom";
import queryString from "query-string";
import * as Title from "devextreme-react/toolbar";
import "devextreme-react/date-box";
import {createAppLoanOnboarding} from "../../api/apploan";
import {Column, Lookup, Pager, Paging, Scrolling} from "devextreme-react/data-grid";
import {DataGrid} from "devextreme-react";

export default function Create() {
    const navigate = useNavigate();
    const location = useLocation();
    const {ktp, branchId, productId, backTo} = queryString.parse(location.search);
    const [contact, setContact] = useState<ContactRequest>(initContactValue);
    const [ktpSrc, setKtpSrc] = useState<any>(undefined);
    const formRef = useRef<Form>(null);
    const [birthDate, setBirthDate] = useState(new Date(1989, 12, 1));
    const [isLoading, setLoading] = useState(false);
    const [contactRelatives, setContactRelatives] = useState<ContactRelativeDto[]>([]);

    const salesChannelOptions = selectBoxOptions(
        new DataSource(salesChannelStore),
        "Select Sales channel"
    );

    const relativeOptions = selectBoxOptions(
        new DataSource(contactRelativeStore),
        "Select Relation"
    );

    const genderOptions = selectBoxOptions(
        new DataSource(genderStore),
        "Select gender"
    );
    const religionOptions = selectBoxOptions(
        new DataSource(religionStore),
        "Select religion"
    );
    const educationOptions = selectBoxOptions(
        new DataSource(educationStore),
        "Select education"
    );
    const maritalStatusOptions = selectBoxOptions(
        new DataSource(maritalStatusStore),
        "Select marital status"
    );
    const ownerStatusOptions = selectBoxOptions(
        new DataSource(addressOwnershipStore),
        ""
    );
    const countryOptions = selectBoxOptions(new DataSource(countryStore), "");

    const [proviceOptions, setProvinceOptions] = useState({});
    const [cityOptions, setCityOptions] = useState({});
    const [districtOptions, setDistrictOptions] = useState({});
    const [subDistrictOptions, setSubDistrictOptions] = useState({});
    useEffect(() => {
        if (!ktp) {
            navigate("/contact");
        }
    }, [ktp, navigate]);
    const onFileChanged = (e: any) => {
        if (e.value.length > 0) {
            try {
                Resizer.imageFileResizer(
                    e.value[0],
                    1772,
                    1181,
                    "JPEG",
                    100,
                    0,
                    (uri) => {
                        setKtpSrc(uri);
                    },
                    "base64",
                    900,
                    400
                );
            } catch (err) {
                console.log(err);
            }
        }
    };

    const uploadKtpOptions = {
        selectButtonText: "Select photo",
        accept: "image/*",
        uploadMode: "useForm",
        onValueChanged: onFileChanged,
    };

    const handleSubmit = (e: any) => {
        const form = formRef.current!.instance;
        let request = {
            ...contact,
            birthDate: formatDate(birthDate),
            ktpImage: ktpSrc,
            idNumber: ktp,
            branchId: branchId,
            contactRelatives: contactRelatives
        };
        console.log("request create", request, ktp);
        createContact(request).then(() => {
            setContact(initContactValue);
            form.resetValues();
            notify({
                message: "Berhasil submit data",
                position: {
                    my: "center top",
                    at: "center top",
                },
            }, "success", 15000);
            if (backTo) {
                createAppLoanOnboarding({
                    branchId: branchId,
                    productId: productId,
                    contactIdentity: ktp,
                }).then((res) => {
                    navigate(`/loan-app/create/step/1/?id=${res.appId}`);
                });
            } else {
                navigate("/contact");
            }
        });
        e.preventDefault();
    };

    const onFieldDataChanged = (evt: any) => {
        if (evt.dataField === "idCountry" && evt.value != null) {
            setProvinceOptions(
                selectBoxOptions(new DataSource(provinceStore(evt.value)), "")
            );
        }
        if (evt.dataField === "idProvince" && evt.value != null) {
            setCityOptions(
                selectBoxOptions(new DataSource(cityStore(evt.value)), "")
            );
        }
        if (evt.dataField === "idCity" && evt.value != null) {
            setDistrictOptions(
                selectBoxOptions(new DataSource(districtStore(evt.value)), "")
            );
        }
        if (evt.dataField === "districtId" && evt.value != null) {
            setSubDistrictOptions(
                selectBoxOptions(new DataSource(subDistrictStore(evt.value)), "")
            );
        }
        contact[evt.dataField] = evt.value;
    };

    const asyncValidationIdNumber = (params: any) => {
        const request = {
            idNumber: params.value,
            contactId: "",
        };
        return validateIdNumber(request);
    };

    const asyncValidationPhoneNumber = (params: any) => {
        const request = {
            phoneNumber: params.value,
            contactId: "",
        };
        return validatePhone(request);
    };

    const asyncValidationEmail = (params: any) => {
        const request = {
            email: params.value,
            contactId: "",
        };
        return validateEmail(request);
    };

    const backButtonOptions = {
        icon: "back",
        text: "Back",
        onClick: () => {
            navigate("/contact");
        },
    };
    const onValueChanged = (e: any) => {
        setBirthDate(e.value);
    };

    return (<>
        <h2 className={"content-block"}>Create Contact</h2>
        <div className={"content-block"}>
            <Title.Toolbar>
                <Title.Item
                    location="before"
                    widget="dxButton"
                    options={backButtonOptions}
                />
            </Title.Toolbar>
            <form action="register" onSubmit={handleSubmit}>
                <Form
                    ref={formRef}
                    colCount={2}
                    id="form"
                    formData={contact}
                    showColonAfterLabel={true}
                    showValidationSummary={true}
                    validationGroup="contactData"
                    onFieldDataChanged={onFieldDataChanged}
                >
                    <GroupItem colSpan={2} cssClass={"dx-card responsive-paddings next-card"}>
                        <GroupItem caption="Personal Data" colCount={2}>
                            <SimpleItem
                                dataField="idNumber"
                                label={{text: "No.KTP"}}
                                editorOptions={{
                                    min: 0,
                                    maxLength: 20,
                                    onKeyDown: (e: any) => {
                                        const key = e.event.key;
                                        e.value = String.fromCharCode(e.event.keyCode);
                                        if (
                                            !/[0-9]/.test(e.value) &&
                                            key !== "Backspace" &&
                                            key !== "Delete"
                                        )
                                            e.event.preventDefault();
                                    },
                                    value: ktp,
                                    disabled: true,
                                }}
                            >
                                <RequiredRule message="No.KTP wajib diisi"/>
                                <AsyncRule
                                    message="No.KTP sudah terdaftar"
                                    validationCallback={asyncValidationIdNumber}
                                />
                                <PatternRule
                                    message="Hanya boleh angka"
                                    pattern={/^[0-9]+$/}
                                />
                            </SimpleItem>
                            <SimpleItem dataField="nameBorrower" label={{text: "Nama"}}
                                        editorOptions={{
                                            min: 0,
                                            maxLength: 150,
                                            onKeyDown: (e: any) => {
                                                const key = e.event.key;
                                                e.value = String.fromCharCode(e.event.keyCode);
                                                if (
                                                    !/[A-Za-z]/.test(e.value) &&
                                                    key !== " " &&
                                                    key !== "Backspace" &&
                                                    key !== "Delete"
                                                )
                                                    e.event.preventDefault();
                                            },
                                        }}
                            >
                                <RequiredRule message="Nama wajib diisi"/>
                                <PatternRule
                                    message="Tidak boleh angka"
                                    pattern={/^[^0-9]+$/}
                                />
                            </SimpleItem>
                            <SimpleItem
                                dataField="birthPlace"
                                label={{text: "Tempat lahir"}}
                            >
                                <RequiredRule message="Tempat lahir wajib diisi"/>
                            </SimpleItem>
                            <SimpleItem
                                dataField="birthDate"
                                label={{text: "Tanggal lahir"}}
                                editorType="dxDateBox"
                                editorOptions={{
                                    value: birthDate,
                                    type: "date",
                                    pickerType: "calender",
                                    displayFormat: "dd/MM/yyyy",
                                    onValueChanged: onValueChanged,
                                }}
                            >
                                <RequiredRule message="Tanggal wajib diisi"/>
                            </SimpleItem>
                            <SimpleItem
                                dataField="idGender"
                                label={{text: "Jenis kelamin"}}
                                editorType="dxSelectBox"
                                editorOptions={genderOptions}
                            >
                                <RequiredRule message="Jenis kelamin wajib diisi"/>
                            </SimpleItem>
                            <SimpleItem
                                dataField="idReligion"
                                editorType="dxSelectBox"
                                editorOptions={religionOptions}
                                label={{text: "Agama"}}
                            >
                                <RequiredRule message="Agama wajib diisi"/>
                            </SimpleItem>
                            <SimpleItem
                                dataField="idEducation"
                                editorType="dxSelectBox"
                                editorOptions={educationOptions}
                                label={{text: "Pendidikan terakhir"}}
                            >
                                <RequiredRule message="Pendidikan terakhir wajib diisi"/>
                            </SimpleItem>
                            <SimpleItem
                                dataField="idMarital"
                                editorType="dxSelectBox"
                                editorOptions={maritalStatusOptions}
                                label={{text: "Status pernikahan"}}
                            >
                                <RequiredRule message="Status pernikahan wajib diisi"/>
                            </SimpleItem>
                            <SimpleItem
                                dataField="motherMaidenName"
                                label={{text: "Ibu kandung"}}
                            >
                                <RequiredRule message="Ibu kandung wajib diisi"/>
                            </SimpleItem>
                            <SimpleItem
                                dataField="lengthOfJob"
                                editorOptions={{
                                    min: 0,
                                    maxLength: 15,
                                    onKeyDown: (e: any) => {
                                        const key = e.event.key;
                                        e.value = String.fromCharCode(e.event.keyCode);
                                        if (
                                            !/[0-9]/.test(e.value) &&
                                            key !== "Backspace" &&
                                            key !== "Delete"
                                        )
                                            e.event.preventDefault();
                                    }
                                }}
                                label={{text: "Lama bekerja"}}
                            >
                                <RequiredRule message="Lama bekerja wajib diisi"/>
                            </SimpleItem>
                            <SimpleItem
                                dataField="mobilePhone"
                                label={{text: "No.HP"}}
                                editorOptions={{
                                    min: 0,
                                    maxLength: 15,
                                    onKeyDown: (e: any) => {
                                        const key = e.event.key;
                                        e.value = String.fromCharCode(e.event.keyCode);
                                        if (
                                            !/[0-9]/.test(e.value) &&
                                            key !== "Backspace" &&
                                            key !== "Delete"
                                        )
                                            e.event.preventDefault();
                                    },
                                }}
                            >
                                <RequiredRule message="No.HP wajib diisi"/>
                                <AsyncRule
                                    message="No.HP sudah terdaftar"
                                    validationCallback={asyncValidationPhoneNumber}
                                />
                                <PatternRule
                                    message="No.HP hanya angka"
                                    pattern={/^[0-9]+$/}
                                />
                            </SimpleItem>
                            <SimpleItem
                                dataField="email"
                                label={{text: "Email"}}
                            >
                                <AsyncRule
                                    message="Email sudah terdaftar"
                                    validationCallback={asyncValidationEmail}
                                />
                            </SimpleItem>
                            <SimpleItem
                                dataField="ktpImage"
                                editorType={"dxFileUploader" as any}
                                editorOptions={uploadKtpOptions}
                                label={{text: "Foto KTP"}}
                            >
                                <RequiredRule message="Foto KTP wajib diisi"/>
                            </SimpleItem>
                        </GroupItem>
                        <GroupItem colSpan={2}>
                            {ktpSrc && (
                                <Item>
                                    <img
                                        id="dropzone-ktp"
                                        src={ktpSrc}
                                        alt="ktp"
                                        width={"240px"}
                                    />
                                </Item>
                            )}
                        </GroupItem>
                    </GroupItem>
                    <GroupItem colSpan={2} cssClass={"dx-card responsive-paddings next-card"}>
                        <GroupItem
                            caption="Alamat Tinggal"
                            name="HomeAddress"
                            colCount={2}
                        >
                            <SimpleItem
                                dataField="livingAddressStatus"
                                editorType="dxSelectBox"
                                editorOptions={ownerStatusOptions}
                                label={{text: "Status Kepemilikan Rumah"}}
                            >
                                <RequiredRule message="Status kepemilikan runah wajib diisi"/>
                            </SimpleItem>
                            <SimpleItem
                                dataField="idCountry"
                                editorType="dxSelectBox"
                                editorOptions={countryOptions}
                                label={{text: "Negara"}}
                            />
                            <SimpleItem
                                dataField="idProvince"
                                editorType="dxSelectBox"
                                editorOptions={proviceOptions}
                                label={{text: "Provinsi"}}
                            >
                                <RequiredRule message="Provinsi wajib diisi"/>
                            </SimpleItem>
                            <SimpleItem
                                dataField="idCity"
                                editorType="dxSelectBox"
                                editorOptions={cityOptions}
                                label={{text: "Kota"}}
                            >
                                <RequiredRule message="Kota wajib diisi"/>
                            </SimpleItem>
                            <SimpleItem
                                dataField="address"
                                editorType="dxTextArea"
                                label={{text: "Alamat "}}
                            >
                                <RequiredRule message="Alamat wajib diisi"/>
                            </SimpleItem>
                            <SimpleItem
                                dataField="districtId"
                                editorType="dxSelectBox"
                                editorOptions={districtOptions}
                                label={{text: "Kecamatan"}}
                            />
                            <SimpleItem
                                dataField="subdistrictId"
                                editorType="dxSelectBox"
                                editorOptions={subDistrictOptions}
                                label={{text: "Kelurahan"}}
                            />
                            <SimpleItem
                                dataField="postalCode"
                                editorOptions={{
                                    min: 0,
                                    maxLength: 5,
                                    onKeyDown: (e: any) => {
                                        const key = e.event.key;
                                        e.value = String.fromCharCode(e.event.keyCode);
                                        if (
                                            !/[0-9]/.test(e.value) &&
                                            key !== "Backspace" &&
                                            key !== "Delete"
                                        )
                                            e.event.preventDefault();
                                    },
                                }}
                                label={{text: "Kodepos"}}
                            />
                            <SimpleItem
                                dataField="neighborhoodUnit"
                                editorOptions={{
                                    min: 0,
                                    maxLength: 4,
                                    onKeyDown: (e: any) => {
                                        const key = e.event.key;
                                        e.value = String.fromCharCode(e.event.keyCode);
                                        if (
                                            !/[0-9]/.test(e.value) &&
                                            key !== "Backspace" &&
                                            key !== "Delete"
                                        )
                                            e.event.preventDefault();
                                    },
                                }}
                                label={{text: "RT"}}
                            />
                            <SimpleItem
                                dataField="communityUnit"
                                editorOptions={{
                                    min: 0,
                                    maxLength: 4,
                                    onKeyDown: (e: any) => {
                                        const key = e.event.key;
                                        e.value = String.fromCharCode(e.event.keyCode);
                                        if (
                                            !/[0-9]/.test(e.value) &&
                                            key !== "Backspace" &&
                                            key !== "Delete"
                                        )
                                            e.event.preventDefault();
                                    },
                                }}
                                label={{text: "RW"}}
                            />
                        </GroupItem>
                    </GroupItem>
                    <GroupItem colSpan={2} cssClass={"dx-card responsive-paddings next-card"}>
                        <GroupItem caption="Additional Information"
                                   name="AdditionalInformation"
                                   colCount={2}>
                            <SimpleItem
                                dataField="typeOfGood"
                                label={{text: "Jenis Barang"}}
                            >
                                <RequiredRule message="Jenis Barang wajib diisi"/>
                            </SimpleItem>
                            <SimpleItem
                                dataField="salesChannelId"
                                label={{text: "Sales Channel"}}
                                editorType={"dxSelectBox"}
                                editorOptions={salesChannelOptions}
                            />
                        </GroupItem>
                    </GroupItem>
                    <GroupItem colSpan={2} cssClass={"dx-card responsive-paddings next-card"}>
                        <GroupItem caption="Contact Relative"
                                   name="ContactRelative"
                                   colCount={2}>
                            <DataGrid
                                dataSource={contactRelatives}
                                // focusedRowEnabled={true}
                                remoteOperations={true}
                                columnAutoWidth={true}
                                wordWrapEnabled={false}
                                showBorders={true}
                                dateSerializationFormat={"yyyy-MM-ddTHH:mm:ss.SSSxxx"}
                                repaintChangesOnly={true}
                                editing={{
                                    mode: "popup",
                                    allowUpdating: true,
                                    allowAdding: true,
                                    allowDeleting: true,
                                    popup: {
                                        title: "Relative Contact",
                                        showTitle: true,
                                        width: "40%",
                                        height: 360
                                    },
                                    form: {
                                        colCount: 1,
                                        items: [
                                            {
                                                dataField: "typeId",
                                                editorType: "dxSelectBox",
                                                editorOptions: relativeOptions,
                                                isRequired: true,
                                            },
                                            {
                                                dataField: "name",
                                                editorOptions: {
                                                    min: 0,
                                                    maxLength: 150,
                                                    onKeyDown: (e: any) => {
                                                        const key = e.event.key;
                                                        e.value = String.fromCharCode(e.event.keyCode);
                                                        if (
                                                            !/[A-Za-z]/.test(e.value) &&
                                                            key !== " " &&
                                                            key !== "Backspace" &&
                                                            key !== "Delete"
                                                        )
                                                            e.event.preventDefault();
                                                    },
                                                },
                                                isRequired: true,
                                            },
                                            {
                                                dataField: "phone",
                                                editorOptions: {
                                                    min: 0,
                                                    maxLength: 15,
                                                    onKeyDown: (e: any) => {
                                                        const key = e.event.key;
                                                        e.value = String.fromCharCode(e.event.keyCode);
                                                        if (
                                                            !/[0-9]/.test(e.value) &&
                                                            key !== "Backspace" &&
                                                            key !== "Delete"
                                                        ) {
                                                            e.event.preventDefault();
                                                        }
                                                    },
                                                },
                                                isRequired: true,
                                            },
                                        ]
                                    }
                                }}
                            >
                                <Scrolling showScrollbar={"always"}/>

                                <Column dataField={"typeId"} caption={"Relation"}>
                                    <Lookup dataSource={contactRelativeStore} displayExpr="name" valueExpr="id"/>
                                </Column>
                                <Column dataField={"name"} caption={"Nama"}/>
                                <Column dataField={"phone"} caption={"Telepon No."}/>
                                <Paging defaultPageSize={50}/>
                                <Pager
                                    showPageSizeSelector={true}
                                    showInfo={true}
                                    allowedPageSizes={[10, 50, 100]}
                                />
                            </DataGrid>
                        </GroupItem>
                    </GroupItem>
                    <ButtonItem
                        horizontalAlignment="left"
                        buttonOptions={{
                            text: "Register",
                            type: "success",
                            useSubmitBehavior: true,
                        }}
                    />
                </Form>
            </form>
        </div>
    </>);
}
