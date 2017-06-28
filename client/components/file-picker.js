import React from 'react'
import Formsy from 'formsy-react'
import { RaisedButton } from 'material-ui'

const FilePicker = React.createClass({
  mixins: [Formsy.Mixin],

  changeValue ({ target }) {
    this.setValue(target.files)
  },

  render () {
    const {
      defaultValue, // eslint-disable-line no-unused-vars
      requiredError,
      underlineFocusStyle,
      underlineStyle,
      updateImmediately, // eslint-disable-line no-unused-vars
      validations, // eslint-disable-line no-unused-vars
      validationError, // eslint-disable-line no-unused-vars
      validationErrors, // eslint-disable-line no-unused-vars
      value, // eslint-disable-line no-unused-vars
      label,
      ...rest
    } = this.props
    const { _value } = this.state
    const labelWithCount = `${label}${_value ? ` (${_value.length})` : ``}`
    return (
      <RaisedButton containerElement={'label'} label={labelWithCount}>
        <input
          type={'file'}
          style={{ display: 'none' }}
          onChange={this.changeValue}
          {...rest}
        />
      </RaisedButton>
    )
  }
})

export default FilePicker
