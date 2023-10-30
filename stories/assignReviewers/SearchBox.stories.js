import React from 'react'
import styled from 'styled-components'
import { range } from 'lodash'
import { faker } from '@faker-js/faker'

import SearchBox from '../../src/ui/assignReviewers/SearchBox'

const Wrapper = styled.div`
  height: 400px;
`

const people = range(40).map(() => ({
  value: faker.string.uuid(),
  label: faker.person.fullName(),
  isDisabled: Math.random() > 0.5,
  status: faker.helpers.arrayElement([null, faker.lorem.words(2)]),
}))

export const Base = () => {
  const handleSearch = input => {
    if (!input) {
      return Promise.resolve([])
    }

    const results = people.filter(p =>
      p.label.toLowerCase().includes(input.toLowerCase()),
    )

    return Promise.resolve(results)
  }

  const handleAdd = () => {
    return Promise.resolve()
  }

  return (
    <Wrapper>
      <SearchBox onAdd={handleAdd} onSearch={handleSearch} />
    </Wrapper>
  )
}

export default {
  component: SearchBox,
  title: 'Assign Reviewers/Search Box',
}
