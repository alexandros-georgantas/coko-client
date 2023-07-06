import React from 'react'
import { faker } from '@faker-js/faker'
import { Button } from '../src/ui'

export const Base = () => <Button>{faker.lorem.words(2)}</Button>
export const Primary = () => (
  <Button type="primary">{faker.lorem.words(2)}</Button>
)

export const Danger = () => (
  <Button status="danger">{faker.lorem.words(2)}</Button>
)

export const PrimaryDanger = () => (
  <Button status="error" type="primary">
    {faker.lorem.words(2)}
  </Button>
)

export const Success = () => (
  <Button status="success">{faker.lorem.words(2)}</Button>
)

export const PrimarySuccess = () => (
  <Button status="success" type="primary">
    {faker.lorem.words(2)}
  </Button>
)

export const Link = () => (
  <Button ghost href="#" type="primary">
    Link that looks like a button
  </Button>
)

export default {
  component: Button,
  title: 'Common/Button',
}
