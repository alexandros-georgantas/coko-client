import React, { useState } from 'react'
import { faker } from '@faker-js/faker'

import { Search } from '../../src/ui'

export const Base = () => {
  const [loading, setLoading] = useState(false)

  const handleChange = () => {
    setLoading(true)
    setTimeout(() => setLoading(false), 2000)
  }

  return (
    <Search
      loading={loading}
      onSearch={handleChange}
      placeholder={faker.lorem.words(4)}
    />
  )
}

export const Plain = () => <Search />
export const Loading = () => <Search loading />

export default {
  component: Search,
  title: 'Common/Search',
}
