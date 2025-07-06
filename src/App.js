import React from "react";
import KonvaBuilder from "./components/KonvaBuilder";

function App() {
  const existingTemplate = localStorage.getItem("template");
  const initialElements = existingTemplate ? JSON.parse(existingTemplate) : [];

  const handleSave = (elements) => {
    const template = JSON.stringify(elements);
    localStorage.setItem("template", template);
    alert("template JSON stored in localstorage");
  };

  return (
    <KonvaBuilder
      elements={initialElements}
      handleSave={handleSave}
      // mode="edit"
    />
  );
}

export default App;
