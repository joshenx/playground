import styled from "@seaweb/coral/hoc/styled";
import "./App.css";
import ExpandableTable from "./ExpandableTable";
import FilePreview from "./FilePreview";
import { FilePreviewProvider } from "./contexts/FilePreviewProvider";
// import PdfJs from "./PdfJs";

const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 20px;
`;

function App() {
  return (
    <AppContainer>
      <ExpandableTable
        records={Array(5)
          .fill(null)
          .map((_, idx) => ({
            city: "c",
            description: "p",
            author: "a",
            new: "n",
            id: idx,
          }))}
        keyOrder={["id", "city", "description", "new", "author"]}
        columns={[
          { label: "ID", width: 300 },
          { label: "Origin", width: 300 },
          { label: "Description", width: 300 },
          { label: "new", width: 300 },
          { label: "Author", width: 300 },
        ]}
        exRange={[1, 4]}
      />
      <FilePreviewProvider>
        <FilePreview />
      </FilePreviewProvider>
    </AppContainer>
  );
}

export default App;
