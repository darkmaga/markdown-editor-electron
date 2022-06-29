import React, { useCallback, useState } from "react"
import Editor from "./components/Editor/Editor"

import "./app.css"

const App: React.FC = () => {
  const [doc, setDoc] = useState<string>("# Hello, World!")

  const handleDocChange = useCallback((newDoc: string) => setDoc(newDoc), [])
  return (
    <div className="app">
      <Editor onChange={handleDocChange} initialDoc={doc} />
    </div>
  )
}

export default App
