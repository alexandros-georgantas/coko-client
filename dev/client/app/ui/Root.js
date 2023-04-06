/* eslint-disable react/prop-types */

import React from 'react'
import { Link } from 'react-router-dom'

import Container from './common/Container'
import ItemList from './ItemList'

const Root = props => {
  const { data, loading } = props

  return (
    <Container>
      <div>
        <Link to="/imagedemo">Image demo</Link>
        <Link to="/ant">Ant</Link>
        <Link to="/protected">Protected</Link>
      </div>

      <ItemList data={data} loading={loading} />
    </Container>
  )
}

export default Root
