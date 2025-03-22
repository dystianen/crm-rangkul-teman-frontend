import {Button, DataGrid, LoadIndicator, LoadPanel, Popup} from "devextreme-react";
import {Column, Lookup, Pager, Paging, Scrolling} from "devextreme-react/data-grid";
import Form, {
    AsyncRule,
    ButtonItem,
    ButtonOptions,
    EmailRule,
    GroupItem,
    Item,
    PatternRule,
    RequiredRule,
    SimpleItem,
    Tab,
    TabbedItem,
} from "devextreme-react/form";
import * as Title from "devextreme-react/toolbar";
import DataSource from "devextreme/data/data_source";
import notify from "devextreme/ui/notify";
import queryString from "query-string";
import React, {useCallback, useEffect, useRef, useState} from "react";
import {useNavigate} from "react-router";
import {useLocation} from "react-router-dom";
import {
    addressOwnershipStore,
    cityStore,
    contactCheckEkyc,
    contactDetailApi,
    contactEkycInfo,
    contactOCR,
    contactRelativeStore,
    countryStore,
    districtStore,
    educationStore,
    genderStore,
    getFile,
    maritalStatusStore, processCancel,
    processWithoutEkyc,
    provinceStore,
    religionStore,
    salesChannelStore, selectBoxBranchOptions,
    selectBoxOptions,
    subDistrictStore,
    updateContact,
    validateEmail,
    validateIdNumber,
    validatePhone
} from "src/api/contact";
import Loader from "src/components/loader";
import {ContactRelativeDto, ContactRequest, initContactValue} from "src/interfaces/contactDto";
import resizeImage from "src/utils/resizeImage.util";
import {formatDate} from "../../utils/dateUtils";
import { notifyError } from "src/utils/devExtremeUtils";
import "./contact.scss";
import ContactActivity from "src/components/contact/contact-activity";
import {StringLengthRule} from "devextreme-react/validator";
import {AppLoanOnboardingRequest, initLoanOnboardingValue} from "../../interfaces/appLoanOnboarding";
import {getActiveBranchByUserStore, getActiveProductByBranch} from "../../api/apploan";
import imageCompress from "src/utils/imageCompress.util";
import trimBody from "../../utils/trim-body";
import {useAuth} from "../../contexts/auth";

export default function EditPage() {
    const {user} = useAuth();
    const formAppRef = useRef<Form>(null);
    const [productOptions, setProductOptions] = useState<any>(undefined);
    const [productComboOptions, setComboProductOptions] = useState<any>({});
    const [isPopupCreateApp, setPopupCreateApp] = React.useState(false);
    const [loanAppOnboarding, setLoanAppOnboarding] =
        useState<AppLoanOnboardingRequest>(initLoanOnboardingValue);
    const navigate = useNavigate();
    const location = useLocation();
    const {id} = queryString.parse(location.search);
    const [contact, setContact] = useState<ContactRequest>(initContactValue);
    const [ktpSrc, setKtpSrc] = useState("");
    const [selfie, setSelfie] = useState("");
    const [contactRelatives, setContactRelatives] = useState<ContactRelativeDto[]>([]);
    const [isShowPopupCheckEkyc, setShowPopupCheckEkyc] = useState(false);
    const [isShowPopupError, setShowPopupError] = useState(false);
    const [isProcessWithoutEkyc, setProcessWithoutEkyc] = useState(false);
    const [errorMessage, setErrorMessage] = useState([""]);
    const [isLoadingUpdate, setLoadingUpdate] = useState(false);
    const [referenceNumber, setReferenceNumber] = useState("");
    const [isShowPopupOCR, setShowPopupOCR] = useState(false);
    const [isShowLoadingOCR, setShowLoadingOCR] = useState(false);
    const [isButtonCancel, setButtonCancel] = useState(false);
    const [isLoadingPage, setLoadingPage] = useState(false);

    const getBranchByUser = selectBoxBranchOptions(
        new DataSource(getActiveBranchByUserStore as any),
        "Select branch");

    const salesChannelOptions = selectBoxOptions(
        new DataSource(salesChannelStore),
        "Select Sales channel"
    );
    const relativeOptions = selectBoxOptions(new DataSource(contactRelativeStore), "Select Relation");
    const genderOptions = selectBoxOptions(new DataSource(genderStore), "Select gender");
    const religionOptions = selectBoxOptions(new DataSource(religionStore), "Select religion");
    const educationOptions = selectBoxOptions(new DataSource(educationStore), "Select education");
    const maritalStatusOptions = selectBoxOptions(
        new DataSource(maritalStatusStore),
        "Select marital status"
    );
    const ownerStatusOptions = selectBoxOptions(new DataSource(addressOwnershipStore), "");
    const countryOptions = selectBoxOptions(new DataSource(countryStore), "");

    const [proviceOptions, setProvinceOptions] = useState({});
    const [cityOptions, setCityOptions] = useState({});
    const [districtOptions, setDistrictOptions] = useState({});
    const [subDistrictOptions, setSubDistrictOptions] = useState({});

    const handleSubmit = (e: any) => {
        let request = {
            ...contact,
            contactId: id,
            birthDate: formatDate(contact.birthDate),
            ktpImage: ktpSrc,
            selfie,
            contactRelatives: contactRelatives
        };

        trimBody(request);

        setLoadingUpdate(true);
        updateContact(id, request)
            .then(() => {
                setLoadingUpdate(false);
                notify(
                    {
                        message: "Success submitted contact",
                        position: {
                            my: "center top",
                            at: "center top"
                        }
                    },
                    "success",
                    15000
                );
                navigate("/contact");
            })
            .catch(error => {
                setLoadingUpdate(false);
                notifyError(error.message);
            });
        e.preventDefault();
    };

    useEffect(() => {
        const contactId = String(id);

        contactDetailApi(contactId).then((res: any) => {
            const data: ContactRequest = {
                contactId: contactId,
                idNumber: res.idNumber,
                nameBorrower: res.name,
                birthPlace: res.birthPlace,
                birthDate: res.birthDate,
                idGender: res.genderId,
                idReligion: res.religionId,
                idEducation: res.educationId,
                idMarital: res.maritalId,
                motherMaidenName: res.motherMaidenName,
                lengthOfJob: res?.workExperienceMonth || 0,

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
                typeOfGood: res?.typeOfGood,
                salesChannelId: res?.salesChannelId,
                marketAddress: res.marketAddress,
            };

            setContact(prevContact => ({ ...prevContact, ...data }));

            if (res?.contactAddressCountryId) {
                setProvinceOptions(
                    selectBoxOptions(new DataSource(provinceStore(String(res?.contactAddressCountryId))), "")
                );
            }
            if (res?.contactAddressProvinceId) {
                setCityOptions(
                    selectBoxOptions(new DataSource(cityStore(res?.contactAddressProvinceId)), "")
                );
            }
            if (res?.contactAddressCityId) {
                setDistrictOptions(
                    selectBoxOptions(new DataSource(districtStore(res?.contactAddressCityId)), "")
                );
            }
            if (res?.contactAddressDistrictId) {
                setSubDistrictOptions(
                    selectBoxOptions(new DataSource(subDistrictStore(res?.contactAddressDistrictId)), "")
                );
            }
            if (res?.contactIdentFileUrlPath) {
                getFile(res?.contactIdentFileUrlPath)
                    .then(response => setKtpSrc(response))
                    .catch(error => console.error("ERROR:: ", error));
            }

            if (res?.contactIdentFileUrlSelfie) {
                getFile(res.contactIdentFileUrlSelfie)
                    .then(response => setSelfie(response))
                    .catch(error => console.error("ERROR:: ", error));
            }

            if (res?.contactRelatives) {
                setContactRelatives(res?.contactRelatives);
            }
        });

        const handleFetchEkycInfo = () => {
            contactEkycInfo(contactId).then(res => {
                const dataEkyc = {
                    privyId: res.privyId,
                    rejectReason: res.rejectReason,
                    isResend: res.isResend?.toString(),
                    referenceNumber: res.referenceNumber,
                    createdOn: res.createdOn,
                    completedOn: res.modifiedOn
                };

                setContact(prevContact => ({ ...prevContact, ...dataEkyc }));
            });
        };

        handleFetchEkycInfo();

        const handleCheckEkyc = (intervalId: NodeJS.Timeout) => {
            contactCheckEkyc(contactId).then((res) => {
                setButtonCancel(res.isCancel);
                setShowPopupCheckEkyc(res.isEkycWaiting);
                setShowPopupError(res.isShowResult);
                setReferenceNumber(res.referenceNumber);
                setProcessWithoutEkyc(!res.isResend);

                if (res.message) {
                    setErrorMessage(res.message);
                }
                if (!res.isEkycWaiting || res.isShowResult) {
                    clearInterval(intervalId);
                }
                if (!res.isEkycWaiting && res.appId != null) {
                    clearInterval(intervalId);
                    navigate(`/loan-app/create/step/1/?id=${res.appId}&autoNext=false`);
                }
            });
        };

        const intervalId = setInterval(() => {
            handleCheckEkyc(intervalId);
        }, 5000);

        handleCheckEkyc(intervalId);

        return () => clearInterval(intervalId);
    }, [id]);

    const onFileChanged = useCallback(async (e: any, type: "KTP" | "SELFIE") => {
        if (e.value.length > 0) {
            if (type === "KTP") {
                const uri = await imageCompress(e.value[0]);
                setKtpSrc(uri.base64);
            } else {
                const uri = await resizeImage(e.value[0]);
                setSelfie(uri);
            }
        }
    }, []);

    const commonPropsUpload = {
        selectButtonText: "Select photo",
        accept: "image/*",
        uploadMode: "useForm"
    };

    const uploadKtpOptions = {
        ...commonPropsUpload,
        onValueChanged: (e: any) => onFileChanged(e, "KTP")
    };

    const uploadPhotoSelfieOptions = {
        ...commonPropsUpload,
        onValueChanged: (e: any) => onFileChanged(e, "SELFIE")
    };

    const onFieldDataChanged = async (evt: any) => {
        if (evt.dataField === "idCountry" && evt.value != null) {
            setProvinceOptions(selectBoxOptions(new DataSource(provinceStore(evt.value)), ""));
        }
        if (evt.dataField === "idProvince" && evt.value != null) {
            setCityOptions(selectBoxOptions(new DataSource(cityStore(evt.value)), ""));
        }
        if (evt.dataField === "idCity" && evt.value != null) {
            setDistrictOptions(selectBoxOptions(new DataSource(districtStore(evt.value)), ""));
        }
        if (evt.dataField === "districtId" && evt.value != null) {
            setSubDistrictOptions(selectBoxOptions(new DataSource(subDistrictStore(evt.value)), ""));
        }

        if (evt.dataField === "ktpImage" && evt.value != null) {
            setLoadingPage(true)
            await onFileChanged({ value: [evt.value[0]] }, "KTP");
            setLoadingPage(false)
            setShowPopupOCR(true);
        }

        contact[evt.dataField] = evt.value;
    };

    const asyncValidationIdNumber = (params: any) => {
        const request = {
            phoneNumber: params.value,
            contactId: id
        };
        return validateIdNumber(request);
    };

    const asyncValidationPhoneNumber = (params: any) => {
        const request = {
            phoneNumber: params.value,
            contactId: id
        };
        return validatePhone(request);
    };

    const asyncValidationEmail = (params: any) => {
        const request = {
            email: params.value,
            contactId: id
        };
        return validateEmail(request);
    };


    const onFieldAppDataChanged = (evt: any) => {
        if (evt.dataField === "branchId" && evt.value != null) {
            setComboProductOptions(selectBoxOptions(
                new DataSource(getActiveProductByBranch(evt.value)),
                "Select product"
            ));
        }

        if (evt.dataField === "productId" && evt.value != null) {
            setProductOptions(evt.value);
        }
        loanAppOnboarding[evt.dataField] = evt.value;
    };

    const handleProcessWithoutEkyc = (e: any) => {
        const contactId = String(id);
        const form = formAppRef.current!.instance;
        const payload = {
            contactId: contactId,
            contactIdentity: contact.idNumber,
            branchId: loanAppOnboarding.branchId,
            productId: loanAppOnboarding.productId,
        }

        processWithoutEkyc(payload)
            .then(res => {
                if (res.appId) {
                    setPopupCreateApp(false);
                    navigate(`/loan-app/create/step/1/?id=${res.appId}&autoNext=false`);
                }
            })
            .catch(error => {
                notifyError(error.message);
            });
        e.preventDefault();
    }

    const handleSubmitOCR = () => {
        setShowLoadingOCR(true);
        const contactId = String(id);
        const payload = {
            contactId,
            ktp: ktpSrc
        }
        contactOCR(payload)
            .then(res => {
                setShowLoadingOCR(false);
                setShowPopupOCR(false);
                const data = {
                    idNumber: res.identity,
                    nameBorrower: res.name,
                    birthPlace: res.placeOfBirth,
                    birthDate: res.dateOfBirth,
                    idGender: res.genderId,
                    idReligion: res.religionId,
                    idMarital: res.maritalStatusId,
                    idCountry: res.countryId,
                    idProvince: res.provinceId,
                    idCity: res.cityId,
                    districtId: res.districtId,
                    subdistrictId: res.subDistrictId,
                    address: res.address,
                    neighborhoodUnit: res.rt,
                    communityUnit: res.rw,
                };
        
                setContact(prevContact => ({ ...prevContact, ...data }));

                if (res.countryId) {
                    setProvinceOptions(
                        selectBoxOptions(new DataSource(provinceStore(String(res.countryId))), "")
                    );
                }
                if (res.provinceId) {
                    setCityOptions(
                        selectBoxOptions(new DataSource(cityStore(res.provinceId)), "")
                    );
                }
                if (res.cityId) {
                    setDistrictOptions(
                        selectBoxOptions(new DataSource(districtStore(res.cityId)), "")
                    );
                }
                if (res.districtId) {
                    setSubDistrictOptions(
                        selectBoxOptions(new DataSource(subDistrictStore(res.districtId)), "")
                    );
                }
            })
            .catch(err => {
                notifyError(err.message);
                setShowLoadingOCR(false);
            })
    }

    const handleBack = () => {
        navigate(`/contact`);
    };


    const submitCancel = () => {
        const contactId = String(id);

        processCancel(contactId).then((res) => {
            setButtonCancel(false);
            setShowPopupCheckEkyc(false);
        });
    };

    const backButtonOptions = {
        icon: "back",
        text: "Kembali",
        onClick: handleBack
    };

    return (
        <>
            <LoadPanel
                shadingColor="rgba(0,0,0,0.4)"
                visible={isLoadingPage}
                showIndicator={true}
                shading={true}
                showPane={true}
                hideOnOutsideClick={false}
            />

            <div className={"content-block"}>
                <h2>Detail Contact</h2>
                <Title.Toolbar className={"dx-card"}>
                    <Title.Item location="before" widget="dxButton" options={backButtonOptions}/>
                </Title.Toolbar>

                <form className="form__tabs" action="update=register" onSubmit={handleSubmit}>
                    <Form
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
                                    label={{text: "KTP Number"}}
                                    editorOptions={{
                                        min: 16,
                                        maxLength: 16,
                                        onKeyDown: (e: any) => {
                                            const key = e.event.key;
                                            e.value = String.fromCharCode(e.event.keyCode);
                                            if (!/[0-9]/.test(e.value) && key !== "Backspace" && key !== "Delete")
                                                e.event.preventDefault();
                                        }
                                    }}
                                >
                                    <RequiredRule message="KTP Number is required"/>
                                    <AsyncRule
                                        message="KTP Number is already registered"
                                        validationCallback={asyncValidationIdNumber}
                                    />
                                    <PatternRule message="Only number on KTP Number" pattern={/^[0-9]+$/}/>
                                </SimpleItem>
                                <SimpleItem dataField="nameBorrower" label={{text: "Name"}}>
                                    <RequiredRule message="Name is required"/>
                                    <PatternRule message="Do not use digits in the Name" pattern={/^[^0-9]+$/}/>
                                </SimpleItem>
                                <SimpleItem dataField="birthPlace" label={{text: "Place of Birth"}}>
                                    <RequiredRule message="Place of birth is required"/>
                                </SimpleItem>
                                <SimpleItem
                                    dataField="birthDate"
                                    label={{text: "Date of Birth"}}
                                    editorType="dxDateBox"
                                    editorOptions={{
                                        type: "date",
                                        pickerType: "calender",
                                        displayFormat: "dd/MM/yyyy"
                                    }}
                                >
                                    <RequiredRule message="Date of birth is required"/>
                                </SimpleItem>
                                <SimpleItem
                                    dataField="idGender"
                                    label={{text: "Gender"}}
                                    editorType="dxSelectBox"
                                    editorOptions={genderOptions}
                                >
                                    <RequiredRule message="Gender is required"/>
                                </SimpleItem>
                                <SimpleItem
                                    dataField="idReligion"
                                    editorType="dxSelectBox"
                                    editorOptions={religionOptions}
                                    label={{text: "Religion"}}
                                >
                                    <RequiredRule message="Religion is required"/>
                                </SimpleItem>
                                <SimpleItem
                                    dataField="idEducation"
                                    editorType="dxSelectBox"
                                    editorOptions={educationOptions}
                                    label={{text: "Last Education"}}
                                >
                                    <RequiredRule message="Last education is required"/>
                                </SimpleItem>
                                <SimpleItem
                                    dataField="idMarital"
                                    editorType="dxSelectBox"
                                    editorOptions={maritalStatusOptions}
                                    label={{text: "Marital Status"}}
                                >
                                    <RequiredRule message="Marital status is required"/>
                                </SimpleItem>
                                <SimpleItem dataField="motherMaidenName" label={{text: "Mother Maiden Name"}}>
                                    <RequiredRule message="Mother maiden name is required"/>
                                </SimpleItem>
                                <SimpleItem
                                    dataField="lengthOfJob"
                                    editorType="dxNumberBox"
                                    editorOptions={{min: 0}}
                                    label={{text: "Length of Job"}}
                                >
                                    <RequiredRule message="Length of job is required"/>
                                </SimpleItem>
                                <SimpleItem
                                    dataField="mobilePhone"
                                    label={{text: "Mobile Phone Number"}}
                                    editorOptions={{
                                        min: 0,
                                        maxLength: 14,
                                        onKeyDown: (e: any) => {
                                            const key = e.event.key;
                                            e.value = String.fromCharCode(e.event.keyCode);
                                            if (!/[0-9]/.test(e.value) && key !== "Backspace" && key !== "Delete")
                                                e.event.preventDefault();
                                        }
                                    }}
                                >
                                    <RequiredRule message="Mobile phone is required"/>
                                    <AsyncRule
                                        message="Mobile phone is already registered"
                                        validationCallback={asyncValidationPhoneNumber}
                                    />
                                    <PatternRule message="Only number on Mobile phone" pattern={/^[0-9]+$/}/>
                                </SimpleItem>
                                <SimpleItem
                                    dataField="email"
                                    label={{text: "Email"}}
                                    editorOptions={{
                                        min: 0,
                                        maxLength: 32
                                    }}
                                >
                                    <AsyncRule
                                        message="Email is already registered"
                                        validationCallback={asyncValidationEmail}
                                    />
                                    <EmailRule message="Email is invalid" />
                                </SimpleItem>
                                <SimpleItem
                                    dataField="ktpImage"
                                    editorType={"dxFileUploader" as any}
                                    editorOptions={uploadKtpOptions}
                                    label={{text: "KTP Image"}}
                                ></SimpleItem>
                                <SimpleItem
                                    dataField="selfie"
                                    editorType={"dxFileUploader" as any}
                                    editorOptions={uploadPhotoSelfieOptions}
                                    label={{text: "Selfie Photo"}}
                                ></SimpleItem>

                                <Item>
                                    {ktpSrc && <img id="dropzone-ktp" src={ktpSrc} alt="ktp" width="240px"/>}
                                </Item>
                                <Item>{selfie && <img src={selfie} alt="selfie-photo" width="240px"/>}</Item>
                            </GroupItem>
                        </GroupItem>
                        <GroupItem colSpan={2} cssClass={"dx-card responsive-paddings next-card"}>
                            <GroupItem caption="EKYC Information" colCount={2}>
                                <SimpleItem
                                    dataField="referenceNumber"
                                    label={{text: "Reference Number"}}
                                    editorOptions={{
                                        readOnly: true,
                                    }}
                                />
                                <SimpleItem
                                    dataField="privyId"
                                    label={{text: "Privy Id"}}
                                    editorOptions={{
                                        readOnly: true,
                                    }}
                                />
                                <SimpleItem
                                    dataField="createdOn"
                                    label={{text: "Created On"}}
                                    editorOptions={{
                                        displayFormat: "dd MMM yyyy HH:mm:ss",
                                        type: "datetime",
                                        readOnly: true
                                      }}
                                    editorType="dxDateBox"
                                />
                                <SimpleItem
                                    dataField="completedOn"
                                    label={{text: "Completed On"}}
                                    editorOptions={{
                                        displayFormat: "dd MMM yyyy HH:mm:ss",
                                        type: "datetime",
                                        readOnly: true
                                    }}
                                    editorType="dxDateBox"
                                />
                                <SimpleItem
                                    dataField="rejectReason"
                                    label={{text: "Reject Reason"}}
                                    cssClass="reject-reason"
                                    editorOptions={{
                                        readOnly: true,
                                    }}
                                />
                                <SimpleItem
                                    dataField="isResend"
                                    label={{text: "Retryable"}}
                                    editorOptions={{
                                        readOnly: true,
                                    }}
                                    editorType="dxTextBox"
                                />
                            </GroupItem>
                        </GroupItem>
                        <GroupItem colSpan={2} cssClass={"dx-card responsive-paddings next-card"}>
                            <GroupItem caption="Home Address" name="HomeAddress" colCount={2}>
                                <SimpleItem
                                    dataField="livingAddressStatus"
                                    editorType="dxSelectBox"
                                    editorOptions={ownerStatusOptions}
                                    label={{text: "Living Address Status"}}
                                >
                                    <RequiredRule message="Living address status is required"/>
                                </SimpleItem>
                                <SimpleItem
                                    dataField="idCountry"
                                    editorType="dxSelectBox"
                                    editorOptions={countryOptions}
                                    label={{text: "Country"}}
                                />
                                <SimpleItem
                                    dataField="idProvince"
                                    editorType="dxSelectBox"
                                    editorOptions={proviceOptions}
                                    label={{text: "Province"}}
                                >
                                    <RequiredRule message="Province is required"/>
                                </SimpleItem>
                                <SimpleItem
                                    dataField="idCity"
                                    editorType="dxSelectBox"
                                    editorOptions={cityOptions}
                                    label={{text: "City"}}
                                >
                                    <RequiredRule message="City is required"/>
                                </SimpleItem>
                                <SimpleItem dataField="address" editorType="dxTextArea" label={{text: "Address"}}>
                                    <RequiredRule message="Address is required"/>
                                </SimpleItem>
                                <SimpleItem
                                    dataField="districtId"
                                    editorType="dxSelectBox"
                                    editorOptions={districtOptions}
                                    label={{text: "District"}}
                                />
                                <SimpleItem
                                    dataField="subdistrictId"
                                    editorType="dxSelectBox"
                                    editorOptions={subDistrictOptions}
                                    label={{text: "Sub District"}}
                                />
                                <SimpleItem
                                    dataField="postalCode"
                                    editorOptions={{
                                        min: 0,
                                        maxLength: 5,
                                        onKeyDown: (e: any) => {
                                            const key = e.event.key;
                                            e.value = String.fromCharCode(e.event.keyCode);
                                            if (!/[0-9]/.test(e.value) && key !== "Backspace" && key !== "Delete")
                                                e.event.preventDefault();
                                        }
                                    }}
                                    label={{text: "Postal Code"}}
                                />
                                <SimpleItem
                                    dataField="neighborhoodUnit"
                                    editorOptions={{
                                        min: 0,
                                        maxLength: 4,
                                        onKeyDown: (e: any) => {
                                            const key = e.event.key;
                                            e.value = String.fromCharCode(e.event.keyCode);
                                            if (!/[0-9]/.test(e.value) && key !== "Backspace" && key !== "Delete")
                                                e.event.preventDefault();
                                        }
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
                                            if (!/[0-9]/.test(e.value) && key !== "Backspace" && key !== "Delete")
                                                e.event.preventDefault();
                                        }
                                    }}
                                    label={{text: "RW"}}
                                />
                            </GroupItem>
                        </GroupItem>
                        <GroupItem colSpan={2} cssClass={"dx-card responsive-paddings next-card"}>
                            <GroupItem caption="Additional Information" name="AdditionalInformation" colCount={2}>
                                <SimpleItem dataField="typeOfGood" label={{text: "Jenis Barang"}}>
                                    <RequiredRule message="Jenis Barang wajib diisi"/>
                                </SimpleItem>
                                <SimpleItem
                                    dataField="salesChannelId"
                                    label={{text: "Sales Channel"}}
                                    editorType={"dxSelectBox"}
                                    editorOptions={salesChannelOptions}
                                />
                                <SimpleItem dataField="marketAddress" label={{text: "Market Address"}}>
                                    <RequiredRule message="Alamat pasar wajib diisi"/>
                                </SimpleItem>
                            </GroupItem>
                        </GroupItem>
                        <GroupItem colSpan={2} cssClass={"dx-card responsive-paddings next-card"}>
                            <GroupItem caption="Contact Relative" name="ContactRelative" colCount={2}>
                                <DataGrid
                                    dataSource={contactRelatives}
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
                                                    isRequired: true
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
                                                        }
                                                    },
                                                    isRequired: true
                                                },
                                                {
                                                    dataField: "phone",
                                                    editorOptions: {
                                                        min: 0,
                                                        maxLength: 14,
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
                                                        }
                                                    },
                                                    isRequired: true
                                                }
                                            ]
                                        }
                                    }}
                                >
                                    <Scrolling showScrollbar={"always"}/>

                                    <Column dataField={"typeId"} caption={"Relation"}>
                                        <Lookup dataSource={contactRelativeStore} displayExpr="name" valueExpr="id"/>
                                    </Column>
                                    <Column dataField={"name"} caption={"Nama"}/>
                                    <Column dataField={"phone"} caption={"Telepon No."} />
                                    <Paging defaultPageSize={50}/>
                                    <Pager
                                        showPageSizeSelector={true}
                                        showInfo={true}
                                        allowedPageSizes={[10, 50, 100]}
                                    />
                                </DataGrid>
                            </GroupItem>
                        </GroupItem>
                        <ButtonItem horizontalAlignment="left">
                            <ButtonOptions type="success" disabled={isLoadingUpdate} useSubmitBehavior>
                                <div className="button-options">
                                    <LoadIndicator width="20px" height="20px" visible={isLoadingUpdate}/>
                                    <span className="dx-button-text">Update Contact</span>
                                </div>
                            </ButtonOptions>
                        </ButtonItem>
                    </Form>
                </form>

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
                            <Tab title="Contact Activity">
                                <ContactActivity user={user} contactId={id as string}/>
                            </Tab>
                        </TabbedItem>
                    </Form>
                </div>
            </div>

            <Popup width={360} height={"auto"} visible={isShowPopupCheckEkyc} showTitle={false}>
                <div className="wrapper-popup-waiting">
                    <Loader/>
                    <h5 className="title" style={{marginBottom: 0, marginTop: "1rem"}}>Mohon tunggu sedang dilakukan
                        verifikasi data</h5>
                    {referenceNumber && (
                        <div className="card-reference-number">
                            <p style={{textAlign: "center"}}>Privy reference number: <span
                                style={{fontWeight: 500}}>{referenceNumber}</span></p>
                        </div>
                    )}
                    <div style={{display: "flex", gap: "10px"}}>
                        <Button text="Kembali" type="default" onClick={handleBack}/>
                        <Button text="Batalkan" visible={isButtonCancel}  type="normal" onClick={() => submitCancel()}/>
                    </div>
                </div>
            </Popup>

            <Popup width={360} height={"auto"} visible={isShowPopupError} showTitle={false}>
                <div className="popup-error">
                    <img src="/assets/images/ic_error.png" width={80} height={80} alt="Error"/>
                    <div className="card">
                        <ul>
                            {errorMessage.map((item, index) => (
                                <li key={index}>{item}</li>
                            ))}
                        </ul>
                    </div>
                    <div style={{ display: "flex", gap: "10px" }}>
                        <Button text="Tutup" type="normal" onClick={() => setShowPopupError(false)}/>
                        <Button visible={isProcessWithoutEkyc} text="Proses Tanpa EKYC" type="default" onClick={()=>{
                            setShowPopupError(false);
                            setPopupCreateApp(true);}
                        }/>
                    </div>
                </div>
            </Popup>

            <Popup
                width={360}
                height={320}
                visible={isPopupCreateApp}
                title="Aplikasi baru"
            >
                <form onSubmit={handleProcessWithoutEkyc}>
                    <Form
                        ref={formAppRef}
                        id="form"
                        showColonAfterLabel={true}
                        showValidationSummary={true}
                        validationGroup="OnboardingApplicationData"
                        onFieldDataChanged={onFieldAppDataChanged}
                    >
                        <SimpleItem
                            dataField="branchId"
                            label={{text: "Branch"}}
                            editorType="dxSelectBox"
                            editorOptions={getBranchByUser}
                        >
                            <RequiredRule message="Branch is required"/>
                        </SimpleItem>
                        <SimpleItem
                            dataField="productId"
                            label={{text: "Product"}}
                            editorType="dxSelectBox"
                            editorOptions={productComboOptions}
                        >
                            <RequiredRule message="Product is required"/>
                        </SimpleItem>
                        <SimpleItem
                            dataField="contactIdentity"
                            label={{text: "Nomor KTP"}}
                            editorOptions={{
                                min: 16,
                                maxLength: 16,
                                readOnly: true,
                                value: (contact.idNumber || ""),
                                onKeyDown: (e: any) => {
                                    const key = e.event.key;
                                    e.value = String.fromCharCode(e.event.keyCode);
                                    if (
                                        !/[0-9]/.test(e.value) &&
                                        key !== "Control" && key !== "v" &&
                                        key !== "Backspace" &&
                                        key !== "Delete"
                                    )
                                        e.event.preventDefault();
                                },
                            }}
                        >
                            <RequiredRule message="KTP Number is required"/>
                            <AsyncRule
                                message="KTP Number is not registered"
                                validationCallback={asyncValidationIdNumber}
                            />
                            <StringLengthRule
                                min={16}
                                message="KTP tidak kurang dar 16 karakter"
                            />
                            <PatternRule
                                message="KTP hanya angka"
                                pattern={/^[0-9]+$/}
                            />
                        </SimpleItem>
                        <ButtonItem
                            horizontalAlignment="left"
                            buttonOptions={{
                                text: "Submit",
                                type: "success",
                                useSubmitBehavior: true,
                            }}
                        />
                    </Form>
                </form>
            </Popup>


            <Popup id="popup-ocr" width={360} height={"auto"} visible={isShowPopupOCR} showTitle={false}>
                <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", gap: "20px" }}>
                    <h3 className="title" style={{ marginBottom: 0, marginTop: "1rem" }}>Lanjutkan dengan OCR?</h3>
                    <div style={{ display: "flex", gap: "10px" }}>
                        <Button text="Tidak" type="normal" onClick={() => setShowPopupOCR(false)}/>
                        <Button text="Lanjutkan" type="default" onClick={handleSubmitOCR} disabled={isShowLoadingOCR}>
                            <LoadIndicator height={16} width={16} className="button-indicator" visible={isShowLoadingOCR} />
                            <span className="dx-button-text" style={{ marginLeft: "8px" }}>Lanjutkan</span>
                        </Button>
                    </div>
                </div>
            </Popup>
        </>
    );
}
