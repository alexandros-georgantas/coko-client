import React from 'react'
import { faker } from '@faker-js/faker'
import { range } from 'lodash'
import { Collapse } from '../src/ui'

export const Base = () => (
  <Collapse>
    {range(3).map(i => (
      <Collapse.Panel header={faker.lorem.words(4)} key={i}>
        {faker.lorem.sentences(6)}
      </Collapse.Panel>
    ))}
  </Collapse>
)

export const AccordionMode = () => (
  <Collapse accordion>
    {range(3).map(i => (
      <Collapse.Panel header={faker.lorem.words(4)} key={i}>
        {faker.lorem.sentences(6)}
      </Collapse.Panel>
    ))}
  </Collapse>
)

export default {
  component: Collapse,
  title: 'Common/Collapse',
}
