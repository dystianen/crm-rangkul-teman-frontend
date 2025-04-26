import { Popup } from "devextreme-react";
import { useState } from "react";
import { getFileBase64 } from "src/utils/helpers";
import PdfViewer from "../pdf-viewer/PdfViewer";

const PreviewFile = ({ file }: any) => {
  const [isPopupVisible, setPopupVisible] = useState(false);

  const parsedFile = getFileBase64(file);
  if (!parsedFile) return null;

  const { fileType, fileContent } = parsedFile;
  const isImage = fileType.includes("image/");
  const fullBase64 = `data:${fileType};base64,${fileContent}`;

  const handleClickDetail = () => {
    setPopupVisible(true);
  };

  return (
    <>
      {isImage ? (
        <div
          style={{
            position: "relative",
            display: "inline-block",
            cursor: "pointer"
          }}
          onClick={handleClickDetail}
        >
          <img src={fullBase64} alt="Income proof document" width="300px" loading="lazy" />
        </div>
      ) : (
        <div
          className="dx-card responsive-paddings preview-file-pdf"
          style={{
            height: 350,
            overflowY: "auto",
            cursor: "pointer"
          }}
          onClick={handleClickDetail}
        >
          <div
            style={{
              position: "relative",
              overflow: "hidden"
            }}
          >
            <PdfViewer url={fullBase64} />
          </div>
        </div>
      )}

      {/* Popup untuk Memperbesar Gambar/PDF */}
      <Popup
        visible={isPopupVisible}
        onHiding={() => setPopupVisible(false)}
        showTitle={false}
        dragEnabled={false}
        hideOnOutsideClick={true}
        maxWidth={700}
        height={"auto"}
        maxHeight={"80vh"}
      >
        <div
          style={{
            position: "relative",
            overflow: "hidden"
          }}
        >
          {isImage ? (
            <img src={fullBase64} alt="Income proof document" style={{ maxWidth: "100%" }} />
          ) : (
            <PdfViewer url={fullBase64} />
          )}
        </div>
      </Popup>
    </>
  );
};

export default PreviewFile;
