import { useState, useEffect, useRef } from "react"
import { EditorState } from "@codemirror/state"
import {
  EditorView,
  keymap,
  highlightActiveLine,
  lineNumbers,
  highlightActiveLineGutter
} from "@codemirror/view"
import { historyKeymap } from "@codemirror/history"
import { history, defaultKeymap } from "@codemirror/commands"
import {
  bracketMatching,
  syntaxHighlighting,
  indentOnInput,
  HighlightStyle
} from "@codemirror/language"
import { tags } from "@codemirror/highlight"
import { markdown, markdownLanguage } from "@codemirror/lang-markdown"
import { languages } from "@codemirror/language-data"
import { oneDark } from "@codemirror/theme-one-dark"
import type React from "react"
import type { KeyBinding } from "@codemirror/view"

export const transparentTheme = EditorView.theme({
  "&": {
    backgroundColor: "transparent !important",
    height: "100%"
  },
  ".cm-activeLine": {
    backgroundColor: "transparent !important"
  },
  ".cm-lineNumbers": {
    backgroundColor: "transparent !important"
  },
  ".cm-gutterElement": {
    backgroundColor: "transparent !important"
  },
  ".cm-gutters": {
    backgroundColor: "transparent !important"
  }
})

const syntaxHighlightingTags = HighlightStyle.define([
  {
    tag: tags.heading1,
    fontSize: "1.6em",
    fontWeight: "bold"
  },
  { tag: tags.heading2, fontSize: "1.4em", fontWeight: "bold" },
  { tag: tags.heading3, fontSize: "1.2em", fontWeight: "bold" }
])

type useCodeMirrorProps = {
  initialDoc: string
  onChange?: (state: EditorState) => void
}

const useCodeMirror = ({
  initialDoc,
  onChange
}: useCodeMirrorProps): {
  ref: React.MutableRefObject<HTMLDivElement | null>
  editorView?: EditorView
} => {
  const ref = useRef<HTMLDivElement>(null)
  const [editorView, setEditorView] = useState<EditorView>()

  useEffect(() => {
    if (!ref.current) return

    const startState = EditorState.create({
      doc: initialDoc,
      extensions: [
        keymap.of([...defaultKeymap, ...historyKeymap] as KeyBinding[]),
        lineNumbers(),
        highlightActiveLineGutter(),
        history(),
        indentOnInput(),
        bracketMatching(),
        highlightActiveLine(),
        markdown({
          base: markdownLanguage,
          codeLanguages: languages,
          addKeymap: true
        }),
        oneDark,
        transparentTheme,
        syntaxHighlighting(syntaxHighlightingTags),
        EditorView.lineWrapping,
        EditorView.updateListener.of((update) => {
          if (update.changes) {
            onChange && onChange(update.state)
          }
        })
      ]
    })
    const view = new EditorView({
      state: startState,
      parent: ref.current
    })
    setEditorView(view)
  }, [ref])

  return { ref, editorView }
}

export default useCodeMirror
