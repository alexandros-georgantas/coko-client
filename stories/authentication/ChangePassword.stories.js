/* eslint-disable no-console */
import React, { useState } from 'react'
import { ChangePassword, Checkbox } from '../../src/ui'

export const Base = () => {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [submissionStatus, setSubmissionStatus] = useState(null)

  const [error, setError] = useState(false)

  const handleSubmit = vals => {
    console.log(vals)
    console.log(error)
    setLoading(true)

    setTimeout(() => {
      setLoading(false)

      if (!error) {
        setMessage('Password changed successfully')
        setSubmissionStatus('success')
      } else {
        setMessage('There was an error, please try again')
        setSubmissionStatus('error')
      }
    }, 1000)
  }

  return (
    <>
      <p>
        <Checkbox checked={error} onChange={() => setError(!error)}>
          Check and submit the form to see error state
        </Checkbox>
      </p>
      <ChangePassword
        loading={loading}
        message={message}
        onSubmit={handleSubmit}
        submissionStatus={submissionStatus}
      />
    </>
  )
}

export default {
  component: ChangePassword,
  title: 'Authentication/Change Password',
}
