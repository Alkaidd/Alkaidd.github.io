import { useNavigate } from 'react-router-dom'

export default function Page404() {
  const navigate = useNavigate()

  const goBack = (event: any) => {
    event.preventDefault()
    navigate(-1)
  }
  return (
    <div w-full h-full flex justify-center items-center>
      <div>
        <div>404 page</div>
        <a href='/home' mr-2>
          home
        </a>
        <a href='#' role='button' onClick={goBack}>
          back
        </a>
      </div>
    </div>
  )
}
