import React from 'react'
// import { lorem } from '@faker-js/faker'

import { Button, Result } from '../src/ui'

export const Base = () => (
  <Result
    extra={[
      <Button key={1} type="link">
        Click me to get out of here
      </Button>,
    ]}
    status="success"
    subTitle="Success is what you get here"
    title="This is a success!"
  />
)

export default {
  component: Result,
  title: 'Common/Result',
}
