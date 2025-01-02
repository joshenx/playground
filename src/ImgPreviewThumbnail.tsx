import styled from "@seaweb/coral/hoc/styled";

const ImgThumbnailWrapper = styled.div<{ $height: number; $width: number }>`
  display: flex;
  justify-content: center;
  align-items: center;
  height: ${({ $height }: { $height: number }) => `${$height}`}px;
  width: ${({ $width }: { $width: number }) => `${$width}`}px;
  overflow: hidden;
  img {
    object-fit: contain;
    width: 100%;
    height: 100%;
  }
`;

const ImgPreviewThumbnail = ({
  file,
  width,
  height,
}: {
  file: File;
  width?: number;
  height?: number;
}) => {
  console.log(file);
  return (
    <ImgThumbnailWrapper $height={height} $width={width}>
      <img
        src={URL.createObjectURL(file as Blob)}
        alt={file.name}
        width={width}
        height={height}
      />
    </ImgThumbnailWrapper>
  );
};

export default ImgPreviewThumbnail;
