// srv/EmployeeService.js
const cds = require('@sap/cds')

module.exports = cds.service.impl(function () {
  const { EmployeeSet } = this.entities

  // Helper: resolve currency code from various possible incoming formats
  const resolveCurrencyCode = (data, existing) => {

    // NEW FIELD ADDED: CURRENCY_CODE_code
    return (
      (data && (
        data.CURRENCY_CODE_code ||               // NEW CSV FIELD
        data.currency_code ||                    // old field if still present
        (data.Currency && data.Currency.code) || // association
        data.Currency                             // fallback
      )) ||
      (existing && (
        existing.CURRENCY_CODE_code || 
        existing.currency_code ||
        (existing.Currency && existing.Currency.code) ||
        existing.Currency
      )) ||
      null
    )
  }

  // CREATE Validation
  this.before('CREATE', 'EmployeeSet', async (req) => {
    const { salaryAmount } = req.data
    const currencyCode = resolveCurrencyCode(req.data)

    const salary = (typeof salaryAmount === 'string') ? parseFloat(salaryAmount) : salaryAmount

    if (!(salary < 50000 && currencyCode === 'USD')) {
      req.error(400, "Employee's salary must be less than 50000 USD.")
    }
  })

  this.after('CREATE', 'EmployeeSet', () => {
    console.log('Create operation successful')
  })


  // UPDATE Validation
  this.before('UPDATE', 'EmployeeSet', async (req) => {
    const keys = req.params[0] || (req.data.ID ? { ID: req.data.ID } : null)
    if (!keys) req.error(400, 'Missing key for UPDATE')

    const existing = await SELECT.one.from(EmployeeSet).where(keys)
    if (!existing) req.error(404, 'Employee not found')

    // Prevent changes to nameFirst and loginName
    if (req.data.nameFirst && req.data.nameFirst !== existing.nameFirst) {
      req.error(400, 'Operation not allowed')
    }
    if (req.data.loginName && req.data.loginName !== existing.loginName) {
      req.error(400, 'Operation not allowed')
    }

    // Validate updated salary & currency
    const newSalary = req.data.salaryAmount !== undefined ? req.data.salaryAmount : existing.salaryAmount
    const salary = typeof newSalary === 'string' ? parseFloat(newSalary) : newSalary

    const newCurrency = resolveCurrencyCode(req.data, existing)

    if (!(salary < 50000 && newCurrency === 'USD')) {
      req.error(400, "Employee's salary must be less than 50000 USD.")
    }
  })

  this.after('UPDATE', 'EmployeeSet', () => {
    console.log('Update operation successful')
  })


  // DELETE Validation
  this.before('DELETE', 'EmployeeSet', async (req) => {
    const keys = req.params[0] || (req.data.ID ? { ID: req.data.ID } : null)
    if (!keys) req.error(400, 'Missing key for DELETE')

    const existing = await SELECT.one.from(EmployeeSet).where(keys)
    if (!existing) req.error(404, 'Employee not found')

    if (existing.nameFirst && existing.nameFirst.startsWith('S')) {
      req.error(400, 'Delete not allowed')
    }
  })

  this.after('DELETE', 'EmployeeSet', () => {
    console.log('Create operation successful')
  })
})
