import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import Formsy from 'formsy-react'
import { gql, graphql } from 'react-apollo'
import { RaisedButton } from 'material-ui'
import { FormsyText } from 'formsy-material-ui/lib'
import { bindAll, compose } from '../utils/function'
import { selectors } from '../lib/client-reducer'

const errorMessages = {
  invalidEmail: 'Email is not valid',
  passwordMismatch: 'Passwords should match'
}

class CreateComment extends Component {
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
    const { createComment, postKey } = this.props
    const { content } = data
    createComment(content, postKey).then(({ data }) => {
      const { errors } = data.createComment
      if (errors.length > 0) {
        this.form.updateInputsWithError(errors.reduce((update, { field, message }) => (
          { ...update, [field]: message }
        ), {}))
      } else {
        this.form.reset()
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
            <h1> Write Comment </h1>
            {this.props.clientState.loggedin
            ? <div className={'commentBox'}>
                <FormsyText
                    floatingLabelText="Comment"
                    required
                    name="content"
                    style={{
                      display: 'block',
                      width: '100%' }} />
                <RaisedButton
                    type="submit"
                    disabled={!this.state.canSubmit}
                    primary
                    style={{ marginTop: '2em' }}
                    label={'Post'}/>
            </div> : <p><a href={'/login'}>Login</a> to write comments</p>}
        </Formsy.Form>
        <style jsx>{`
          .commentBox {
            display: flex;
          }
        `}</style>
      </section>
    )
  }
}

const createComment = gql`
  mutation createComment($content: String!, $postKey: String!) {
    createComment(content: $content, postKey: $postKey) {
      errors {
        field
        message
      }
    }
  }
`

CreateComment.propTypes = {
  createComment: PropTypes.func,
  clientState: PropTypes.shape({
    loggedin: PropTypes.bool
  })
}

const mapStateToProps = state => ({
  clientState: selectors.getClient(state)
})

export default compose(
  graphql(createComment, {
    props: ({ mutate }) => ({
      createComment: (content, postKey) => mutate({
        variables: { content, postKey },
        refetchQueries: ['post']
      })
    })
  }),
  connect(mapStateToProps)
)(CreateComment)
