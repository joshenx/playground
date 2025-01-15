import Tabs, { TabPanel, TabPanels } from "@seaweb/coral/components/Tabs";
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
const FileDisplayContainer = styled(TabPanel)`
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: auto;
  border: 1px solid black;
`;
const FilePanels = styled(TabPanels)`
  display: flex;
  flex-direction: column;
  flex-grow: 1;

  > * {
    height: 100%;
  }
`;
const FullSizeUpload = styled(Upload)`
  height: 100%;
  width: 100%;
`;

const FilePreview = () => {
  const { files, selectedIndex, handleInitFiles, uploadProps } =
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
    <Tabs
      index={selectedIndex}
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
          <FilePanels>
            {files.map((f) => (
              <FileDisplayContainer>
                {f &&
                  (() => {
                    switch (f.type) {
                      case FileTypes.Jpeg:
                      case FileTypes.Png:
                        return <ImgPreview src={URL.createObjectURL(f)} />;
                      case FileTypes.Pdf:
                        return (
                          <>
                            {<ReactPdf src={f} />}
                            {/* {files.length > 0 && <PdfJs src={URL.createObjectURL(files[0])} />} */}
                          </>
                        );
                      default:
                        return null;
                    }
                  })()}
              </FileDisplayContainer>
            ))}
          </FilePanels>
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
    </Tabs>
  );
};

export default FilePreview;
