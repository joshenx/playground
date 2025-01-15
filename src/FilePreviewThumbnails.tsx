import IconButton, {
  IconButtonVariants,
} from "@seaweb/coral/components/IconButton";
import { Tab, TabList, TabVariants } from "@seaweb/coral/components/Tabs";
import Upload from "@seaweb/coral/components/Upload";
import styled, { css } from "@seaweb/coral/hoc/styled";
import PlusIcon from "@seaweb/coral/icons/Plus";
import { FileTypes } from "./FilePreview";
import ImgPreviewThumbnail from "./ImgPreviewThumbnail";
import PdfPreviewThumbnail from "./PdfPreviewThumbnail";
import { useAddFiles, useFilePreview } from "./contexts/useFilePreview";
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
const StyledTabList = styled(TabList)`
  gap: 4px;
`;
const StyledTab = styled(Tab)`
  padding: 0;
  &:not(:last-child)::after {
    height: 0;
  }
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
  const { files, selectedIndex, setSelectedIndex } = useFilePreview();

  const handleThumbnailClick = (idx: number) => {
    setSelectedIndex(idx);
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
      <StyledTabList
        variant={TabVariants.Text}
        wrapperProps={{ style: { overflow: "visible" } }}
      >
        {files.map((file, index) => (
          <StyledTab>
            <GenericFileThumbnail
              key={index}
              onClick={() => handleThumbnailClick(index)}
              $selected={selectedIndex === index}
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
          </StyledTab>
        ))}
      </StyledTabList>
      <AddFileThumbnailButton />
    </div>
  );
};

const AddFileThumbnailButton = () => {
  const { uploadProps } = useFilePreview();

  const { inputFileRef, onFileChangeCapture, handleAddClick } = useAddFiles();

  return (
    <>
      <AddFileButton
        variant={IconButtonVariants.Outlined}
        onClick={handleAddClick}
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
    </>
  );
};

export default FilePreviewThumbnails;
