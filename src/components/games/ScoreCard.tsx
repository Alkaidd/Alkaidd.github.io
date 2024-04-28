export default function ScoreCard({ score }: { score: number }) {
  return (
    <div flex items-center justify-between>
      <div>@Alkaidd</div>
      <div ml-10 w-30>
        <span w-full>score: {Math.floor(score)}</span>
      </div>
    </div>
  )
}
