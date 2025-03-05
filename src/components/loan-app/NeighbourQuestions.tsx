import DataGrid, { Column, Pager, Paging } from "devextreme-react/data-grid";
import RadioGroup from "devextreme-react/radio-group";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { fetchNeighbourQuestions, submitNeighbourQuestions } from "src/api/apploan";

interface NeighbourQuestion {
  questionId: string;
  question: string;
  answer: boolean | null;
}

interface NeighbourQuestionsProps {
  appId: string;
  disabled?: boolean;
}

const NeighbourQuestions: React.FC<NeighbourQuestionsProps> = ({ appId, disabled = false }) => {
  const [neighbourQuestions, setNeighbourQuestions] = useState<NeighbourQuestion[]>([]);
  const [selectedValues, setSelectedValues] = useState<Record<string, boolean | null>>({});
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({});
  const pendingRequests = useRef<Record<string, boolean>>({});

  const loadNeighbourQuestions = async () => {
    try {
      const res: NeighbourQuestion[] = await fetchNeighbourQuestions(appId);
      setNeighbourQuestions(res);

      const initialValues = res.reduce(
        (acc, item) => {
          acc[item.questionId] = item.answer;
          return acc;
        },
        {} as { [key: string]: boolean | null }
      );

      setSelectedValues(initialValues);
    } catch (error) {
      console.error("Error fetching neighbour questions:", error);
    }
  };

  useEffect(() => {
    loadNeighbourQuestions();
  }, [appId]);

  const submitQuestion = async (questionId: string, answer: boolean) => {
    if (pendingRequests.current[questionId]) {
      return;
    }

    pendingRequests.current[questionId] = true;
    setLoadingStates((prev) => ({ ...prev, [questionId]: true }));

    try {
      await submitNeighbourQuestions(appId, { questionId, answer });
      setSelectedValues((prev) => ({ ...prev, [questionId]: answer }));
    } catch (error) {
      setSelectedValues((prev) => ({ ...prev, [questionId]: !answer }));
    } finally {
      setLoadingStates((prev) => ({ ...prev, [questionId]: false }));
      pendingRequests.current[questionId] = false;
    }
  };

  const handleNeighbourRadioChange = useCallback((questionId: string, answer: boolean) => {
    setSelectedValues((prev) => ({ ...prev, [questionId]: answer }));
    submitQuestion(questionId, answer);
  }, []);

  const RadioGroupCell = React.memo(({ data }: { data: NeighbourQuestion }) => (
    <RadioGroup
      items={[
        { label: "Yes", value: true },
        { label: "No", value: false }
      ]}
      value={selectedValues[data.questionId]}
      layout="horizontal"
      displayExpr="label"
      valueExpr="value"
      readOnly={disabled || loadingStates[data.questionId]}
      onValueChanged={(e) => handleNeighbourRadioChange(data.questionId, e.value)}
    />
  ));

  return (
    <>
      <h3 style={{ marginBottom: 16 }}>Neighbour Questions</h3>
      <DataGrid dataSource={neighbourQuestions} wordWrapEnabled showBorders repaintChangesOnly>
        <Column
          caption="No."
          width={70}
          alignment="center"
          cellTemplate={(container, options) => {
            container.innerText = options.rowIndex + 1;
          }}
        />
        <Column dataField="question" caption="Questions" />
        <Column
          caption="Choose"
          width={200}
          cellRender={({ data }) => <RadioGroupCell data={data} />}
        />

        <Paging defaultPageSize={50} />
        <Pager showPageSizeSelector={true} showInfo={true} allowedPageSizes={[10, 50, 100]} />
      </DataGrid>
    </>
  );
};

export default React.memo(NeighbourQuestions);
