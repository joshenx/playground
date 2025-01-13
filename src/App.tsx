import { useState } from "react";
import "./App.css";
import Upload, {
  BaseFile,
  UploadItemTypes,
} from "@seaweb/coral/components/Upload";
import styled from "@seaweb/coral/hoc/styled";
import ReactPdf from "./ReactPdf";
import PdfPreviewThumbnail from "./PdfPreviewThumbnail";
import ImgPreviewThumbnail from "./ImgPreviewThumbnail";
import { FilePreviewProvider } from "./contexts/FilePreviewProvider";
import Button from "@seaweb/coral/components/Button";
import InputGroup from "@seaweb/coral/components/InputGroup";
import { useFilePreview } from "./contexts/useFilePreview";
import { ImgPreview } from "./ImgPreview";
import ExpandableTable from "./ExpandableTable";
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
  border: 1px solid black;
`;

function App() {
  return (
    <AppContainer>
      <ExpandableTable
        records={Array(3)
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
        <FilePreviewActions />
      </FilePreviewProvider>
    </AppContainer>
  );
}

const FilePreviewActions = () => {
  const {
    selectedFile,
    resetToDefaults,
    scale,
    rotation,
    handleDownload,
    handleScaleChange,
    handleRotationChange,
  } = useFilePreview();
  const [files, setFiles] = useState<File[]>([]);

  const MAX_FILESIZE_ALLOWED = 2;
  const ALLOWED_FILE_EXTENSIONS = [".pdf", ".jpg", ".jpeg", ".png"];
  const MB = 1024 * 1024;

  const handleOnDrop = async (
    acceptedFiles: BaseFile[],
    rejectedFiles: BaseFile[]
  ) => {
    console.log("REJECTED", rejectedFiles);

    // Convert BaseFile[] to File[]
    const newFiles = acceptedFiles.map((file) => file as File);

    console.log(newFiles);
    setFiles(newFiles);
  };

  return (
    <>
      <Upload
        multiple
        type={UploadItemTypes.List}
        accept={ALLOWED_FILE_EXTENSIONS}
        maxSize={MAX_FILESIZE_ALLOWED * MB}
        files={files}
        onChange={(newFiles) => {
          setFiles(newFiles.map((file) => file as File));
        }}
        onDrop={handleOnDrop}
      />
      <div
        style={{
          display: "flex",
          flexDirection: "row",
        }}
      >
        <FilePreview files={files} />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
          }}
        >
          <InputGroup>
            <Button onClick={() => handleScaleChange(scale / 2)}>
              Zoom Out
            </Button>
            <Button onClick={resetToDefaults}>Zoom Default</Button>
            <Button onClick={() => handleScaleChange(scale * 2)}>
              Zoom In
            </Button>
            <Button onClick={() => handleRotationChange(rotation + 90)}>
              Rotate
            </Button>
            <Button onClick={() => handleDownload(selectedFile!)}>
              Download
            </Button>
          </InputGroup>
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
      </div>
    </>
  );
};

const GenericFileThumbnail = styled.div<{ $selected: boolean }>`
  border: 2px solid
    ${({ $selected }: { $selected: boolean }) =>
      $selected ? "blue" : "transparent"};
  margin: 10px;
  cursor: pointer;
`;
const FilePreview = ({ files }: { files: File[] }) => {
  const THUMBNAIL_WIDTH = 200;
  const THUMBNAIL_HEIGHT = 200;
  const { selectedFile, setSelectedFile } = useFilePreview();

  const handleOnClick = (file: File) => {
    setSelectedFile(file);
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
      }}
    >
      {files.map((file) => (
        <GenericFileThumbnail
          onClick={() => handleOnClick(file)}
          $selected={selectedFile === file}
        >
          {(() => {
            switch (file.type) {
              case FileTypes.Jpeg:
              case FileTypes.Png:
                return (
                  <ImgPreviewThumbnail
                    file={file}
                    height={THUMBNAIL_HEIGHT}
                    width={THUMBNAIL_WIDTH}
                  />
                );
              case FileTypes.Pdf:
                return (
                  <PdfPreviewThumbnail
                    file={file}
                    height={THUMBNAIL_HEIGHT}
                    width={THUMBNAIL_WIDTH}
                  />
                );
              default:
                return null;
            }
          })()}
        </GenericFileThumbnail>
      ))}
    </div>
  );
};

export default App;
