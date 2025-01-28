import {FC, useEffect} from "react";

export const CustomBankItem: FC<any> = (props, context) => {
	
	useEffect(() => {
		console.log("custom bank props ", props);
	}, []);
	
	const onBlurBank = (e: any) => {
		console.log("on blur bank ", e);
	}
	
	return <>
		<select className={"dx-texteditor-input-container dx-texteditor-input"} onBlur={onBlurBank}>
			<option value={1}>Option 1</option>
			<option value={2}>Option 2</option>
		</select>
	</>
}
