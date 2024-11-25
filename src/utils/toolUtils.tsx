import {useCallback, useState} from "react";

export function useToggle(initialValue: boolean) {
    const [toggleValue, setToggleValue] = useState(initialValue);
    const toggler = useCallback(() => setToggleValue(toggleValue => !toggleValue), []);
    return [toggleValue, toggler];
}