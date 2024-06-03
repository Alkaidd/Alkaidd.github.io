import { useEffect, useState } from 'react'

export default function MdDirectory(props: { id: string }) {
  const [list, setList] = useState<HeadingNode[]>([])

  useEffect(() => {
    const list = getHeadingTreeById(props.id)
    setList(list)
  }, [props.id])

  return (
    <div pos-sticky w-10 h-fit min-h-5 className='top-1/3'>
      <ul>
        {list.map((item, index) => (
          <li key={index}>{item.content}</li>
        ))}
      </ul>
    </div>
  )
}

function getHeadingTreeById(id: string): HeadingNode[] {
  const target = document.getElementById(id)
  if (!target) {
    return []
  }

  const children: HeadingNode[] = []
  for (const child of target.children) {
    if (child.tagName.match(/^H[1-6]$/)) {
      const node = {
        tagName: child.tagName,
        content: child.textContent ?? '',
        scrollDistanceToTop: child.getBoundingClientRect().top - target.getBoundingClientRect().top,
      }
      children.push(node)
    }
  }

  return children
}

type HeadingNode = {
  tagName: string
  content: string
  scrollDistanceToTop: number
}
