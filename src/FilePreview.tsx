import Upload, {
  BaseFile,
  UploadItemTypes,
} from "@seaweb/coral/components/Upload";
import styled from "@seaweb/coral/hoc/styled";
import { FilePreviewActions } from "./FilePreviewActions";
import FilePreviewThumbnails from "./FilePreviewThumbnails";
import { ImgPreview } from "./ImgPreview";
import ReactPdf from "./ReactPdf";
import { useFilePreview } from "./contexts/useFilePreview";

export enum FileTypes {
  Jpeg = "image/jpeg",
  Png = "image/png",
  Pdf = "application/pdf",
}
const FileDisplayContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: auto;
  border: 1px solid black;
`;
const FullSizeUpload = styled(Upload)`
  height: 100%;
  width: 100%;
`;

const FilePreview = () => {
  const { files, selectedFile, handleInitFiles, uploadProps } =
    useFilePreview();
  const hasFiles = files.length > 0;

  const handleOnDrop = async (
    acceptedFiles: BaseFile[]
    // rejectedFiles: BaseFile[]
  ) => {
    //TODO: smth with rejectedFiles

    // Convert BaseFile[] to File[]
    const newFiles = acceptedFiles.map((file) => file as File);

    console.log(newFiles);
    handleInitFiles(newFiles);
  };

  return (
    <div
      style={{
        width: "600px",
        height: "800px",
      }}
    >
      {hasFiles ? (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 8,
            height: "100%",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              flexGrow: 1,
              overflow: "auto",
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
        <FullSizeUpload
          multiple
          type={UploadItemTypes.List}
          onChange={(newFiles: BaseFile[]) => {
            handleInitFiles(newFiles.map((file) => file as File));
          }}
          onDrop={handleOnDrop}
          {...uploadProps}
        />
      )}
    </div>
  );
};

export default FilePreview;
