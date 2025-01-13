import { createContext, useState, ReactNode } from "react";
import { FileTypes } from "../App";

interface FilePreviewContextProps {
  DEFAULT_SCALE: number;
  DEFAULT_ROTATION: number;
  selectedFile: File | null;
  setSelectedFile: (file: File) => void;
  scale: number;
  rotation: number;
  resetToDefaults: () => void;
  handleDownload: (file: File) => void;
  handleScaleChange: (newScale: number) => void;
  handleRotationChange: (newRotation: number) => void;
}

const FilePreviewContext = createContext<FilePreviewContextProps | undefined>(
  undefined
);

export const FilePreviewProvider = ({ children }: { children: ReactNode }) => {
  const DEFAULT_SCALE = 1;
  const DEFAULT_ROTATION = 0;

  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const [scale, setScale] = useState(DEFAULT_SCALE);
  const [rotation, setRotation] = useState(DEFAULT_ROTATION);

  const handleDownload = (file: File) => {
    const link = document.createElement("a");
    link.href = URL.createObjectURL(file);

    switch (file.type) {
      case FileTypes.Jpeg:
      case FileTypes.Png:
        link.download = "image." + file.type.split("/")[1];
        break;
      case FileTypes.Pdf:
        link.download = "document.pdf";
        break;
      default:
        link.download = "file";
        break;
    }

    link.click();
  };

  const handleScaleChange = (newScale: number) => {
    setScale(newScale);
  };

  const handleRotationChange = (newRotation: number) => {
    setRotation(newRotation);
  };

  const onFileChange = (file: File) => {
    setSelectedFile(file);
    resetToDefaults();
  };

  const resetToDefaults = () => {
    console.log("Resetting to defaults");
    setScale(DEFAULT_SCALE);
    setRotation(DEFAULT_ROTATION);
  };

  return (
    <FilePreviewContext.Provider
      value={{
        DEFAULT_SCALE,
        DEFAULT_ROTATION,
        scale,
        rotation,
        resetToDefaults,
        handleDownload,
        handleScaleChange,
        handleRotationChange,
        selectedFile,
        setSelectedFile: onFileChange,
      }}
    >
      {children}
    </FilePreviewContext.Provider>
  );
};

export default FilePreviewContext;
