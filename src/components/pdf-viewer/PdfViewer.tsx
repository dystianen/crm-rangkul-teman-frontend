import React, {useMemo, useState} from "react";

import {pdfjs, Document, Page as ReactPdfPage} from "react-pdf";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const width = 794;
const height = 1123;

const Page = React.forwardRef<any, any>(({pageNumber}, ref) => {
    return (
        <div ref={ref}>
            <ReactPdfPage pageNumber={pageNumber} width={width} height={height}/>
        </div>
    );
});
const PdfViewer: React.FC<any> = ({url}) => {
    const [numPages, setNumPages] = useState<any>(null);
    const onDocumentLoadSuccess = (jp: any) => {
        setNumPages(jp.numPages);
    }

    const pages = useMemo(() => {
        let pageArr = [];
        if (numPages != null) {
            for (let i = 1; i <= numPages; i++) {
                pageArr.push(<Page key={i} pageNumber={i}/>)
            }
        }
        return pageArr;
    }, [numPages]);

    return <>
        <Document
            file={url}
            noData={
                <div className="pdf-nodata">Tidak ada data</div>
            }
            onLoadSuccess={onDocumentLoadSuccess}
        >
                {pages}
        </Document>
    </>
}
export default PdfViewer;