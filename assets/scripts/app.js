// Visual Money Tracker v1.0.0 | github.com/dzvilius/visual-money-tracker
// Author: Vilius Dzemyda | hello@viliusdzemyda.com

// Set default colour scheme
dc.config.defaultColors(d3.schemeSet2)

// Total income display
//var numberDisplayIncome = dc.numberDisplay('#numberDisplayIncome')

// Income breakdown chart
var pieChartIncome = dc.pieChart('#pieChartIncome')

// All transactions table
var tableAllTransactions = dc.dataTable('#tableAllTransactions')

// Recent transactions table
var tableRecentTransactions = dc.dataTable('#tableRecentTransactions')

// Import transactions from CSV
d3.csv('./assets/data/transactions.csv').then(function(transactions) {
  // Set date format to'd/m/year'
  var dateFormat = d3.timeFormat('%d/%m/%Y')
  //console.log(transactions)

  // Format the transactions
  transactions.forEach(function(d) {
    d.order = Number(d.order)
    d.date = dateFormat(new Date(d.date))
    d.amountSt = Number(d.amount)
      .toFixed(2)
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    d.amount = Math.abs(d.amount)
    //console.log(d.date)
  })

  // Set crossfilter
  var ndx = crossfilter(transactions)

  // Order dimension
  var orderDim = ndx.dimension(function(d) {
    return d.order
  })

  // Category dimension
  var categoryDim = ndx.dimension(function(d) {
    return d.category
  })

  // Income dimension
  var incomeDim = ndx.dimension(function(d) {
    return d.type
  })
  //incomeDim.filter('IN')

  // Total income dimension
  // var totalIncomeGroup = incomeDim.group().reduceSum(function(d) {
  //   return d.amount
  // })

  // var totalIncomeGroup = incomeDim.group().reduceSum(function(d) {
  //   return d.amount
  // })

  var incomeGroup = categoryDim.group().reduceSum(function(d) {
    return d.amount
  })

  //console.log(incomeGroup.all())

  // Render number display with income total
  // numberDisplayIncome
  //   .formatNumber(function(d) {
  //     return '€' + d3.format(',')(d)
  //   })
  //   .group(totalIncomeGroup)
  // numberDisplayIncome.render()

  // Render pie chart with income source breakdown
  pieChartIncome
    .width(290)
    .height(290)
    .innerRadius(60)
    .externalLabels(30)
    .externalRadiusPadding(60)
    .dimension(incomeDim)
    .group(incomeGroup)
    .on('pretransition', function(chart) {
      chart.selectAll('text.pie-slice').text(function(d) {
        //console.log(JSON.stringify(d))
        if (d.data.value !== 0) {
          return (
            dc.utils.printSingleValue(
              ((d.endAngle - d.startAngle) / (2 * Math.PI)) * 100
            ) + '%'
          )
        }
      })
    })
  pieChartIncome.render()

  // Render table with all transactions
  tableAllTransactions
    .dimension(orderDim)
    .size(1000)
    .showSections(false)
    .columns([
      'date',
      'payee',
      {
        label: 'Amount (€)',
        format: function(d) {
          return d.amountSt
        },
      },
    ])
    .sortBy(function(d) {
      return d.order
    })
    .order(d3.descending)
  tableAllTransactions.render()

  // Render table with 5 recent transactions
  tableRecentTransactions
    .dimension(orderDim)
    .size(5)
    .showSections(false)
    .columns([
      'date',
      'payee',
      {
        label: 'Amount (€)',
        format: function(d) {
          return d.amountSt
        },
      },
    ])
    .sortBy(function(d) {
      return d.order
    })
    .order(d3.descending)
  tableRecentTransactions.render()
})
