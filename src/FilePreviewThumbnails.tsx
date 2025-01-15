import IconButton, {
  IconButtonVariants,
} from "@seaweb/coral/components/IconButton";
import Upload from "@seaweb/coral/components/Upload";
import styled, { css } from "@seaweb/coral/hoc/styled";
import PlusIcon from "@seaweb/coral/icons/Plus";
import { useRef } from "react";
import { FileTypes } from "./FilePreview";
import ImgPreviewThumbnail from "./ImgPreviewThumbnail";
import PdfPreviewThumbnail from "./PdfPreviewThumbnail";
import { useFilePreview } from "./contexts/useFilePreview";

const GenericFileThumbnail = styled.div<{ $selected: boolean }>`
  position: relative;
  border-radius: 4px;
  border: 1px solid
    ${({ $selected }: { $selected: boolean }) =>
      $selected ? "blue" : "transparent"};
  cursor: pointer;
  overflow: hidden;
  ${({ $selected }: { $selected: boolean }) =>
    !$selected &&
    css`
      &::after {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.6);
      }
    `}
`;
const AddFileButton = styled(IconButton)`
  width: ${({ $width }: { $width: number }) => $width}px;
  height: ${({ $height }: { $height: number }) => $height}px;
`;

const THUMBNAIL_WIDTH = 32;
const THUMBNAIL_HEIGHT = 36;

enum FilePreviewThumbnailsDirections {
  ROW = "row",
  COLUMN = "column",
}
const FilePreviewThumbnails = ({
  direction = FilePreviewThumbnailsDirections.ROW,
}: {
  direction?: FilePreviewThumbnailsDirections;
}) => {
  const { files, uploadProps, handleAddFiles, selectedFile, setSelectedFile } =
    useFilePreview();

  const inputFileRef = useRef<HTMLInputElement>();
  const onFileChangeCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = e.target.files;
    if (!newFiles) return;

    const filesArray = Array.from(newFiles);
    handleAddFiles(filesArray);
  };

  const handeAddClick = () => {
    if (!inputFileRef?.current) return;
    inputFileRef.current.click();
  };

  const handleThumbnailClick = (file: File) => {
    setSelectedFile(file);
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: direction,
        alignItems: "center",
        gap: 4,
      }}
    >
      {files.map((file, index) => (
        <GenericFileThumbnail
          key={index}
          onClick={() => handleThumbnailClick(file)}
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

      <AddFileButton
        variant={IconButtonVariants.Outlined}
        onClick={handeAddClick}
        $height={THUMBNAIL_HEIGHT}
        $width={THUMBNAIL_WIDTH}
      >
        <PlusIcon />
      </AddFileButton>
      <Upload
        inputProps={{
          //@ts-expect-error coral is missing a ref attribute
          ref: inputFileRef,
        }}
        multiple
        {...uploadProps}
        onChangeCapture={onFileChangeCapture}
        style={{
          // hide it so †hat it's logic is accessible by the button
          display: "none",
        }}
      />
    </div>
  );
};

export default FilePreviewThumbnails;
