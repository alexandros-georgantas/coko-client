import React from 'react'
import { faker } from '@faker-js/faker'

import { FormSection } from '../../src/ui'
import { Filler } from '../../src/ui/_helpers/_helpers'

export const Base = () => (
  <FormSection label={faker.lorem.words(2)}>
    <Filler />
  </FormSection>
)

export default {
  component: FormSection,
  title: 'Common/FormSection',
}
