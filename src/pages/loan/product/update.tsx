import React, {FC, useCallback, useEffect, useRef, useState} from "react";
import {useNavigate} from "react-router";
import {useLocation} from "react-router-dom";
import queryString from "query-string";
import {useAuth} from "../../../contexts/auth";
import Form, {
  AsyncRule,
  ButtonItem,
  GroupItem,
  PatternRule,
  RequiredRule,
  SimpleItem,
  Tab,
  TabbedItem, TabPanelOptions
} from "devextreme-react/form";
import {selectBoxBranchOptions, selectBoxOptions} from "../../../api/contact";
import DataSource from "devextreme/data/data_source";
import {getActiveBranchByUserStore, getActiveProductByBranch} from "../../../api/apploan";
import * as Title from "devextreme-react/toolbar";
import {TabFooter} from "./TabFooter";
import LoanDetailsAccordion from "../../loan-app/LoanDetailsAccordion";
import {DataGrid} from "devextreme-react";
import {Column, Pager, Paging} from "devextreme-react/data-grid";
import {productDetailApi} from "../../../api/product.api";


export const LoanProductUpdatePage: FC = () => {
  const formAppRef = useRef<Form>(null);
  const {user} = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const {id} = queryString.parse(location.search);
  const [detail, setDetail] = useState<any>({});
  const [isAccordionProductParameterOpen, setIsAccordionProductParameterOpen] = useState(true);
  const [isAccordionProductTermOpen, setIsAccordionProductTermOpen] = useState(false);
  const [isAccordionProductByBranchOpen, setIsAccordionProductByBranchOpen] = useState(false);
  const [isAccordionLPFByProductOpen, setIsAccordionLPFByProductOpen] = useState(false);
  const [isAccordionApplicationFileTypeOpen, setIsAccordionApplicationFileTypeOpen] = useState(false);
  const [isAccordionQuestionarySellingOpen, setIsAccordionQuestionarySellingOpen] = useState(false);
  const [isAccordionQuestionaryNeighbourOpen, setIsAccordionQuestionaryNeighbourOpen] = useState(false);
  const [title, setTitle] = useState("Nama Produk");
  
  useEffect(() => {
    fetchProductData();
  }, [id]);
  
  const fetchProductData = useCallback(() => {
    productDetailApi(id as string).then(setDetail);
  },[id]);
  
  const getBranchByUser = selectBoxBranchOptions(
      new DataSource(getActiveBranchByUserStore as any),
      "Select branch");
  
  const onFieldDataChanged = (evt: any) => {
    detail[evt.dataField] = evt.value;
  };
  
  const handleSubmit = (e: any) => {
  
  }
  
  const onClickBack = () => {
    navigate(`/loan/product`);
  };
  
  const backButtonOptions:any = {
    icon: "back",
    text: "Kembali",
    onClick: onClickBack
  };
  
  return (<>
        <div className={"content-block"}>
          <h2>Update Product</h2>
          <Title.Toolbar className={"dx-card"}>
            <Title.Item location="before" widget="dxButton" options={backButtonOptions}/>
          </Title.Toolbar>
          
          <form className="form__tabs" action="update=product" onSubmit={handleSubmit}>
            <Form
                ref={formAppRef}
                id="productForm"
                formData={detail}
                showColonAfterLabel={true}
                showValidationSummary={true}
                validationGroup="OnUpdateProductData"
                onFieldDataChanged={onFieldDataChanged}
            >
              <GroupItem cssClass={"dx-card responsive-paddings next-card"}>
                <SimpleItem
                    dataField="name"
                    label={{text: "Product"}}
                >
                  <RequiredRule message="Product is required"/>
                </SimpleItem>
              </GroupItem>
              <GroupItem visible={true} colSpan={2} cssClass={"p-0"}>
                <LoanDetailsAccordion
                    title={"Product Parameters"}
                    isOpen={isAccordionProductParameterOpen}
                    onToggle={() => setIsAccordionProductParameterOpen((prev) => !prev)}
                >
                  <></>
                </LoanDetailsAccordion>
              </GroupItem>
              <GroupItem visible={true} colSpan={2} cssClass={"p-0"}>
                <LoanDetailsAccordion
                    title={"Product Term"}
                    isOpen={isAccordionProductTermOpen}
                    onToggle={() => setIsAccordionProductTermOpen((prev) => !prev)}
                >
                  <></>
                </LoanDetailsAccordion>
              </GroupItem>
              <GroupItem visible={true} colSpan={2} cssClass={"p-0"}>
                <LoanDetailsAccordion
                    title={"Product By Branch"}
                    isOpen={isAccordionProductByBranchOpen}
                    onToggle={() => setIsAccordionProductByBranchOpen((prev) => !prev)}
                >
                  <></>
                </LoanDetailsAccordion>
              </GroupItem>
              <GroupItem visible={true} colSpan={2} cssClass={"p-0"}>
                <LoanDetailsAccordion
                    title={"LPF By Product"}
                    isOpen={isAccordionLPFByProductOpen}
                    onToggle={() => setIsAccordionLPFByProductOpen((prev) => !prev)}
                >
                  <></>
                </LoanDetailsAccordion>
              </GroupItem>
              <GroupItem visible={true} colSpan={2} cssClass={"p-0"}>
                <LoanDetailsAccordion
                    title={"Application File Type"}
                    isOpen={isAccordionApplicationFileTypeOpen}
                    onToggle={() => setIsAccordionApplicationFileTypeOpen((prev) => !prev)}
                >
                  <></>
                </LoanDetailsAccordion>
              </GroupItem>
              <GroupItem visible={true} colSpan={2} cssClass={"p-0"}>
                <LoanDetailsAccordion
                    title={"Questionary Selling"}
                    isOpen={isAccordionQuestionarySellingOpen}
                    onToggle={() => setIsAccordionQuestionarySellingOpen((prev) => !prev)}
                >
                  <></>
                </LoanDetailsAccordion>
              </GroupItem>
              <GroupItem visible={true} colSpan={2} cssClass={"p-0"}>
                <LoanDetailsAccordion
                    title={"Questionary Neighbour"}
                    isOpen={isAccordionQuestionaryNeighbourOpen}
                    onToggle={() => setIsAccordionQuestionaryNeighbourOpen((prev) => !prev)}
                >
                  <></>
                </LoanDetailsAccordion>
              </GroupItem>
              <ButtonItem
                  colSpan={2} horizontalAlignment="left"
                  buttonOptions={{
                    text: "Update",
                    type: "success",
                    useSubmitBehavior: true,
                  }}
              />
            </Form>
          </form>
        </div>
      </>
  );
}
