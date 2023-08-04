import React from 'react'
import { Header } from '../../src/ui'

// eslint-disable-next-line react/jsx-props-no-spreading
export const Base = args => (
  <Header {...args} user={{ displayName: 'Author' }} />
)

export default {
  component: Header,
  title: 'Common/Header',
}
