const { body, validationResult } = require('express-validator/check')

// To make it easier to use in the view, might be nicer as a Nunjucks function
function getErrors (errorsInstance) {
  if (errorsInstance.isEmpty()) {
    return false
  }
  const errors = errorsInstance.array()
  const formattedErrors = {}
  errors.forEach(error => {
    formattedErrors[error.param] = {
      href: '#' + error.param,
      value: error.value,
      text: error.msg
    }
  })
  return formattedErrors
}

module.exports = (app) => {
  app.post(
    '/full-page-examples/what-is-your-postcode',
    [
      body('address-postcode')
        .exists()
        .not().isEmpty().withMessage('Enter your home postcode')
    ],
    (request, response) => {
      const errors = getErrors(validationResult(request))
      if (errors) {
        return response.render('./full-page-examples/what-is-your-postcode/index', {
          errors,
          errorSummary: Object.values(errors),
          values: request.body // In production this should sanitized.
        })
      }
      response.render('./full-page-examples/what-is-your-postcode/confirm')
    }
  )
}