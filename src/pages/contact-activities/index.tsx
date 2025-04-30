import "devextreme-react/file-uploader";
import Tabs, { Item } from "devextreme-react/tabs";
import "devextreme-react/text-area";
import DataSource from "devextreme/data/data_source";
import "devextreme/data/odata/store";
import { useEffect, useState } from "react";
import { activityByCategoryStore, fetchActivityCategory } from "src/api/contact";
import TableCollection from "./TableContactActivities/TableCollection";
import TableSales from "./TableContactActivities/TableSales";
import TableVerification from "./TableContactActivities/TableVerification";

type TOptions = {
  id: string;
  name: string;
}[];

const ContactActivities = () => {
  const [activityCategory, setActivityCategory] = useState<TOptions>([]);
  const [selectedCategory, setSelectedCategory] = useState("");

  const isCollection = selectedCategory === "8aa1778c-9b63-45d3-905a-a724137c81b0";
  const isSales = selectedCategory === "e293bd9a-b321-432a-91e2-86fd8e7d65ac";
  const isVerification = selectedCategory === "a9291c97-0684-44eb-9c73-5ed2f154936f";

  useEffect(() => {
    fetchActivityCategory().then((res) => {
      setActivityCategory(res);
      setSelectedCategory(res[0].id);
    });
  }, []);

  return (
    <div className={"content-block"}>
      <h2>Contact Activities</h2>
      <div className="form__tabs dx-card responsive-paddings next-card">
        <Tabs
          onItemClick={(e) => setSelectedCategory(activityCategory[e.itemIndex].id)}
          showNavButtons
          defaultSelectedIndex={0}
          style={{ marginBottom: 16 }}
        >
          {activityCategory.map((item) => (
            <Item key={item.id}>
              <strong>{item.name}</strong>
            </Item>
          ))}
        </Tabs>
        {selectedCategory != "" && <>
          {isCollection && <TableCollection categoryId={selectedCategory} />}
          {isSales && <TableSales categoryId={selectedCategory} />}
          {isVerification && <TableVerification categoryId={selectedCategory} />}
        </>}
      </div>
    </div>
  );
};

export default ContactActivities;
