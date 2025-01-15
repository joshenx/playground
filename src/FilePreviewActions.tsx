import IconButton, {
  IconButtonVariants,
} from "@seaweb/coral/components/IconButton";
import InputGroup from "@seaweb/coral/components/InputGroup";
import { useFilePreview } from "./contexts/useFilePreview";
import ZoomOutIcon from "@seaweb/coral/icons/ZoomOut";
import ZoomInIcon from "@seaweb/coral/icons/ZoomIn";
import SearchIcon from "@seaweb/coral/icons/Search";
import RotateIcon from "@seaweb/coral/icons/Rotate";
import DownloadIcon from "@seaweb/coral/icons/Download";
import DeleteIcon from "@seaweb/coral/icons/Delete";
export const FilePreviewActions = () => {
  const {
    files,
    selectedIndex,
    resetToDefaults,
    scale,
    rotation,
    handleDownload,
    handleScaleChange,
    handleRotationChange,
    handleDelete,
  } = useFilePreview();

  const actions = [
    { onClick: () => handleScaleChange(scale / 2), icon: <ZoomOutIcon /> },
    { onClick: resetToDefaults, icon: <SearchIcon /> },
    { onClick: () => handleScaleChange(scale * 2), icon: <ZoomInIcon /> },
    {
      onClick: () => handleRotationChange(rotation + 90),
      icon: <RotateIcon />,
    },
    {
      onClick: () => handleDownload(files[selectedIndex]),
      icon: <DownloadIcon />,
    },
    { onClick: () => handleDelete(files[selectedIndex]), icon: <DeleteIcon /> },
  ];

  return (
    <InputGroup>
      {actions.map((action, index) => (
        <IconButton
          variant={IconButtonVariants.Outlined}
          key={index}
          onClick={action.onClick}
        >
          {action.icon}
        </IconButton>
      ))}
    </InputGroup>
  );
};
