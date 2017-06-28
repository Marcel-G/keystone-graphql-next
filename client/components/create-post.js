import React, { Component, PropTypes } from 'react'
import Formsy from 'formsy-react'
import { gql, graphql } from 'react-apollo'
import { RaisedButton } from 'material-ui'
import { FormsyText } from 'formsy-material-ui/lib'
import { bindAll } from '../utils/function'
import FilePicker from './file-picker'

const errorMessages = {
  invalidEmail: 'Email is not valid',
  passwordMismatch: 'Passwords should match'
}

class CreatePost extends Component {
  constructor () {
    super()
    this.state = {
      canSubmit: false
    }
    bindAll([
      'enableButton',
      'disableButton',
      'submitForm'
    ], this)
  }
  submitForm = data => {
    console.log(data)
    const { createPost } = this.props
    const { title, content, documents } = data
    createPost(title, content, documents).then(({ data }) => {
      const { errors, post } = data.createPost
      if (errors && errors.length > 0) {
        this.form.updateInputsWithError(errors.reduce((update, { field, message }) => (
          { ...update, [field]: message }
        ), {}))
      } else if (post) {
        window.location = `/post/${post.key}`
      }
    }).catch(error => {
      console.log(error)
    })
  }
  enableButton () {
    this.setState({
      canSubmit: true
    })
  }

  disableButton () {
    this.setState({
      canSubmit: false
    })
  }

  render () {
    return (
          <section>
              <Formsy.Form
                ref={form => { this.form = form }}
                onValid={this.enableButton}
                onInvalid={this.disableButton}
                onValidSubmit={this.submitForm} >
                  <FormsyText
                      floatingLabelText="Title"
                      required
                      name="title"
                      style={{
                        display: 'block',
                        width: '100%' }} />
                  <FormsyText
                      floatingLabelText="Content"
                      required
                      name="content"
                      style={{
                        display: 'block',
                        width: '100%' }} />
                  <FilePicker
                    name={'documents'}
                    label={'Upload Documents'}
                    multiple />
                  <RaisedButton
                      type="submit"
                      disabled={!this.state.canSubmit}
                      primary
                      fullWidth
                      style={{ marginTop: '2em' }}
                      label={'Post'} />
              </Formsy.Form>
          </section>
    )
  }
}

const createPost = gql`
  mutation createPost($title: String!, $content: String!, $documents: [File]) {
    createPost(title: $title, content: $content, documents: $documents) {
      errors {
        field
        message
      }
      post {
        key
      }
    }
  }
`

CreatePost.propTypes = {
  createPost: PropTypes.func
}

export default graphql(createPost, {
  props: ({ mutate }) => ({
    createPost: (title, content, documents) => mutate({
      variables: { title, content, documents }
    })
  })
})(CreatePost)
