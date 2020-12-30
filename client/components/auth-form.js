import React from 'react'
import {connect} from 'react-redux'
import PropTypes from 'prop-types'
import {auth} from '../store'
import {Button, Form, Input} from 'semantic-ui-react'

/**
 * COMPONENT
 */
const AuthForm = props => {
  const {name, displayName, handleSubmit, error} = props
  if (name === 'login') {
    return (
      <div className="main-content-section">
        <Form onSubmit={handleSubmit} name={name}>
          <Form.Group>
            <Form.Field>
              <label>Email</label>
              <input
                placeholder="Email"
                id="form-input-control-email"
                name="email"
              />
            </Form.Field>
            <Form.Field>
              <label>Password</label>
              <input
                placeholder="Password"
                id="form-input-control-password"
                type="password"
                name="password"
              />
            </Form.Field>
          </Form.Group>
          <Form.Field>
            <Button type="submit">{displayName}</Button>
          </Form.Field>
          {error && error.response && <div> {error.response.data} </div>}
        </Form>
        {/* <a href="/auth/google">{displayName} with Google</a> */}
      </div>
    )
  } else if (name === 'signup') {
    return (
      <div className="main-content-section">
        <Form onSubmit={handleSubmit} name={name}>
          <Form.Group>
            <Form.Field>
              <label>First Name</label>
              <input
                name="firstName"
                placeholder="First Name"
                id="form-input-control-first-name"
              />
            </Form.Field>
            <Form.Field>
              <label>Last Name</label>
              <input
                name="lastName"
                placeholder="Last Name"
                id="form-input-control-last-name"
              />
            </Form.Field>
          </Form.Group>
          <Form.Group>
            <Form.Field>
              <label>Email</label>
              <input
                placeholder="Email"
                id="form-input-control-email"
                name="email"
              />
            </Form.Field>
            <Form.Field>
              <label>Password</label>
              <input
                placeholder="Password"
                id="form-input-control-password"
                type="password"
                name="password"
              />
            </Form.Field>
          </Form.Group>
          <Form.Field>
            <Button type="submit">{displayName}</Button>
          </Form.Field>
          {error && error.response && <div> {error.response.data} </div>}
        </Form>
        {/* <a href="/auth/google">{displayName} with Google</a> */}
      </div>
    )
  }
}

/**
 * CONTAINER
 *   Note that we have two different sets of 'mapStateToProps' functions -
 *   one for Login, and one for Signup. However, they share the same 'mapDispatchToProps'
 *   function, and share the same Component. This is a good example of how we
 *   can stay DRY with interfaces that are very similar to each other!
 */
const mapLogin = state => {
  return {
    name: 'login',
    displayName: 'Login',
    error: state.user.error
  }
}

const mapSignup = state => {
  return {
    name: 'signup',
    displayName: 'Sign Up',
    error: state.user.error
  }
}

const mapDispatch = dispatch => {
  let dispatchLogin = evt => {
    evt.preventDefault()
    let userInfo = {
      email: evt.target.email.value,
      password: evt.target.password.value
    }
    const formName = evt.target.name
    dispatch(auth(formName, userInfo))
  }
  let dispatchSignup = evt => {
    evt.preventDefault()
    let userInfo = {
      email: evt.target.email.value,
      password: evt.target.password.value,
      firstName: evt.target.firstName.value,
      lastName: evt.target.lastName.value
    }
    const formName = evt.target.name
    dispatch(auth(formName, userInfo))
  }

  return {
    async handleSubmit(evt) {
      if (evt.target.name === 'login') {
        console.log('handleSubmit with login name called in auth-form.js')
        await dispatchLogin(evt)
      } else if (evt.target.name === 'signup') {
        console.log('handleSubmit with signup name called in auth-form.js')
        await dispatchSignup(evt)
      }
    }
  }
}

export const Login = connect(mapLogin, mapDispatch)(AuthForm)
export const Signup = connect(mapSignup, mapDispatch)(AuthForm)

/**
 * PROP TYPES
 */
AuthForm.propTypes = {
  name: PropTypes.string.isRequired,
  displayName: PropTypes.string.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  error: PropTypes.object
}
