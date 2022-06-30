import React, { useEffect, useState } from "react"
import runmode, { getLanguage } from "./runmode"
import type { ReactNode } from "react"

type Tokens = {
  text: string
  style: string | null
}[]

const RemarkCode: React.FC<{ className: string; children: ReactNode }> = ({
  className,
  children
}) => {
  const [spans, setSpans] = useState<Tokens>([])
  const langName = (className || "").substr(9)

  useEffect(() => {
    getLanguage(langName).then((language) => {
      if (language) {
        const body = children instanceof Array ? children[0] : null
        const tokens: Tokens = []
        runmode(
          body as string,
          language,
          (text: string, style: string | null) => {
            tokens.push({ text, style })
          }
        )
        setSpans(tokens)
      }
    })
  }, [children])

  if (spans.length > 0) {
    return (
      <code>
        {spans.map((span, i) => (
          <span key={i} className={span.style || ""}>
            {span.text}
          </span>
        ))}
      </code>
    )
  } else {
    return <code>{children}</code>
  }
}

export default RemarkCode
