import React, { useCallback, useEffect } from "react"
import type { EditorState } from "@codemirror/state"
import useCodeMirror from "/@/hooks/useCodeMirror"

import "./editor.css"

type EditorProps = {
  initialDoc: string
  onChange: (doc: string) => void
}

const Editor: React.FC<EditorProps> = ({ initialDoc, onChange }) => {
  const handleChange = useCallback(
    (state: EditorState) => onChange(state.doc.toString()),
    [onChange]
  )
  const { ref, editorView } = useCodeMirror({
    initialDoc: initialDoc,
    onChange: handleChange
  })

  useEffect(() => {
    // if (editorView) {
    // }
  }, [editorView])

  return (
    <div className="editor-wrapper" ref={ref}>
    </div>
  )
}

export default Editor
