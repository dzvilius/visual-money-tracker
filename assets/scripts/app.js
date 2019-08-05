// Visual Money Tracker v1.0.0 | github.com/dzvilius/visual-money-tracker
// Author: Vilius Dzemyda | hello@viliusdzemyda.com

// Set default colour scheme
dc.config.defaultColors(d3.schemeSet2)

// Total income display
var numberDisplayIncome = dc.numberDisplay('#numberDisplayIncome')

// Income breakdown chart
var pieChartIncome = dc.pieChart('#pieChartIncome')

// All transactions table
var tableAllTransactions = dc.dataTable('#tableAllTransactions')

// Recent transactions table
var tableRecentTransactions = dc.dataTable('#tableRecentTransactions')

// Import transactions from CSV
d3.csv('./assets/data/transactions-temp.csv').then(function(transactions) {
  // Set date format to'd/m/year'
  var dateFormat = d3.timeFormat('%d/%m/%Y')
  console.log(transactions)

  // Format the transactions
  transactions.forEach(function(d) {
    d.order = Number(d.order)
    d.date = dateFormat(new Date(d.date))
    // d.amount = Number(d.amount)
    //   .toFixed(2)
    //   .toString()
    //   .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    d.amount = Math.abs(d.amount)
    //console.log(d.amount)
  })

  // Set crossfilter
  var ndx = crossfilter(transactions)

  // Order dimension
  var orderDimension = ndx.dimension(function(d) {
    return d.order
  })

  // Type dimension
  var typeDimension = ndx.dimension(function(d) {
    return d.type
  })

  // Category dimension
  var categoryDimension = ndx.dimension(function(d) {
    return d.category
  })

  // var filtering = ndx.dimension(function(d) { return d.type; })
  // filtering.filter('IN')

  // var grouping = filtering.group().reduceCount();
  // var first = grouping.top(2)

  // Total income dimension
  // var totalIncomeDimension = typeDimension.group().reduceSum(function(d) {
  //   return d.amount
  // })

  var totalIncomeDimension = typeDimension.group().reduceSum(function(d) {
    return d.amount
  })

  // var countDimension = ndx
  //   .groupAll()
  //   .reduceCount()
  //   .value()
  //console.log(countDimension)

  // var _groupAll = ndx.groupAll()

  // Render number display with income total
  numberDisplayIncome
    .formatNumber(function(d) {
      return '€' + d3.format(',')(d)
    })
    .group(totalIncomeDimension)
  numberDisplayIncome.render()

  // Render pie chart with income source breakdown
  pieChartIncome
    .width(290)
    .height(290)
    .innerRadius(40)
    .externalLabels(20)
    .externalRadiusPadding(40)
    //.colors(d3.scaleOrdinal(d3.schemeGreens[9]))
    .dimension(typeDimension)
    .group(totalIncomeDimension)
    .label(function(d) {
      var label = d.key + ' ' + d.value
      return label
    })
  pieChartIncome.render()

  // Render table with all transactions
  tableAllTransactions
    .dimension(orderDimension)
    .size(1000)
    .showSections(false)
    .columns(['date', 'payee', 'amount'])
    .sortBy(function(d) {
      return d.order
    })
    .order(d3.descending)
  tableAllTransactions.render()

  // Render table with 5 recent transactions
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
