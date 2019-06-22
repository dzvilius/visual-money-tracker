// Visual Money Tracker v1.0.0 | github.com/dzvilius/visual-money-tracker
// Author: Vilius Dzemyda | hello@viliusdzemyda.com

// All transactions table
var tableAllTransactions = dc.dataTable('#tableAllTransactions')

// Recent transactions table
var tableRecentTransactions = dc.dataTable('#tableRecentTransactions')

// Import transactions from CSV
d3.csv('./assets/data/transactions.csv').then(function(data) {
  // Set date format to'd/m/year'
  var dateFormat = d3.timeFormat('%d/%m/%Y')

  // Format the data
  data.forEach(function(d) {
    d.date = dateFormat(new Date(d.date))
    d.order = Number(d.order)
    d.amount = Number(d.amount)
      .toFixed(2)
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  })

  var ndx = crossfilter(data)

  var orderDimension = ndx.dimension(function(d) {
    return d.order
  })

  // Render a table with all transactions
  tableAllTransactions
    .dimension(orderDimension)
    .size(1000)
    .showSections(false)
    .columns(['date', 'payee', 'amount'])
    .sortBy(function(d) {
      return d.order
    })
    .order(d3.ascending)
  tableAllTransactions.render()

  // Render a table with 5 recent transactions
  tableRecentTransactions
    .dimension(orderDimension)
    .size(5)
    .showSections(false)
    .columns(['date', 'payee', 'amount'])
    .sortBy(function(d) {
      return d.order
    })
    .order(d3.descending)
  tableRecentTransactions.render()
})
