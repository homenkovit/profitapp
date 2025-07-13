import { FC, memo, useEffect } from 'react'
import { useLocation } from 'react-router-dom'

interface PageTitleProperties {
  title: string
}

const PageTitle: FC<PageTitleProperties> = ({ title }) => {
  const location = useLocation()

  useEffect(() => {
    document.title = `ProfitApp | ${title}`
  }, [location, title])

  return null
}

export default memo(PageTitle)
