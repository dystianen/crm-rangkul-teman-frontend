import DataGrid, { Column, Pager, Paging } from "devextreme-react/data-grid";
import RadioGroup from "devextreme-react/radio-group";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { fetchSellingQuestions, submitSellingQuestions } from "src/api/apploan";

interface SellingQuestion {
  questionId: string;
  question: string;
  answer: boolean | null;
}

interface SellingQuestionsProps {
  appId: string;
  disabled?: boolean;
}

const SellingQuestions: React.FC<SellingQuestionsProps> = ({ appId, disabled = false }) => {
  const [sellingQuestions, setSellingQuestions] = useState<SellingQuestion[]>([]);
  const [selectedValues, setSelectedValues] = useState<Record<string, boolean | null>>({});
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({});
  const pendingRequests = useRef<Record<string, boolean>>({});

  const loadSellingQuestions = async () => {
    try {
      const res: SellingQuestion[] = await fetchSellingQuestions(appId);
      setSellingQuestions(res);

      const initialValues = res.reduce(
        (acc, item) => {
          acc[item.questionId] = item.answer;
          return acc;
        },
        {} as { [key: string]: boolean | null }
      );

      setSelectedValues(initialValues);
    } catch (error) {
      console.error("Error fetching selling questions:", error);
    }
  };

  useEffect(() => {
    loadSellingQuestions();
  }, [appId]);

  const submitQuestion = async (questionId: string, answer: boolean) => {
    if (pendingRequests.current[questionId]) {
      return;
    }

    pendingRequests.current[questionId] = true;
    setLoadingStates((prev) => ({ ...prev, [questionId]: true }));

    try {
      await submitSellingQuestions(appId, { questionId, answer });
      setSelectedValues((prev) => ({ ...prev, [questionId]: answer }));
    } catch (error) {
      setSelectedValues((prev) => ({ ...prev, [questionId]: !answer }));
    } finally {
      setLoadingStates((prev) => ({ ...prev, [questionId]: false }));
      pendingRequests.current[questionId] = false;
    }
  };

  const handleSellingRadioChange = useCallback((questionId: string, answer: boolean) => {
    setSelectedValues((prev) => ({ ...prev, [questionId]: answer }));
    submitQuestion(questionId, answer);
  }, []);

  const RadioGroupCell = React.memo(({ data }: { data: SellingQuestion }) => (
    <RadioGroup
      items={[
        { label: "Yes", value: true },
        { label: "No", value: false }
      ]}
      value={selectedValues[data.questionId]}
      layout="horizontal"
      displayExpr="label"
      valueExpr="value"
      disabled={disabled || loadingStates[data.questionId]}
      onValueChanged={(e) => handleSellingRadioChange(data.questionId, e.value)}
    />
  ));

  return (
    <div className="dx-card responsive-paddings next-card">
      <h3 style={{ marginBottom: 16 }}>Selling Questions</h3>
      <DataGrid
        dataSource={sellingQuestions}
        columnAutoWidth={true}
        wordWrapEnabled={false}
        showBorders={true}
        repaintChangesOnly={true}
      >
        <Column
          caption="No."
          width={70}
          alignment="center"
          cellTemplate={(container, options) => {
            container.innerText = options.rowIndex + 1;
          }}
        />
        <Column dataField="question" caption="Questions" />
        <Column caption="Choose" cellRender={({ data }) => <RadioGroupCell data={data} />} />

        <Paging defaultPageSize={50} />
        <Pager showPageSizeSelector={true} showInfo={true} allowedPageSizes={[10, 50, 100]} />
      </DataGrid>
    </div>
  );
};

export default React.memo(SellingQuestions);
