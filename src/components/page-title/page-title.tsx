import { FC, useEffect } from 'react'
import { useLocation } from 'react-router-dom'

interface PageTitleProperties {
  title: string
}

const PageTitle: FC<PageTitleProperties> = ({ title }) => {
  const location = useLocation()

  useEffect(() => {
    document.title = `PrfitApp | ${title}`
  }, [location, title])

  return null
}

export default PageTitle
