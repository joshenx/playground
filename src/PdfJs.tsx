import React, { useCallback, useRef, useState, useEffect } from "react";
import * as PDFJS from "pdfjs-dist";
import type {
  PDFDocumentProxy,
  RenderParameters,
} from "pdfjs-dist/types/src/display/api";
import Button from "@seaweb/coral/components/Button";
import InputGroup from "@seaweb/coral/components/InputGroup";

interface PdfProps {
  src: string;
}

const PdfJs: React.FC<PdfProps> = ({ src }) => {
  PDFJS.GlobalWorkerOptions.workerSrc =
    "https://unpkg.com/pdfjs-dist@4.9.155/build/pdf.worker.min.mjs";
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [pdfDoc, setPdfDoc] = useState<PDFDocumentProxy | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const renderTaskRef = useRef<PDFJS.RenderTask | null>(null);

  const [scale, setScale] = useState(1.5);
  const [rotation, setRotation] = useState(0);

  const handleScaleChange = (newScale: number) => {
    setScale(newScale);
  };

  const handleRotationChange = (newRotation: number) => {
    setRotation(newRotation);
  };

  const renderPage = useCallback(
    (pageNum: number, pdf: PDFDocumentProxy | null) => {
      const canvas = canvasRef.current;
      if (!canvas || !pdf) {
        console.log("No canvas or pdf");
        return;
      }
      canvas.height = 0;
      canvas.width = 0;

      pdf
        .getPage(pageNum)
        .then((page) => {
          const viewport = page.getViewport({ scale, rotation });
          canvas.height = viewport.height;
          canvas.width = viewport.width;
          const renderContext: RenderParameters = {
            canvasContext: canvas.getContext("2d")!,
            viewport: viewport,
          };
          try {
            if (renderTaskRef.current) {
              renderTaskRef.current.cancel();
            }
            renderTaskRef.current = page.render(renderContext);
            return renderTaskRef.current.promise;
          } catch (error) {
            console.log(error);
          }
        })
        .catch((error) => console.log(error));
    },
    [scale, rotation]
  );

  useEffect(() => {
    const loadingTask = PDFJS.getDocument(src);

    loadingTask.promise
      .then((loadedDoc) => {
        setPdfDoc(loadedDoc);
      })
      .catch((error) => {
        console.error(error);
      });

    return () => {
      loadingTask.destroy();
      if (renderTaskRef.current) {
        renderTaskRef.current.cancel();
      }
    };
  }, [src]);

  useEffect(() => {
    if (pdfDoc) {
      renderPage(currentPage, pdfDoc);
    }
  }, [pdfDoc, currentPage, renderPage]);

  const nextPage = () => {
    if (pdfDoc && currentPage < pdfDoc.numPages) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = src;
    link.download = "document.pdf";
    link.click();
  };

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <InputGroup>
        <Button onClick={prevPage} disabled={currentPage <= 1}>
          Previous
        </Button>
        <Button
          onClick={nextPage}
          disabled={currentPage >= (pdfDoc?.numPages ?? -1)}
        >
          Next
        </Button>
        <Button onClick={() => handleScaleChange(scale / 2)}>Zoom Out</Button>
        <Button onClick={() => handleScaleChange(scale * 2)}>Zoom In</Button>
        <Button onClick={() => handleRotationChange(rotation + 90)}>
          Rotate
        </Button>
        <Button onClick={handleDownload}>Download</Button>
      </InputGroup>
      <div style={{ height: "700px", overflow: "auto" }}>
        <canvas ref={canvasRef}></canvas>
      </div>
    </div>
  );
};

export default PdfJs;
