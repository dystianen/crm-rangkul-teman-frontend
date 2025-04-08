import { Button, List } from "devextreme-react";
import DropDownBox from "devextreme-react/drop-down-box";
import { useRef, useState } from "react";

type TMultipleSelectProps = {
  fieldName: string;
  value: string[];
  component: any;
  dataSource: any;
  placeholder: string;
};

function MultiSelect({
  fieldName,
  value,
  component,
  dataSource,
  placeholder
}: TMultipleSelectProps) {
  const dropDownRef = useRef<DropDownBox>(null);
  const [tempSelected, setTempSelected] = useState<string[]>(value);

  const handleSelectionChanged = (e: any) => {
    const selectedValues = e.component.option("selectedItemKeys");
    setTempSelected(selectedValues);
  };

  const handleDone = () => {
    component.updateData(fieldName, tempSelected);
    dropDownRef.current?.instance?.close();
  };

  const handleClosed = () => {
    component.updateData(fieldName, tempSelected);
  };

  return (
    <DropDownBox
      ref={dropDownRef}
      value={value}
      className="custom-dropdown"
      valueExpr="id"
      displayExpr="name"
      placeholder={placeholder}
      dataSource={dataSource}
      onClosed={handleClosed}
      contentRender={() => (
        <div>
          <List
            dataSource={dataSource}
            selectionMode="multiple"
            showSelectionControls
            selectedItemKeys={tempSelected}
            keyExpr="id"
            displayExpr="name"
            onSelectionChanged={handleSelectionChanged}
          />
          <Button text="Done" style={{ marginTop: 10, width: "100%" }} onClick={handleDone} />
        </div>
      )}
    />
  );
}

export default MultiSelect;
