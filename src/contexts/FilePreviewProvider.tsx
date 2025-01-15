import { ReactNode, createContext, useState } from "react";
import { FileTypes } from "../FilePreview";

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

  const [selectedFile, setSelectedFile] = useState<TransformedFile | null>(
    null
  );

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

    const filesToInit = files.map((file) => {
      return {
        file,
        scale: DEFAULT_SCALE,
        rotation: DEFAULT_ROTATION,
      };
    });

    setFiles(filesToInit);
    setSelectedFile(filesToInit[0]);
  };

  /**
   * Deletes the specified file from the file list.
   * @param {File} file - The file to delete.
   */
  const handleDelete = (file: File) => {
    const indexToDelete = files.findIndex((target) => target.file === file);

    console.log(files);
    console.log(
      files[indexToDelete - 1]?.file ?? files[indexToDelete + 1]?.file
    );
    // set selected as next-in-order
    handleSelectFile(
      files[indexToDelete - 1]?.file ?? files[indexToDelete + 1]?.file
    );

    // delete file
    setFiles(files.filter((_, index) => index !== indexToDelete));
  };

  /**
   * Changes the scale of the file preview.
   * @param {number} newScale - The new scale value.
   */
  const handleScaleChange = (newScale: number) => {
    if (!selectedFile) return;
    setSelectedFile({
      file: selectedFile.file,
      scale: newScale,
      rotation: selectedFile.rotation,
    });
  };

  /**
   * Changes the rotation of the file preview.
   * @param {number} newRotation - The new rotation value.
   */
  const handleRotationChange = (newRotation: number) => {
    if (!selectedFile) return;
    setSelectedFile({
      file: selectedFile.file,
      scale: selectedFile.scale,
      rotation: newRotation,
    });
  };

  /**
   * Adds new files to the file list.
   * @param {File[]} newFiles - The new files to add.
   */
  const handleAddFiles = (newFiles: File[]) => {
    setFiles([
      ...files,
      ...newFiles.map((file) => {
        return {
          file,
          scale: DEFAULT_SCALE,
          rotation: DEFAULT_ROTATION,
        };
      }),
    ]);

    // set selected as last newly added file
    setSelectedFile(files[newFiles.length - 1]);
  };

  /**
   * Changes the currently selected file.
   * @param {File} file - The file to select.
   */
  const onFileChange = (file: File) => {
    saveTransformProperties(selectedFile);
    handleSelectFile(file);
  };

  const handleSelectFile = (file: File) => {
    const newSelectedFile = files.find((f) => f.file === file);
    if (!newSelectedFile) return;

    setSelectedFile(newSelectedFile);
  };

  /**
   * Resets the scale and rotation to their default values.
   */
  const resetToDefaults = () => {
    if (!selectedFile) return;
    console.log("Resetting to transform defaults");
    setSelectedFile({
      file: selectedFile.file,
      scale: DEFAULT_SCALE,
      rotation: DEFAULT_ROTATION,
    });
  };

  const saveTransformProperties = (fileWithNewTx: TransformedFile | null) => {
    if (!fileWithNewTx) return;
    const updatedFiles = files.map((file) =>
      file.file === fileWithNewTx.file ? fileWithNewTx : file
    );
    setFiles(updatedFiles);
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
        setSelectedFile: onFileChange,

        selectedFile: selectedFile ? selectedFile.file : null,
        scale: selectedFile ? selectedFile.scale : DEFAULT_SCALE,
        rotation: selectedFile ? selectedFile.rotation : DEFAULT_ROTATION,
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
