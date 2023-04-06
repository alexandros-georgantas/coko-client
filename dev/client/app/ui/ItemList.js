/* eslint-disable react/prop-types */

import React from 'react'
import styled from 'styled-components'
import { v4 as uuid } from 'uuid'

import Item from './Item'

const StyledItemList = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 20px;
`

const ItemList = props => {
  const { data, loading } = props

  return (
    <div>
      {loading && <span>loading</span>}

      <StyledItemList>
        {!loading &&
          data &&
          data.map(item => <Item key={uuid()} text={item} />)}
      </StyledItemList>
    </div>
  )
}

export default ItemList
