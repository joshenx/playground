import IconButton, {
  IconButtonVariants,
} from "@seaweb/coral/components/IconButton";
import Upload from "@seaweb/coral/components/Upload";
import styled from "@seaweb/coral/hoc/styled";
import { useRef } from "react";
import { FileTypes } from "./App";
import ImgPreviewThumbnail from "./ImgPreviewThumbnail";
import PdfPreviewThumbnail from "./PdfPreviewThumbnail";
import { useFilePreview } from "./contexts/useFilePreview";
import PlusIcon from "@seaweb/coral/icons/Plus";

const GenericFileThumbnail = styled.div<{ $selected: boolean }>`
  border-radius: 4px;
  border: 1px solid
    ${({ $selected }: { $selected: boolean }) =>
      $selected ? "blue" : "transparent"};
  cursor: pointer;
  overflow: hidden;
`;
const AddFileButton = styled(IconButton)`
  width: 32px;
  height: 36px;
`;

const THUMBNAIL_WIDTH = 32;
const THUMBNAIL_HEIGHT = 36;

enum FilePreviewThumbnailsDirections {
  ROW = "row",
  COLUMN = "column",
}
export const FilePreviewThumbnails = ({
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
      {files.map((file) => (
        <GenericFileThumbnail
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
