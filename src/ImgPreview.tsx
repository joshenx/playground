import { useFilePreview } from "./contexts/useFilePreview";

export const ImgPreview = ({ src }: { src: string }) => {
  const { scale, rotation } = useFilePreview();
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        overflow: "auto",
        alignContent: "center",
      }}
    >
      <img
        src={src}
        alt="Image preview"
        style={{
          width: `${100 * scale}%`,
          objectFit: "contain",
          transform: `rotate(${rotation}deg)`,
        }}
      />
    </div>
  );
};
