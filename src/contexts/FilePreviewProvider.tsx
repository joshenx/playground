import { ReactNode, createContext, useState } from "react";
import { FileTypes } from "../FilePreview";

interface FilePreviewContextProps {
  files: File[];
  handleInitFiles: (files: File[]) => void;
  DEFAULT_SCALE: number;
  DEFAULT_ROTATION: number;
  selectedIndex: number;
  setSelectedIndex: React.Dispatch<React.SetStateAction<number>>;
  selectedFile: File | null;
  scale: number;
  rotation: number;
  resetToDefaults: () => void;
  handleDownload: (file: File) => void;
  handleScaleChange: (newScale: number) => void;
  handleRotationChange: (newRotation: number) => void;
  handleAddFiles: (newFiles: File[]) => void;
  handleDelete: (file: File) => void;
  getIndexOfFile: (file: File) => number;
  uploadProps: {
    accept: string[];
    maxSize: number;
    files: File[];
  };
}

type TransformedFile = {
  file: File;
  scale: number;
  rotation: number;
};

const FilePreviewContext = createContext<FilePreviewContextProps | undefined>(
  undefined
);

export const FilePreviewProvider = ({ children }: { children: ReactNode }) => {
  const [files, setFiles] = useState<TransformedFile[]>([]);
  const DEFAULT_SCALE = 1;
  const DEFAULT_ROTATION = 0;

  const [selectedIndex, setSelectedIndex] = useState(0);

  /**
   * Downloads the specified file.
   * @param {File} file - The file to download.
   */
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

  /**
   * Initializes the file list with the provided files.
   * @param {File[]} files - The files to initialize.
   */
  const handleInitFiles = (files: File[]) => {
    if (files.length <= 0) return;

    handleAddFiles(files);
    setSelectedIndex(0);
  };

  /**
   * Deletes the specified file from the file list.
   * @param {File} file - The file to delete.
   */
  const handleDelete = (file: File) => {
    const indexToDelete = getIndexOfFile(file);

    if (indexToDelete < 0) {
      console.warn("No file to delete found!");
    }

    // set selected as next-in-order
    setSelectedIndex(indexToDelete - 1 < 0 ? indexToDelete : indexToDelete - 1);

    // delete file
    setFiles(files.filter((_, index) => index !== indexToDelete));
  };

  /**
   * Changes the scale of the file preview.
   * @param {number} newScale - The new scale value.
   */
  const handleScaleChange = (newScale: number) => {
    setFiles(
      files.map((f, index) => {
        if (index === selectedIndex) {
          return {
            ...f,
            scale: newScale,
          };
        }
        return f;
      })
    );
  };

  /**
   * Changes the rotation of the file preview.
   * @param {number} newRotation - The new rotation value.
   */
  const handleRotationChange = (newRotation: number) => {
    setFiles(
      files.map((f, index) => {
        if (index === selectedIndex) {
          return {
            ...f,
            rotation: newRotation,
          };
        }
        return f;
      })
    );
  };

  /**
   * Adds new files to the file list.
   * @param {File[]} newFiles - The new files to add.
   */
  const handleAddFiles = (newFiles: File[]) => {
    const newFilesWithTx: TransformedFile[] = newFiles.map((file) => ({
      file,
      scale: DEFAULT_SCALE,
      rotation: DEFAULT_ROTATION,
    }));
    const totalFiles = [...files, ...newFilesWithTx];
    setFiles(totalFiles);

    // set selected as last newly added file
    setSelectedIndex(totalFiles.length - 1);
  };

  const getIndexOfFile = (file: File) => {
    console.log(files);
    return files.findIndex((f) => f.file.name === file.name);
  };

  /**
   * Resets the scale and rotation to their default values.
   */
  const resetToDefaults = () => {
    setFiles(
      files.map((f, index) => {
        if (index === selectedIndex) {
          return {
            ...f,
            scale: DEFAULT_SCALE,
            rotation: DEFAULT_ROTATION,
          };
        }
        return f;
      })
    );
  };

  /**
   * * Upload component props
   */
  const MAX_FILESIZE_ALLOWED = 2;
  const ALLOWED_FILE_EXTENSIONS = [".pdf", ".jpg", ".jpeg", ".png"];
  const MB = 1024 * 1024;

  const uploadProps = {
    accept: ALLOWED_FILE_EXTENSIONS,
    maxSize: MAX_FILESIZE_ALLOWED * MB,
    files: files.map((file) => file.file),
  };

  return (
    <FilePreviewContext.Provider
      value={{
        files: files.map((file) => file.file),
        handleInitFiles,
        DEFAULT_SCALE,
        DEFAULT_ROTATION,
        getIndexOfFile,
        selectedIndex,
        setSelectedIndex,
        selectedFile: files[selectedIndex]?.file,
        scale: files[selectedIndex]
          ? files[selectedIndex].scale
          : DEFAULT_SCALE,
        rotation: files[selectedIndex]
          ? files[selectedIndex].rotation
          : DEFAULT_ROTATION,
        resetToDefaults,
        handleDownload,
        handleScaleChange,
        handleRotationChange,
        handleAddFiles,
        handleDelete,
        uploadProps,
      }}
    >
      {children}
    </FilePreviewContext.Provider>
  );
};

export default FilePreviewContext;
