import React from 'react'
import styled from 'styled-components'
import { range, uniq } from 'lodash'
import { faker } from '@faker-js/faker'

import SearchBox from '../../src/ui/assignReviewers/SearchBox'

const Wrapper = styled.div`
  height: 400px;
`

const topics = uniq(range(20).map(() => faker.animal.type()))

const people = range(40).map(() => ({
  value: faker.string.uuid(),
  label: faker.person.fullName(),
  isDisabled: Math.random() > 0.5,
  status: faker.helpers.arrayElement([null, faker.lorem.words(2)]),
  assessmentTraining: Math.random() > 0.5,
  languageTraining: Math.random() > 0.5,
  topics: faker.helpers.arrayElements(topics, { min: 0, max: 3 }),
}))

const additionalSearchFields = [
  {
    label: 'Assessment Training',
    value: 'assessmentTraining',
  },
  {
    label: 'Language Training',
    value: 'languageTraining',
  },
  {
    label: 'Topics',
    value: 'topics',
    items: topics,
  },
]

const handleSearch = input => {
  if (!input) {
    return Promise.resolve([])
  }

  const lowerCaseInput = input.toLowerCase()

  const results = people.filter(person => {
    if (person.label.toLowerCase().includes(lowerCaseInput)) {
      return true
    }

    let foundMatchingField = false

    additionalSearchFields.forEach(field => {
      if (
        field.label.toLocaleLowerCase().includes(lowerCaseInput) &&
        typeof person[field.value] === 'boolean' &&
        person[field.value]
      ) {
        foundMatchingField = true
      } else if (person[field.value] && Array.isArray(person[field.value])) {
        person[field.value].forEach(entry => {
          if (entry.toLowerCase().includes(lowerCaseInput)) {
            foundMatchingField = true
          }
        })
      }
    })

    return foundMatchingField
  })

  return Promise.resolve(results)
}

const handleAdd = () => {
  return Promise.resolve()
}

export const Base = () => {
  return (
    <Wrapper>
      <SearchBox onAdd={handleAdd} onSearch={handleSearch} />
    </Wrapper>
  )
}

export const AdditionalSearchFields = () => {
  return (
    <Wrapper>
      <SearchBox
        additionalSearchFields={additionalSearchFields}
        onAdd={handleAdd}
        onSearch={handleSearch}
      />
    </Wrapper>
  )
}

export default {
  component: SearchBox,
  title: 'Assign Reviewers/Search Box',
}
