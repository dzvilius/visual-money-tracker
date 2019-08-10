// Visual Money Tracker v1.0.0 | github.com/dzvilius/visual-money-tracker
// Author: Vilius Dzemyda | hello@viliusdzemyda.com

// Set default colour scheme
dc.config.defaultColors(d3.schemeSet2)

// 12 months income number display
var numberDisplayYearIncome = dc.numberDisplay('#numberDisplayYearIncome')

// 12 months spending number display
var numberDisplayYearSpending = dc.numberDisplay('#numberDisplayYearSpending')

// 12 months balance number display
var numberDisplayYearBalance = dc.numberDisplay('#numberDisplayYearBalance')

// Income, Spending and Balance line chart for 12 months
var chartYearOverview = dc.seriesChart('#chartYearOverview')

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
    if (d.amount_in !== '') {
      d.inSt =
        '€' +
        Number(d.amount_in)
          .toFixed(2)
          .toString()
          .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    }
    if (d.amount_out !== '') {
      d.outSt =
        '€' +
        Number(d.amount_out)
          .toFixed(2)
          .toString()
          .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    }
    d.amount = Math.abs(d.amount_in - d.amount_out)
  })

  // Set crossfilter
  var ndx = crossfilter(transactions)

  // Order dimension
  var orderDim = ndx.dimension(function(d) {
    return d.order
  })

  // Month dimension
  var monthDim = ndx.dimension(function(d) {
    var month = +d.month
    var monthText = ''

    switch (month) {
      case 1:
        monthText = 'January'
        break
      case 2:
        monthText = 'February'
        break
      case 3:
        monthText = 'March'
        break
      case 4:
        monthText = 'April'
        break
      case 5:
        monthText = 'May'
        break
      case 6:
        monthText = 'June'
        break
      case 7:
        monthText = 'July'
        break
      case 8:
        monthText = 'August'
        break
      case 9:
        monthText = 'September'
        break
      case 10:
        monthText = 'October'
        break
      case 11:
        monthText = 'November'
        break
      case 12:
        monthText = 'December'
        break
    }

    return [('0' + month).slice(-2), monthText]
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
    return [d.type, +d.month]
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
    return +d.amount
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
    .transitionDuration(600)
    .formatNumber(function(d) {
      return '€' + d3.format(',.3s')(d)
    })
    .group(totalInGroup)
  numberDisplayYearIncome.render()

  // Render number display with spending total for 12 months
  numberDisplayYearSpending
    .transitionDuration(600)
    .formatNumber(function(d) {
      return '€' + d3.format(',.3s')(d)
    })
    .group(totalOutGroup)
  numberDisplayYearSpending.render()

  // Render number display with balance for 12 months
  numberDisplayYearBalance
    .transitionDuration(600)
    .formatNumber(function(d) {
      // TO DO: calculate balance
      return '€' + d3.format(',.3s')(d)
    })
    .group(totalBalance)
  numberDisplayYearBalance.render()

  // Render number display with income total
  numberDisplayIncome
    .formatNumber(function(d) {
      return '€' + d3.format(',.5r')(d)
    })
    .group(totalInGroup)
  numberDisplayIncome.render()

  // Render number display with spending total
  numberDisplaySpending
    .formatNumber(function(d) {
      return '€' + d3.format(',.5r')(d)
    })
    .group(totalOutGroup)
  numberDisplaySpending.render()

  // Render line chart with 12 month overview
  chartYearOverview
    .transitionDuration(400)
    .margins({ top: 20, left: 0, right: 10, bottom: 40 })
    .width(null)
    .height(260)
    .colors(d3.scaleOrdinal(d3.schemeSet2))
    .chart(function(c) {
      return dc
        .lineChart(c)
        .curve(d3.curveCardinal)
        .renderArea(true)
    })
    .x(d3.scaleLinear().domain([minDate, maxDate]))
    .brushOn(false)
    .clipPadding(10)
    .ordinalColors(['#66c2a5', '#F45B69'])
    .elasticY(true)
    .elasticX(true)
    .yAxisPadding('30%')
    .dimension(typeMonthDim)
    .group(totalAmountGroup)
    .mouseZoomable(false)
    .seriesAccessor(function(d) {
      return d.key[0]
    })
    .keyAccessor(function(d) {
      return +d.key[1]
    })
    .valueAccessor(function(d) {
      return +d.value
    })
    .childOptions({
      renderDataPoints: { radius: 3, fillOpacity: 1, strokeOpacity: 1 },
    })
    .legend(
      dc
        .htmlLegend()
        .container('#legendYearOverviewChart')
        .horizontal(true)
        .legendText(function(d) {
          return capitalize(d.name)
        })
    )
  chartYearOverview.yAxis().tickFormat(function(d) {
    return '€' + d3.format(',d')(d)
  })

  chartYearOverview.margins().left += 50
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
          return d.inSt
        },
      },
      {
        label: 'Out',
        format: function(d) {
          return d.outSt
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
          return d.inSt
        },
      },
      {
        label: 'Out',
        format: function(d) {
          return d.outSt
        },
      },
    ])
    .sortBy(function(d) {
      return d.order
    })
    .order(d3.descending)
  tableAllTransactions.render()
})
