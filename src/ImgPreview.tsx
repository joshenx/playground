import { useFilePreview } from "./contexts/useFilePreview";

export const ImgPreview = ({ src }: { src: string }) => {
  const { scale, rotation } = useFilePreview();
  return (
    <div style={{ width: "100%", height: "100%", overflow: "hidden" }}>
      <img
        src={src}
        alt="Image preview"
        style={{
          objectFit: "contain",
          transform: `scale(${scale}) rotate(${rotation}deg)`,
        }}
      />
    </div>
  );
};
