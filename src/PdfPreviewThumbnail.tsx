import Loading from "./Loading";
import { Document, Page, pdfjs } from "react-pdf";

import "./ReactPdf.css";
import styled from "@seaweb/coral/hoc/styled";

pdfjs.GlobalWorkerOptions.workerSrc =
  "https://unpkg.com/pdfjs-dist@4.8.69/build/pdf.worker.min.mjs";

const PdfThumbnailWrapper = styled.div<{ $height: number; $width: number }>`
  display: flex;
  justify-content: center;
  align-items: center;
  height: ${({ $height }: { $height: number }) => `${$height}`}px;
  width: ${({ $width }: { $width: number }) => `${$width}`}px;
  overflow: hidden;
`;

const PdfPreviewThumbnail = ({
  file,
  width,
  height,
}: {
  file: File;
  width?: number;
  height?: number;
}) => {
  return (
    <PdfThumbnailWrapper $height={height} $width={width}>
      <Document
        loading={<Loading />}
        file={file}
        // onLoadSuccess={onDocumentLoadSuccess}
      >
        <Page
          className={"pdf-preview-thumbnail"}
          renderTextLayer={false}
          renderAnnotationLayer={false}
          pageNumber={1}
          loading={<Loading />}
        />
      </Document>
    </PdfThumbnailWrapper>
  );
};

export default PdfPreviewThumbnail;
