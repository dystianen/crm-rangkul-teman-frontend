import Form, { Tab, TabbedItem, TabPanelOptions } from "devextreme-react/form";
import queryString from "query-string";
import { FC } from "react";
import { useLocation } from "react-router-dom";
import FamilyCard from "src/components/loan-app/FamilyCard";
import NeighbourQuestions from "src/components/loan-app/NeighbourQuestions";
import SellingQuestions from "src/components/loan-app/SellingQuestions";
import StreetShop from "src/components/loan-app/StreetShop";
import { ApplicationFiles } from "../approval1-app/ApplicationFiles";
import { ApprovalHistory } from "../approval1-app/ApprovalHistory";

type Props = {
  detail: any;
};

export const TabFooter: FC<Props> = ({ detail }) => {
  const location = useLocation();
  const { id } = queryString.parse(location.search);
  const ID = id as string;

  console.log(detail?.contactStreetShop?.isStreetShop);

  return (
    <>
      <div className={"dx-card responsive-paddings next-card"}>
        <div className="form__tabs">
          <Form>
            <TabbedItem
              tabPanelOptions={{
                scrollByContent: true,
                showNavButtons: true
              }}
            >
              <TabPanelOptions deferRendering={false} />
              <Tab title="Histori Persetujuan">
                <ApprovalHistory id={ID} />
              </Tab>
              <Tab title="Dokumen">
                <ApplicationFiles id={ID} />
              </Tab>
              <Tab title="Family">
                <FamilyCard appId={ID} disabled />
              </Tab>
              <Tab title="Questions">
                <SellingQuestions appId={ID} disabled />
                <div className={"next-card"}>
                  <NeighbourQuestions appId={ID} disabled />
                </div>
              </Tab>
              {detail?.contactStreetShop?.isStreetShop && (
                <Tab title="Street Shop">
                  <StreetShop appId={ID} disabled />
                </Tab>
              )}
            </TabbedItem>
          </Form>
        </div>
      </div>
    </>
  );
};
