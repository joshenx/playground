import Upload, {
  BaseFile,
  UploadItemTypes,
} from "@seaweb/coral/components/Upload";
import styled from "@seaweb/coral/hoc/styled";
import "./App.css";
import ExpandableTable from "./ExpandableTable";
import { FilePreviewActions } from "./FilePreviewActions";
import { FilePreviewThumbnails } from "./FilePreviewThumbnails";
import { ImgPreview } from "./ImgPreview";
import ReactPdf from "./ReactPdf";
import { FilePreviewProvider } from "./contexts/FilePreviewProvider";
import { useFilePreview } from "./contexts/useFilePreview";
// import PdfJs from "./PdfJs";

export enum FileTypes {
  Jpeg = "image/jpeg",
  Png = "image/png",
  Pdf = "application/pdf",
}

const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 20px;
`;
const FileDisplayContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 600px;
  height: 800px;
  overflow: hidden;
  border: 1px solid black;
`;

function App() {
  return (
    <AppContainer>
      <ExpandableTable
        records={Array(5)
          .fill(null)
          .map((_, idx) => ({
            city: "c",
            description: "p",
            author: "a",
            new: "n",
            id: idx,
          }))}
        keyOrder={["id", "city", "description", "new", "author"]}
        columns={[
          { label: "ID", width: 300 },
          { label: "Origin", width: 300 },
          { label: "Description", width: 300 },
          { label: "new", width: 300 },
          { label: "Author", width: 300 },
        ]}
        exRange={[1, 4]}
      />
      <FilePreviewProvider>
        <FilePreview />
      </FilePreviewProvider>
    </AppContainer>
  );
}

const FilePreview = () => {
  const { files, selectedFile, handleInitFiles, uploadProps } =
    useFilePreview();
  const hasFiles = files.length > 0;

  const handleOnDrop = async (
    acceptedFiles: BaseFile[],
    rejectedFiles: BaseFile[]
  ) => {
    console.log("REJECTED", rejectedFiles);

    // Convert BaseFile[] to File[]
    const newFiles = acceptedFiles.map((file) => file as File);

    console.log(newFiles);
    handleInitFiles(newFiles);
  };

  return (
    <>
      {hasFiles ? (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
            }}
          >
            <FileDisplayContainer>
              {selectedFile &&
                (() => {
                  switch (selectedFile.type) {
                    case FileTypes.Jpeg:
                    case FileTypes.Png:
                      return (
                        <ImgPreview src={URL.createObjectURL(selectedFile)} />
                      );
                    case FileTypes.Pdf:
                      return (
                        <>
                          {/* <PdfObjectContainer>
                            <h2>{"<object/>/<iframe/>"}</h2>
                            {
                              <object
                                title="Sample PDF document"
                                type="application/pdf"
                                data={URL.createObjectURL(file)}
                                width="100%"
                                height="100%"
                              >
                                Sorry, your browser doesn't support PDF preview.{" "}
                                <a
                                  href={URL.createObjectURL(file)}
                                  download={file.name}
                                >
                                  Download
                                </a>
                              </object>
                            }
                          </PdfObjectContainer> */}
                          <h2>{"<PdfJs/>"}</h2>
                          {<ReactPdf src={selectedFile} />}
                          {/* {files.length > 0 && <PdfJs src={URL.createObjectURL(files[0])} />} */}
                        </>
                      );
                    default:
                      return null;
                  }
                })()}
            </FileDisplayContainer>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <FilePreviewThumbnails />
            <FilePreviewActions />
          </div>
        </div>
      ) : (
        <Upload
          multiple
          type={UploadItemTypes.List}
          onChange={(newFiles: BaseFile[]) => {
            handleInitFiles(newFiles.map((file) => file as File));
          }}
          onDrop={handleOnDrop}
          {...uploadProps}
        />
      )}

      {/* <PdfObjectContainer>
      <h2>{"<iframe/>"}</h2>
      {files.length > 0 && (
        <iframe
          title="Sample PDF document"
          src={URL.createObjectURL(files[0])}
          width="100%"
          height="100%"
        >
          Sorry, your browser doesn't support PDF preview.{" "}
          <a href={URL.createObjectURL(files[0])} download={files[0].name}>
            Download
          </a>
        </iframe>
      )}
    </PdfObjectContainer> */}
    </>
  );
};

export default App;
