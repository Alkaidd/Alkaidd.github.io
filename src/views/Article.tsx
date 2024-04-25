import NavTitle from '@/components/NavTitle'
import * as articles from '@/components/article'

const ArticleComponents = Object.values(articles)

export default function Article() {
  return (
    <div h-full w-full overflow-auto pt-40>
      <NavTitle title='这里是Alkaid的文章记录。' />
      <div>
        {ArticleComponents.map((ArticleCom, index) => {
          return <ArticleCom key={index} />
        })}
      </div>
    </div>
  )
}
