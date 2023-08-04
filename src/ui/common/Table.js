import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Table as AntTable } from 'antd'

import { grid } from '@pubsweet/ui-toolkit'

import Search from './Search'
import Spin from './Spin'
import Pagination from './Pagination'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;

  > div:last-child {
    flex-grow: 1;

    .ant-spin-nested-loading,
    .ant-spin-container,
    .ant-table-wrapper {
      height: 100%;
    }

    .ant-table {
      height: calc(100% - ${grid(16)});
    }
  }
`

const SearchWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: ${grid(3)};

  > span {
    max-width: 1200px;
  }
`

const PaginationNav = styled(Pagination)`
  padding: ${grid(4)} 0;
  text-align: right;
`

const Table = props => {
  const {
    className,
    children,
    loading,
    showSearch,
    searchLoading,
    onSearch,
    searchPlaceholder,
    /* eslint-disable react/prop-types */
    dataSource,
    pagination,
    /* eslint-enable react/prop-types */
    ...rest
  } = props

  const paginationObj = {
    current: 1,
    pageSize: 10,
    ...pagination,
  }

  const [paginationCurrent, setPaginationCurrent] = useState(
    paginationObj.current,
  )

  const [paginationSize, setPaginationSize] = useState(paginationObj.pageSize)

  useEffect(() => {
    setPaginationCurrent(paginationObj.current)
    setPaginationSize(paginationObj.pageSize)
  }, [pagination])

  const passedPagination = {
    ...paginationObj,
    current: paginationCurrent,
    pageSize: paginationSize,
  }

  const triggerPaginationEvent = eventName => (page, pageSize) => {
    setPaginationCurrent(page)
    setPaginationSize(pageSize)

    if (pagination && pagination[eventName]) {
      pagination[eventName](page, pageSize)
    }
  }

  const onPaginationChange = triggerPaginationEvent('onChange')

  const onPaginationShowSizeChange = triggerPaginationEvent('onShowSizeChange')

  return (
    <Wrapper className={className}>
      {showSearch && (
        <SearchWrapper>
          <Search
            loading={searchLoading}
            onSearch={onSearch}
            placeholder={searchPlaceholder}
          />
        </SearchWrapper>
      )}

      <Spin spinning={loading}>
        <AntTable {...rest} dataSource={dataSource} pagination={false}>
          {children}
        </AntTable>
      </Spin>
      {pagination && (
        <PaginationNav
          onChange={onPaginationChange}
          onShowSizeChange={onPaginationShowSizeChange}
          pagination={passedPagination}
        />
      )}
    </Wrapper>
  )
}

Table.propTypes = {
  loading: PropTypes.bool,
  showSearch: PropTypes.bool,
  searchLoading: PropTypes.bool,
  onSearch: PropTypes.func,
  searchPlaceholder: PropTypes.string,
}

Table.defaultProps = {
  loading: false,
  showSearch: false,
  searchLoading: false,
  onSearch: null,
  searchPlaceholder: null,
}

export default Table
