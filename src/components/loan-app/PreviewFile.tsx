import { Popup } from "devextreme-react";
import { useState } from "react";
import { getFileBase64 } from "src/api/helper";
import PdfViewer from "../pdf-viewer/PdfViewer";

const PreviewFile = ({ file }: any) => {
  const [isPopupVisible, setPopupVisible] = useState(false);

  if (!file) return null;

  const { fileType, fileContent } = file;
  const fileBase64 = getFileBase64(fileType, fileContent);
  const isImage = fileType.includes("image/");

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
          <img src={fileBase64} alt="Income proof document" width="300px" loading="lazy" />
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
            <PdfViewer url={fileBase64} />
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
            <img src={fileBase64} alt="Income proof document" style={{ maxWidth: "100%" }} />
          ) : (
            <PdfViewer url={fileBase64} />
          )}
        </div>
      </Popup>
    </>
  );
};

export default PreviewFile;
