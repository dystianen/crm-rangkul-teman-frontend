import { CheckBox } from "devextreme-react";
import { useCallback, useEffect, useState } from "react";
import { getStreetShop, submitStreetShop } from "src/api/apploan";

const StreetShop = ({ appId, disabled = false }: { appId: string; disabled?: boolean }) => {
  const [isStreetShop, setIsStreetShop] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    getStreetShop(appId).then((res) => {
      setIsStreetShop(res.isStreetShop ?? false);
    });
  }, [appId]);

  const handleChangeStreetShop = useCallback(
    async (value: boolean) => {
      if (isLoading) return;
      setIsLoading(true);

      const payload = {
        isStreetShop: value
      };
      await submitStreetShop(appId, payload);
      setIsStreetShop(value);
      setIsLoading(false);
    },
    [appId, isLoading]
  );

  return (
    <>
      <div style={{ display: "flex", gap: "10px", marginBottom: 0 }}>
        <CheckBox
          disabled={isLoading}
          readOnly={disabled}
          value={isStreetShop}
          onValueChanged={(e) => {
            handleChangeStreetShop(e.value);
          }}
          elementAttr={{ "aria-label": "Is Street Shop" }}
        />
        <h3>Street Shop</h3>
      </div>
    </>
  );
};

export default StreetShop;
