import React, { useState } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { grid, th } from '@pubsweet/ui-toolkit'

import { Button, Select } from '../common'

const Wrapper = styled.div`
  display: flex;
  gap: ${grid(1)};
  margin: 0 auto;
  width: 100%;

  @media (min-width: ${th('mediaQueries.small')}) {
    padding: ${grid(8)};
  }
`

const StyledSelect = styled(Select)`
  flex-grow: 1;

  .react-select__control {
    border: 0;
    box-shadow: ${th('colorBorder')} 0 0 0 1px;
    padding: 0 ${grid(1)};
    transition: box-shadow 0.2s ease-in;
  }

  .react-select__control--is-focused {
    box-shadow: ${th('colorPrimary')} 0 0 0 2px;
  }

  .react-select__menu {
    margin-top: 4px;
  }
`

const AddButton = styled(Button)`
  height: ${grid(4)};
`

const SearchBox = props => {
  const { additionalSearchFields, className, onAdd, onSearch } = props

  const [selection, setSelection] = useState([])
  const [loadingSearchResults, setLoadingSearchResults] = useState(false)
  const [searchResults, setSearchResults] = useState([])

  const handleSearch = searchValue => {
    setLoadingSearchResults(true)

    onSearch(searchValue)
      .then(data => {
        if (!additionalSearchFields.length || !data.length) {
          setSearchResults(data)
          return
        }

        const parsedData = []

        additionalSearchFields.forEach(field => {
          if (field.items && Array.isArray(field.items)) {
            field.items.forEach(item => {
              if (!item.toLowerCase().includes(searchValue.toLowerCase()))
                return

              const group = {
                label: `${field.label}: ${item}`,
                options: [],
              }

              const filteredData = data.filter(
                d =>
                  d[field.value] !== undefined && d[field.value].includes(item),
              )

              group.options = filteredData.map(f => ({
                ...f,
                key: `${field.value}-${item}-${f.value}`,
              }))

              parsedData.push(group)
            })
          } else {
            const group = {
              label: field.label,
              options: [],
            }

            const filteredData = data.filter(
              d => d[field.value] !== undefined && d[field.value] !== false,
            )

            if (!filteredData.length) return

            group.options = filteredData.map(f => ({
              ...f,
              key: `${field.value}-${f.value}`,
            }))

            parsedData.push(group)
          }
        })

        setSearchResults(parsedData)
      })
      .finally(() => {
        setLoadingSearchResults(false)
      })
  }

  const handleAdd = () => {
    onAdd(selection.map(s => s.value)).finally(() => {
      setSearchResults([])
      setSelection([])
    })
  }

  return (
    <Wrapper className={className}>
      <StyledSelect
        async
        defaultOpen={false}
        labelInValue
        loading={loadingSearchResults}
        mode="multiple"
        onChange={setSelection}
        onSearch={handleSearch}
        options={searchResults}
        placeholder="Add a reviewer to the list"
        value={selection}
      />
      <AddButton
        aria-labelledby="reviewer-team"
        disabled={selection.length === 0}
        onClick={handleAdd}
        type="primary"
      >
        Add User{selection.length > 1 && 's'}
      </AddButton>
    </Wrapper>
  )
}

SearchBox.propTypes = {
  /** Additional search fields definitions to display on search */
  additionalSearchFields: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
      items: PropTypes.arrayOf(PropTypes.string),
    }),
  ),
  /** Function to run when "Add user(s)" is clicked */
  onAdd: PropTypes.func,
  /** Function to run when typing into the search field */
  onSearch: PropTypes.func,
}

SearchBox.defaultProps = {
  additionalSearchFields: [],
  onAdd: () => {},
  onSearch: () => {},
}

export default SearchBox
