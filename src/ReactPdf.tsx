import Button from "@seaweb/coral/components/Button";
import InputGroup from "@seaweb/coral/components/InputGroup";
import React, { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/TextLayer.css";
import "react-pdf/dist/Page/AnnotationLayer.css";
import Loading from "./Loading";

import "./ReactPdf.css";
import { useFilePreview } from "./contexts/useFilePreview";

interface PdfProps {
  src: File;
}

pdfjs.GlobalWorkerOptions.workerSrc =
  "https://unpkg.com/pdfjs-dist@4.8.69/build/pdf.worker.min.mjs";

const ReactPdf: React.FC<PdfProps> = ({ src }) => {
  const { scale, rotation } = useFilePreview();
  const [numPages, setNumPages] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState(1);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
  }

  const nextPage = () => {
    if (currentPage < numPages) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <InputGroup>
        <Button onClick={prevPage} disabled={currentPage <= 1}>
          Previous
        </Button>
        <Button onClick={nextPage} disabled={currentPage >= (numPages ?? -1)}>
          Next
        </Button>
      </InputGroup>
      <div
        style={{
          height: "700px",
          width: "100%",
          overflow: "auto",
        }}
      >
        <Document
          loading={<Loading />}
          file={src}
          onLoadSuccess={onDocumentLoadSuccess}
        >
          <Page
            pageNumber={currentPage}
            scale={scale}
            rotate={rotation}
            loading={<Loading />}
          />
        </Document>
      </div>
    </div>
  );
};

export default ReactPdf;
