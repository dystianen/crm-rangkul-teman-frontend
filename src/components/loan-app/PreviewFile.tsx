import { Popup } from "devextreme-react";
import { useState } from "react";
import { getFileBase64 } from "src/api/helper";
import PdfViewer from "../pdf-viewer/PdfViewer";

const PreviewFile = ({ file }: any) => {
  const [isPopupVisible, setIsPopupVisible] = useState(false);

  if (!file) return null;

  const { fileType, fileContent } = file;
  const fileBase64 = getFileBase64(fileType, fileContent);
  const isImage = fileType.includes("image/");

  return (
    <>
      {isImage ? (
        <>
          {/* Gambar Kecil */}
          <img
            src={fileBase64}
            alt="Income proof document"
            width="300px"
            loading="lazy"
            style={{ cursor: "pointer" }}
            onClick={() => setIsPopupVisible(true)}
          />

          {/* Popup untuk Memperbesar Gambar */}
          <Popup
            visible={isPopupVisible}
            onHiding={() => setIsPopupVisible(false)}
            showTitle={false}
            width="auto"
            height="auto"
            dragEnabled={false}
            hideOnOutsideClick={true}
          >
            <img
              src={fileBase64}
              alt="Income proof document"
              style={{ maxWidth: "100%", maxHeight: "80vh" }}
            />
          </Popup>
        </>
      ) : (
        <PdfViewer url={fileBase64} />
      )}
    </>
  );
};

export default PreviewFile;
