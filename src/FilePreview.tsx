import Tabs, { TabPanel, TabPanels } from "@seaweb/coral/components/Tabs";
import Upload, {
  BaseFile,
  UploadItemTypes,
} from "@seaweb/coral/components/Upload";
import styled from "@seaweb/coral/hoc/styled";
import { useDropzone } from "react-dropzone";
import { FilePreviewActions } from "./FilePreviewActions";
import FilePreviewThumbnails from "./FilePreviewThumbnails";
import { ImgPreview } from "./ImgPreview";
import ReactPdf from "./ReactPdf";
import { useAddFiles, useFilePreview } from "./contexts/useFilePreview";

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
const FileDisplayWrapper = styled.div`
  // position is relative so that the AddFileDropzone can be positioned absolutely
  position: relative;
  display: flex;
  flex-direction: column;
  height: calc(100% - 44px);
  z-index: 1;

  // render a gray overlay when dragging files into this dropzone
  &::after {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    transition: all 0.3s ease;
    ${({ $isDragActive }: { $isDragActive: boolean }) =>
      $isDragActive
        ? `background-color: rgba(0, 0, 0, 0.2);`
        : `background-color: rgba(0, 0, 0, 0);`}

    z-index: 2;
    content: "";
    pointer-events: none;
  }
`;
const FilePanels = styled(TabPanels)`
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

  const { addFiles } = useAddFiles();

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    ...uploadProps,
    accept: {
      "image/*": [".jpg", ".jpeg", ".png"],
      "application/pdf": [".pdf"],
    },
    multiple: true,
    onDrop: (acceptedFiles) => {
      addFiles([...acceptedFiles]);
    },
    noClick: true,
  });

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
            position: "relative",
            display: "flex",
            flexDirection: "column",
            gap: 8,
            height: "100%",
          }}
        >
          <FileDisplayWrapper
            {...getRootProps({ className: "dropzone" })}
            $isDragActive={isDragActive}
          >
            <input {...getInputProps()} />
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
          </FileDisplayWrapper>
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

export const AddFileDropzone = ({
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => {
  const { uploadProps } = useFilePreview();

  const { addFiles } = useAddFiles();

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    ...uploadProps,
    accept: {
      "image/*": [".jpg", ".jpeg", ".png"],
      "application/pdf": [".pdf"],
    },
    multiple: true,
    onDrop: (acceptedFiles) => {
      addFiles([...acceptedFiles]);
    },
    noClick: true,
  });

  return (
    <div
      {...getRootProps({ className: "dropzone" })}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        height: "100%",
        width: "100%",
        zIndex: 2,

        transition: "background-color 0.3s",
        opacity: 0.2,
        ...(isDragActive && { backgroundColor: "black" }),
      }}
      {...props}
    >
      <input {...getInputProps()} />
    </div>
  );
};

export default FilePreview;
