/* eslint-disable react/prop-types */

import React from 'react'
import styled, { css } from 'styled-components'
import { gql, useQuery } from '@apollo/client'
import { Link } from 'react-router-dom'

import { uuid } from '../../src'

const GET_THOSE_RATES = gql`
  query GetRates {
    rates(currency: "USD") {
      currency
      rate
    }
  }
`

const Container = styled.div`
  background: ${props => props.theme.colorBackground};
  display: flex;
  flex-direction: column;
  min-height: 100%;

  /* stylelint-disable-next-line no-descending-specificity */
  > div:first-child {
    align-self: center;
    margin: 20px 0;
  }

  a {
    padding: 4px;
    text-decoration: none;
    text-transform: uppercase;

    &:hover {
      outline: 2px solid ${props => props.theme.colorBorder};
    }
  }

  ${props =>
    props.second &&
    css`
      align-items: center;
      justify-content: center;
    `}
`

const StyledItem = styled.div`
  border: 1px solid ${props => props.theme.colorBorder};
  border-radius: 5px;
  margin: 5px 25px;
  padding: 10px;
`

const Currency = styled.span`
  color: ${props => props.theme.colorCurrency};
  margin-right: 10px;
`

const Rate = styled.span`
  color: ${props => props.theme.colorRate};
`

const StyledItemList = styled.div`
  display: flex;
  flex-direction: column;
`

const Item = props => {
  const { currency, rate } = props

  return (
    <StyledItem>
      <Currency>{currency}</Currency>
      <Rate>{rate}</Rate>
    </StyledItem>
  )
}

const ItemList = props => {
  const { data, loading } = props

  return (
    <>
      {loading && <span>loading</span>}

      <StyledItemList>
        {!loading &&
          data &&
          data.rates &&
          data.rates.map(item => (
            <Item currency={item.currency} key={uuid()} rate={item.rate} />
          ))}
      </StyledItemList>
    </>
  )
}

const First = () => {
  const { data, loading } = useQuery(GET_THOSE_RATES)

  return (
    <Container>
      <div>
        <Link to="/second">Change page</Link>
      </div>

      <ItemList data={data} loading={loading} />
    </Container>
  )
}

const Second = () => (
  <Container second>
    <div>
      <Link to="/">Go back</Link>
    </div>
  </Container>
)

const StyledNavigationBar = styled.div`
  background: cornflowerblue;
  color: white;
  height: 50px;
  line-height: 50px;
  padding: 0 8px;
`

const NavigationBar = () => (
  <StyledNavigationBar>
    <span>This is the navigation bar</span>
  </StyledNavigationBar>
)

export { First, Second, NavigationBar }
