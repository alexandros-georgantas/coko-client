import React from 'react'

import { DateParser } from '../src/ui'

export const Base = () => (
  <DateParser dateFormat="MMMM DD, YYYY" timestamp="1990-01-02">
    {timestamp => timestamp}
  </DateParser>
)

Base.args = {}

export default {
  component: DateParser,
  title: 'Common/DateParser',
}
