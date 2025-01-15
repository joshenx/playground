import { useContext, useRef } from "react";
import FilePreviewContext from "./FilePreviewProvider";

/**
 * Custom hook that provides access to FilePreview interfaces, which allows transforming of images, image display and its state management.
 * @returns The FilePreviewContext value.
 * @throws {Error} If used outside of a FilePreviewProvider.
 */
export const useFilePreview = () => {
  const context = useContext(FilePreviewContext);
  if (!context) {
    throw new Error("useFilePreview must be used within a FilePreviewProvider");
  }
  return context;
};

/**
 * Custom hook that provides functionality for adding files.
 *
 * @returns {object} - An object containing the ref to the input file element, the onFileChangeCapture event handler, and the handeAddClick event handler.
 */
export const useAddFiles = () => {
  const { handleAddFiles } = useFilePreview();

  const inputFileRef = useRef<HTMLInputElement>();
  const onFileChangeCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = e.target.files;
    if (!newFiles) return;

    const filesArray = Array.from(newFiles);
    handleAddFiles(filesArray);
  };

  const addFiles = (newFiles: File[]) => {
    handleAddFiles(newFiles);
  };

  const handleAddClick = () => {
    if (!inputFileRef?.current) return;
    inputFileRef.current.click();
  };

  return {
    inputFileRef,
    onFileChangeCapture,
    handleAddClick,
    addFiles,
  };
};
