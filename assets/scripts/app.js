// Visual Money Tracker v1.0.0 | github.com/dzvilius/visual-money-tracker
// Author: Vilius Dzemyda | hello@viliusdzemyda.com

// Set default colour scheme
dc.config.defaultColors(d3.schemeSet2)

var monthSelector = dc.cboxMenu('#monthSelector')

// 12 months income number display
var numberDisplayYearIncome = dc.numberDisplay('#numberDisplayYearIncome')

// 12 months spending number display
var numberDisplayYearSpending = dc.numberDisplay('#numberDisplayYearSpending')

// 12 months balance number display
var numberDisplayYearBalance = dc.numberDisplay('#numberDisplayYearBalance')

// Income, Spending and Balance line chart for 12 months
var chartYearOverview = dc.compositeChart('#chartYearOverview')

// Total income for current month number display
var numberDisplayIncome = dc.numberDisplay('#numberDisplayIncome')

// Total spending for current month number display
var numberDisplaySpending = dc.numberDisplay('#numberDisplaySpending')

// Timeframe select meneu
var timeframeSelectMenu = dc.selectMenu('#timeframeSelectMenu')

// Income chart
var pieChartIncome = dc.pieChart('#pieChartIncome')

// Disable legend with 0 value
// https://stackoverflow.com/questions/29371256/dc-js-piechart-legend-hide-if-result-is-0
dc.override(pieChartIncome, 'legendables', function() {
  var legendables = this._legendables()
  return legendables.filter(function(l) {
    return l.data > 0
  })
})

// Spending chart
var pieChartSpending = dc.pieChart('#pieChartSpending')

// Disable legend with 0 value
// https://stackoverflow.com/questions/29371256/dc-js-piechart-legend-hide-if-result-is-0
dc.override(pieChartSpending, 'legendables', function() {
  var legendables = this._legendables()
  return legendables.filter(function(l) {
    return l.data > 0
  })
})

// All transactions table
var tableAllTransactions = dc.dataTable('#tableAllTransactions')

// Recent transactions table
var tableRecentTransactions = dc.dataTable('#tableRecentTransactions')

// Import transactions from CSV
d3.csv('./assets/data/transactions.csv').then(function(transactions) {
  // Set date format to'd/m/year'
  var dateFormat = d3.timeFormat('%d/%m/%Y')

  // Format the transactions
  transactions.forEach(function(d) {
    d.order = Number(d.order)
    d.date = dateFormat(new Date(d.date))
    d.day = Number(d.day)
    d.month = Number(d.month)
    d.amount = Number(d.amount)
    if (d.amount > 0) {
      d.amount_in = Number(d.amount)
      d.amount_out = 0
      d.amount_in_str =
        '€' +
        Number(d.amount_in)
          .toFixed(2)
          .toString()
          .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
      d.amount_out_str = ''
    }
    if (d.amount < 0) {
      d.amount_in = 0
      d.amount_out = Math.abs(d.amount)
      d.amount_in_str = ''
      d.amount_out_str =
        '€' +
        Number(d.amount_out)
          .toFixed(2)
          .toString()
          .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    }
  })

  // Set crossfilter
  var ndx = crossfilter(transactions)

  var chartYearOverviewDim = ndx.dimension(function(d) {
    return d.month
  })

  var chartYearOverviewGrpIn = chartYearOverviewDim
    .group()
    .reduceSum(function(d) {
      return d.amount_in
    })

  var chartYearOverviewGrpOut = chartYearOverviewDim
    .group()
    .reduceSum(function(d) {
      return d.amount_out
    })

  var chartYearOverviewGrpBal = chartYearOverviewDim
    .group()
    .reduceSum(function(d) {
      return d.amount
    })

  // Start of the year
  var chartYearOverviewMinDate = chartYearOverviewDim.bottom(1)[0].month

  // End of the year
  var chartYearOverviewMaxDate = chartYearOverviewDim.top(1)[0].month

  var transactionTypeDim = ndx.dimension(function(d) {
    return d.type
  })

  var transactionOutDim = ndx.dimension(function(d) {
    return d.type
  })

  var transactionInGrp = ndx.groupAll().reduceSum(function(d) {
    return d.amount_in
  })

  var transactionOutGrp = ndx.groupAll().reduceSum(function(d) {
    return d.amount_out
  })

  var transactionBalanceGrp = ndx.groupAll().reduceSum(function(d) {
    return d.amount
  })

  // Order dimension
  var orderDim = ndx.dimension(function(d) {
    return d.order
  })

  // Month dimension
  var monthDim = ndx.dimension(function(d) {
    var month = d.month
    var month_str = ''

    switch (month) {
      case 1:
        month_str = 'January'
        break
      case 2:
        month_str = 'February'
        break
      case 3:
        month_str = 'March'
        break
      case 4:
        month_str = 'April'
        break
      case 5:
        month_str = 'May'
        break
      case 6:
        month_str = 'June'
        break
      case 7:
        month_str = 'July'
        break
      case 8:
        month_str = 'August'
        break
      case 9:
        month_str = 'September'
        break
      case 10:
        month_str = 'October'
        break
      case 11:
        month_str = 'November'
        break
      case 12:
        month_str = 'December'
        break
    }

    return [('0' + month).slice(-2), month_str]
  })

  // Category dimension
  var categoryDim = ndx.dimension(function(d) {
    return d.category
  })

  // Type dimension
  var typeDim = ndx.dimension(function(d) {
    return d.type
  })

  // Type + Month dimension
  var typeMonthDim = ndx.dimension(function(d) {
    return [d.type, d.month]
  })

  // Income group
  var inGroup = categoryDim.group().reduceSum(function(d) {
    return +d.amount_in
  })

  // Spending group
  var outGroup = categoryDim.group().reduceSum(function(d) {
    return +d.amount_out
  })

  // Total income group
  var totalInGroup = typeDim.group().reduceSum(function(d) {
    return +d.amount_in
  })

  // Total spending group
  var totalOutGroup = typeDim.group().reduceSum(function(d) {
    return +d.amount_out
  })

  var totalBalance = typeDim.group().reduceSum(function(d) {
    return +d.amount_out
  })

  // Month group
  var monthGroup = monthDim.group()

  // Total amount group
  var totalAmountGroup = typeMonthDim.group().reduceSum(function(d) {
    return d.amount
  })

  // Start of the year
  var minDate = typeMonthDim.bottom(1)[0].month

  // End of the year
  var maxDate = typeMonthDim.top(1)[0].month

  // Uppercase the first letter
  // https://flaviocopes.com/how-to-uppercase-first-letter-javascript/
  const capitalize = s => {
    if (typeof s !== 'string') return ''
    return s.charAt(0).toUpperCase() + s.slice(1)
  }

  monthSelector
    .dimension(monthDim)
    .group(monthGroup)
    .multiple(true)
    //    .numberVisible(10)
    .controlsUseVisibility(true)
  monthSelector.title(function(d) {
    return d.key[1]
  })
  monthSelector.render()

  // Render timeframe select menu
  timeframeSelectMenu
    .dimension(monthDim)
    .promptText('Full Year')
    .group(monthGroup)

  timeframeSelectMenu.title(function(d) {
    return d.key[1]
  })
  timeframeSelectMenu.render()

  // Render number display with income total for 12 months
  numberDisplayYearIncome
    .transitionDuration(300)
    .formatNumber(function(d) {
      return '€' + d3.format(',.3s')(d)
    })
    .valueAccessor(function(d) {
      return d
    })
    .group(transactionInGrp)
  numberDisplayYearIncome.render()

  // Render number display with spending total for 12 months
  numberDisplayYearSpending
    .transitionDuration(300)
    .formatNumber(function(d) {
      return '€' + d3.format(',.3s')(d)
    })
    .valueAccessor(function(d) {
      return d
    })
    .group(transactionOutGrp)
  numberDisplayYearSpending.render()

  // Render number display with balance for 12 months
  numberDisplayYearBalance
    .transitionDuration(300)
    .formatNumber(function(d) {
      return '€' + d3.format(',.3s')(d)
    })
    .valueAccessor(function(d) {
      return d
    })
    .group(transactionBalanceGrp)
  numberDisplayYearBalance.render()

  // Render number display with income total
  numberDisplayIncome
    .transitionDuration(300)
    .formatNumber(function(d) {
      return '€' + d3.format(',.4r')(d)
    })
    .group(totalInGroup)
  numberDisplayIncome.render()

  // Render number display with spending total
  numberDisplaySpending
    .transitionDuration(300)
    .formatNumber(function(d) {
      return '€' + d3.format(',.4r')(d)
    })
    .group(totalOutGroup)
  numberDisplaySpending.render()

  // Render line chart with 12 month overview
  chartYearOverview
    .transitionDuration(600)
    .width(null)
    .height(240)
    .margins({ top: 0, left: 40, right: 8, bottom: 30 })
    .colors(d3.scaleOrdinal(d3.schemeSet2))
    .x(
      d3
        .scaleLinear()
        .domain([chartYearOverviewMinDate, chartYearOverviewMaxDate])
    )
    .brushOn(false)
    .yAxisPadding('20%')
    .compose([
      dc
        .lineChart(chartYearOverview)
        .dimension(chartYearOverviewDim)
        .colors('#66c2a5')
        .curve(d3.curveCardinal)
        .group(chartYearOverviewGrpIn),
      dc
        .lineChart(chartYearOverview)
        .dimension(chartYearOverviewDim)
        .colors('#F45B69')
        .curve(d3.curveCardinal)
        .group(chartYearOverviewGrpOut),
      dc
        .lineChart(chartYearOverview)
        .dimension(chartYearOverviewDim)
        .colors('#4F86C6')
        .curve(d3.curveCardinal)
        .group(chartYearOverviewGrpBal),
    ])
    .elasticY(true)
    .elasticX(true)
    .brushOn(false)
    .renderHorizontalGridLines(true)
    .childOptions({
      renderDataPoints: { radius: 3, fillOpacity: 1, strokeOpacity: 1 },
    })
    .yAxis()
    .tickFormat(function(d) {
      return '€' + d3.format(',d')(d)
    })
  chartYearOverview.render()

  // Render pie chart with income breakdown
  pieChartIncome
    .transitionDuration(800)
    .width(290)
    .height(290)
    .innerRadius(60)
    .externalLabels(30)
    .externalRadiusPadding(50)
    .dimension(categoryDim)
    .group(inGroup)
    .legend(
      dc
        .htmlLegend()
        .container('#htmlLegendIncome')
        .legendText(function(d) {
          return d.name + ' - €' + d3.format(',')(d.data)
        })
    )
    .on('pretransition', function(chart) {
      chart.selectAll('text.pie-slice').text(function(d) {
        if (d.value !== 0) {
          return (
            dc.utils.printSingleValue(
              Math.round(((d.endAngle - d.startAngle) / (2 * Math.PI)) * 100)
            ) + '%'
          )
        }
      })
    })
  pieChartIncome.render()

  // Render pie chart with spending breakdown
  pieChartSpending
    .transitionDuration(800)
    .width(290)
    .height(290)
    .innerRadius(60)
    .externalLabels(30)
    .externalRadiusPadding(50)
    .dimension(categoryDim)
    .group(outGroup)
    .legend(
      dc
        .htmlLegend()
        .container('#htmlLegendSpending')
        .horizontal(false)
        .legendText(function(d) {
          return d.name + ' - €' + d3.format(',')(d.data)
        })
    )
    .on('pretransition', function(chart) {
      chart.selectAll('text.pie-slice').text(function(d) {
        if (d.value !== 0) {
          return (
            dc.utils.printSingleValue(
              Math.round(((d.endAngle - d.startAngle) / (2 * Math.PI)) * 100)
            ) + '%'
          )
        }
      })
    })
  pieChartSpending.render()

  // Render table with 10 recent transactions
  tableRecentTransactions
    .dimension(orderDim)
    .size(10)
    .showSections(false)
    .columns([
      'date',
      'payee',
      {
        label: 'In',
        format: function(d) {
          return d.amount_in_str
        },
      },
      {
        label: 'Out',
        format: function(d) {
          return d.amount_out_str
        },
      },
    ])
    .sortBy(function(d) {
      return d.order
    })
    .order(d3.descending)
  tableRecentTransactions.render()

  // Render table with all transactions
  tableAllTransactions
    .dimension(orderDim)
    .size(1000)
    .showSections(false)
    .columns([
      'date',
      'payee',
      {
        label: 'In',
        format: function(d) {
          return d.amount_in_str
        },
      },
      {
        label: 'Out',
        format: function(d) {
          return d.amount_out_str
        },
      },
    ])
    .sortBy(function(d) {
      return d.order
    })
    .order(d3.descending)
  tableAllTransactions.render()
})
