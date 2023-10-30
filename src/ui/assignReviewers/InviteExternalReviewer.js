import React, { useState } from 'react'
import PropTypes from 'prop-types'
import styled, { css } from 'styled-components'
import { grid, th } from '@pubsweet/ui-toolkit'
import { debounce } from 'lodash'

import { Button, Form, Input } from '../common'

const Wrapper = styled.div`
  max-width: 400px;

  ${props =>
    props.disabled &&
    css`
      pointer-events: none;
      cursor: not-allowed;
      opacity: 0.5;
    `}
`

const FormLabel = styled.div`
  color: ${th('colorPrimary')};
  margin-bottom: ${grid(2)};
  text-transform: uppercase;
`

const FormWarning = styled.div`
  color: ${th('colorError')};
  margin-bottom: ${grid(2)};
  text-transform: uppercase;
`

const SentInviteButton = styled(Button)`
  width: 100%;
`

const InviteExternalReviewer = props => {
  const { className, disabled, onSendInvitation } = props

  const [loading, setLoading] = useState(false)
  const [submissionStatus, setSubmissionStatus] = useState(null)
  const [ribbonMessage, setRibbonMessage] = useState('')

  const [form] = Form.useForm()

  const handleSuccessInvite = debounce(() => {
    setRibbonMessage('')
    setSubmissionStatus(null)
  }, 3000)

  const handleSubmit = formValues => {
    setLoading(true)

    const { email, givenNames, surname } = formValues

    const input = {
      email: email.trim(),
      givenNames: givenNames.trim(),
      surname: surname.trim(),
    }

    onSendInvitation(input)
      .then(() => {
        form.resetFields()
        setRibbonMessage('Invite sent successfully')
        setSubmissionStatus('success')

        handleSuccessInvite()
      })
      .catch(() => {
        setRibbonMessage('Failed to send invite')
        setSubmissionStatus('error')
      })
      .finally(() => {
        setLoading(false)
      })
  }

  return (
    <Wrapper className={className} disabled={disabled}>
      <FormLabel>Invite a reviewer that is not a user yet</FormLabel>

      {disabled && <FormWarning>No available invitation slots</FormWarning>}

      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        ribbonMessage={ribbonMessage}
        submissionStatus={submissionStatus}
      >
        <Form.Item
          label="Given names"
          name="givenNames"
          rules={[{ required: true, message: 'Given names are required' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Surname"
          name="surname"
          rules={[{ required: true, message: 'Surname is required' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Email"
          name="email"
          rules={[
            { required: true, message: 'Email is required' },
            { type: 'email', message: 'Invalid email address' },
          ]}
        >
          <Input />
        </Form.Item>

        <SentInviteButton
          disabled={loading}
          htmlType="submit"
          loading={loading}
          type="primary"
        >
          Send Invitation
        </SentInviteButton>
      </Form>
    </Wrapper>
  )
}

InviteExternalReviewer.propTypes = {
  /** Controls whether form is disabled */
  disabled: PropTypes.bool,
  /** Function to run on submit */
  onSendInvitation: PropTypes.func.isRequired,
}

InviteExternalReviewer.defaultProps = {
  disabled: false,
}

export default InviteExternalReviewer
