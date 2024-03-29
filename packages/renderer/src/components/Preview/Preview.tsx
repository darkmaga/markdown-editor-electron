import React from "react"
import { unified } from "unified"
import remarkParse from "remark-parse"
import remarkGfm from "remark-gfm"
import remarkReact from "remark-react"
import RemarkCode from "../../utils/remarkCode"
import { defaultSchema } from "hast-util-sanitize"
import "./preview.css"
import "github-markdown-css/github-markdown.css"

type PreviewProps = {
  doc: string
}

const schema = {
  ...defaultSchema,
  attributes: {
    ...defaultSchema.attributes,
    code: [...(defaultSchema.attributes?.code || []), "className"]
  }
}

const Preview: React.FC<PreviewProps> = ({ doc }) => {
  const md = unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkReact, {
      createElement: React.createElement,
      sanitize: schema,
      remarkReactComponents: {
        code: RemarkCode
      }
    })
    .processSync(doc).result
  return <div className="preview markdown-body">{md}</div>
}

export default Preview
