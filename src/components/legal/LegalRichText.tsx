import Link from 'next/link'

const TOKEN = /(\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\))/g

type LegalRichTextProps = {
  text: string
  as?: 'p' | 'span' | 'li'
  className?: string
}

function renderParts(text: string) {
  const parts = text.split(TOKEN).filter((part) => part !== '')

  return parts.map((part, index) => {
    const bold = /^\*\*(.+)\*\*$/.exec(part)
    if (bold) {
      return (
        <strong key={index} className="font-semibold text-foreground">
          {bold[1]}
        </strong>
      )
    }

    const link = /^\[([^\]]+)\]\(([^)]+)\)$/.exec(part)
    if (link) {
      const href = link[2]
      const label = link[1]
      const isExternal = href.startsWith('http') || href.startsWith('mailto:')

      if (isExternal) {
        return (
          <a
            key={index}
            href={href}
            className="font-medium text-logo-blue underline underline-offset-2 decoration-logo-blue/40 hover:decoration-logo-blue focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm"
            {...(href.startsWith('http')
              ? { target: '_blank', rel: 'noopener noreferrer' }
              : {})}
          >
            {label}
          </a>
        )
      }

      return (
        <Link
          key={index}
          href={href}
          className="font-medium text-logo-blue underline underline-offset-2 decoration-logo-blue/40 hover:decoration-logo-blue focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm"
        >
          {label}
        </Link>
      )
    }

    return <span key={index}>{part}</span>
  })
}

export function LegalRichText({ text, as = 'p', className }: LegalRichTextProps) {
  const content = renderParts(text)

  if (as === 'li') {
    return <li className={className}>{content}</li>
  }

  if (as === 'span') {
    return <span className={className}>{content}</span>
  }

  return <p className={className}>{content}</p>
}
