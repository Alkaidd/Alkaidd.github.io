export default function SideBarContianer(props: { content: React.ComponentType }) {
  return (
    <div>
      <props.content />
    </div>
  )
}
