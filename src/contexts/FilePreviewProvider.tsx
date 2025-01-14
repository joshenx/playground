import { ReactNode, createContext, useState } from "react";
import { FileTypes } from "../App";

interface FilePreviewContextProps {
  files: File[];
  handleInitFiles: (files: File[]) => void;
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
  handleAddFiles: (newFiles: File[]) => void;
  handleDelete: (file: File) => void;
  uploadProps: object;
}

const FilePreviewContext = createContext<FilePreviewContextProps | undefined>(
  undefined
);

export const FilePreviewProvider = ({ children }: { children: ReactNode }) => {
  const [files, setFiles] = useState<File[]>([]);
  const DEFAULT_SCALE = 1;
  const DEFAULT_ROTATION = 0;

  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const [scale, setScale] = useState(DEFAULT_SCALE);
  const [rotation, setRotation] = useState(DEFAULT_ROTATION);

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

    setFiles(files);
    setSelectedFile(files[0]);
  };

  /**
   * Deletes the specified file from the file list.
   * @param {File} file - The file to delete.
   */
  const handleDelete = (file: File) => {
    const indexToDelete = files.findIndex((target) => target === file);

    // set selected as next-in-order
    setSelectedFile(files[indexToDelete - 1]);

    // delete file
    setFiles(files.filter((_, index) => index !== indexToDelete));
  };

  /**
   * Changes the scale of the file preview.
   * @param {number} newScale - The new scale value.
   */
  const handleScaleChange = (newScale: number) => {
    setScale(newScale);
  };

  /**
   * Changes the rotation of the file preview.
   * @param {number} newRotation - The new rotation value.
   */
  const handleRotationChange = (newRotation: number) => {
    setRotation(newRotation);
  };

  /**
   * Adds new files to the file list.
   * @param {File[]} newFiles - The new files to add.
   */
  const handleAddFiles = (newFiles: File[]) => {
    setFiles([...files, ...newFiles]);

    // set selected as last newly added file
    setSelectedFile(newFiles[newFiles.length - 1]);
  };

  /**
   * Changes the currently selected file.
   * @param {File} file - The file to select.
   */
  const onFileChange = (file: File) => {
    setSelectedFile(file);
    resetToDefaults();
  };

  /**
   * Resets the scale and rotation to their default values.
   */
  const resetToDefaults = () => {
    console.log("Resetting to defaults");
    setScale(DEFAULT_SCALE);
    setRotation(DEFAULT_ROTATION);
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
    files: files,
  };

  return (
    <FilePreviewContext.Provider
      value={{
        files,
        handleInitFiles,
        DEFAULT_SCALE,
        DEFAULT_ROTATION,
        scale,
        rotation,
        resetToDefaults,
        handleDownload,
        handleScaleChange,
        handleRotationChange,
        handleAddFiles,
        handleDelete,
        selectedFile,
        setSelectedFile: onFileChange,
        uploadProps,
      }}
    >
      {children}
    </FilePreviewContext.Provider>
  );
};

export default FilePreviewContext;
