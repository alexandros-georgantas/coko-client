import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { v4 as uuid } from 'uuid'

import Button from './common/Button'

const Wrapper = styled.div``

const Teams = props => {
  const { className, teams, addToReviewerTeam, removeFromReviewerTeam } = props

  const isInReviewerTeam = teams && !!teams.find(t => t.role === 'reviewer')

  return (
    <Wrapper className={className}>
      <ul>
        {teams &&
          teams.length > 0 &&
          teams.map(t => <li key={uuid()}>{t.role}</li>)}

        {(!teams || teams.length === 0) && 'no teams'}
      </ul>

      <Button
        onClick={isInReviewerTeam ? removeFromReviewerTeam : addToReviewerTeam}
        type="button"
      >
        {isInReviewerTeam ? 'Remove from' : 'Add to'} reviewer team
      </Button>
    </Wrapper>
  )
}

Teams.propTypes = {
  /* eslint-disable-next-line react/forbid-prop-types */
  teams: PropTypes.array,
  addToReviewerTeam: PropTypes.func.isRequired,
  removeFromReviewerTeam: PropTypes.func.isRequired,
}

Teams.defaultProps = {
  teams: null,
}

export default Teams
