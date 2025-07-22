import React, {useState} from "react";
import Form, {GroupItem} from "devextreme-react/form";
import LoanDetailsAccordion from "../../loan-app/LoanDetailsAccordion";
import ProductParameter from "../../../components/product/loan/ProductParameter";
import ProductByBranch from "../../../components/product/loan/ProductByBranch";
import LpfByProduct from "../../../components/product/loan/LpfByProduct";
import ProductApplicationFileType from "../../../components/product/loan/ApplicationFileType";
import ProductQuestionary from "../../../components/product/loan/Questionary";
import ProductTerm from "../../../components/product/loan/ProductTerm";


export const AccordionProduct = ({productId}: { productId: string }) => {
  const [isAccordionProductParameterOpen, setIsAccordionProductParameterOpen] = useState(true);
  const [isAccordionProductTermOpen, setIsAccordionProductTermOpen] = useState(true);
  const [isAccordionProductByBranchOpen, setIsAccordionProductByBranchOpen] = useState(true);
  const [isAccordionLPFByProductOpen, setIsAccordionLPFByProductOpen] = useState(true);
  const [isAccordionApplicationFileTypeOpen, setIsAccordionApplicationFileTypeOpen] = useState(true);
  const [isAccordionQuestionarySellingOpen, setIsAccordionQuestionarySellingOpen] = useState(true);
  const [isAccordionQuestionaryNeighbourOpen, setIsAccordionQuestionaryNeighbourOpen] = useState(true);
  
  return (<>
	<Form>
	  <GroupItem visible={true} colSpan={2} cssClass={"p-0"}>
		<LoanDetailsAccordion
			title={"Product Parameters"}
			isOpen={isAccordionProductParameterOpen}
			onToggle={() => setIsAccordionProductParameterOpen((prev) => !prev)}
		>
		  <ProductParameter productId={productId}/>
		</LoanDetailsAccordion>
	  </GroupItem>
	  <GroupItem visible={true} colSpan={2} cssClass={"p-0"}>
		<LoanDetailsAccordion
			title={"Product Term"}
			isOpen={isAccordionProductTermOpen}
			onToggle={() => setIsAccordionProductTermOpen((prev) => !prev)}
		>
		  <ProductTerm productId={productId}/>
		</LoanDetailsAccordion>
	  </GroupItem>
	  <GroupItem visible={true} colSpan={2} cssClass={"p-0"}>
		<LoanDetailsAccordion
			title={"Product By Branch"}
			isOpen={isAccordionProductByBranchOpen}
			onToggle={() => setIsAccordionProductByBranchOpen((prev) => !prev)}
		>
		  <ProductByBranch productId={productId}/>
		</LoanDetailsAccordion>
	  </GroupItem>
	  <GroupItem visible={true} colSpan={2} cssClass={"p-0"}>
		<LoanDetailsAccordion
			title={"LPF By Product"}
			isOpen={isAccordionLPFByProductOpen}
			onToggle={() => setIsAccordionLPFByProductOpen((prev) => !prev)}
		>
		  <LpfByProduct productId={productId}/>
		</LoanDetailsAccordion>
	  </GroupItem>
	  <GroupItem visible={true} colSpan={2} cssClass={"p-0"}>
		<LoanDetailsAccordion
			title={"Application File Type"}
			isOpen={isAccordionApplicationFileTypeOpen}
			onToggle={() => setIsAccordionApplicationFileTypeOpen((prev) => !prev)}
		>
		  <ProductApplicationFileType productId={productId}/>
		</LoanDetailsAccordion>
	  </GroupItem>
	  <GroupItem visible={true} colSpan={2} cssClass={"p-0"}>
		<LoanDetailsAccordion
			title={"Questionary Selling"}
			isOpen={isAccordionQuestionarySellingOpen}
			onToggle={() => setIsAccordionQuestionarySellingOpen((prev) => !prev)}
		>
		  <ProductQuestionary productId={productId} category={"selling"}/>
		</LoanDetailsAccordion>
	  </GroupItem>
	  <GroupItem visible={true} colSpan={2} cssClass={"p-0"}>
		<LoanDetailsAccordion
			title={"Questionary Neighbour"}
			isOpen={isAccordionQuestionaryNeighbourOpen}
			onToggle={() => setIsAccordionQuestionaryNeighbourOpen((prev) => !prev)}
		>
		  <ProductQuestionary productId={productId} category={"neighbour"}/>
		</LoanDetailsAccordion>
	  </GroupItem>
	</Form>
  </>);
}
