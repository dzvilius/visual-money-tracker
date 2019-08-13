// Visual Money Tracker v1.0.0 | github.com/dzvilius/visual-money-tracker
// Author: Vilius Dzemyda | hello@viliusdzemyda.com

// =============================================================================
// BASE
// =============================================================================

// Set default D3 colour scheme
dc.config.defaultColors(d3.schemeSet2)

// TIMEFRAME SELECTORS ====================================================== //

var yearSelector = dc.selectMenu('#yearSelector') // Year select menu
var monthSelector = dc.cboxMenu('#monthSelector') // Month select menu

// OVERVIEW ================================================================= //

var overviewInNumber = dc.numberDisplay('#numberDisplayOverviewInNumber') // Overview income number
var overviewOutNumber = dc.numberDisplay('#numberDisplayOverviewOutNumber') // Overview spending number
var overviewBalNumber = dc.numberDisplay('#numberDisplayOverviewBalNumber') // Overview balance number
var overviewChart = dc.compositeChart('#overviewChart') // Overview chart

// INCOME =================================================================== //

var summaryInNumber = dc.numberDisplay('#summaryInNumber') // Income category number
var summaryInChart = dc.pieChart('#summaryInChart') // Income category chart
var summaryInChartLegend = document.getElementById('summaryInChartLegend') // Income category legend

// SPENDING ================================================================= //

var summaryOutNumber = dc.numberDisplay('#summaryOutNumber') // Spending category number
var summaryOutChart = dc.pieChart('#summaryOutChart') // Spending category chart
var summaryOutChartLegend = document.getElementById('summaryOutChartLegend') // Spending category legend

// TRANSACTIONS ============================================================= //

var transactionsTableAll = dc.dataTable('#transactionsTableAll') // All transactions list
var transactionsTableShort = dc.dataTable('#transactionsTableShort') // Short transactions list

// =============================================================================
// MAIN
// =============================================================================

d3.csv('./assets/data/transactions.csv').then(function(transactions) {
  // Set date format to'd/m/year'
  var dateFormat = d3.timeFormat('%d/%m/%Y')

  // Format CSV data
  transactions.forEach(function(d) {
    d.order = Number(d.order)
    d.date = dateFormat(new Date(d.date))
    d.day = Number(d.day)
    d.month = Number(d.month)
    d.year = Number(d.year)
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

  // ===========================================================================
  // DC & CROSSFILTER
  // ===========================================================================

  // Set Crossfilter
  var ndx = crossfilter(transactions)

  // ===========================================================================
  // DIMENSIONS
  // ===========================================================================

  // Order
  var orderDim = ndx.dimension(function(d) {
    return d.order
  })

  // Year
  var yearDim = ndx.dimension(function(d) {
    return d.year
  })

  // Month number
  var monthDim = ndx.dimension(function(d) {
    return d.month
  })

  // Month name
  var monthStrDim = ndx.dimension(function(d) {
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

  // Type
  var typeDim = ndx.dimension(function(d) {
    return d.type
  })

  // Category
  var categoryDim = ndx.dimension(function(d) {
    return d.category
  })

  // ===========================================================================
  // GROUPS
  // ===========================================================================

  // Years
  var yearGrp = yearDim.group()

  // Months
  var monthGrp = monthStrDim.group()

  // Total income
  var titalInGrp = ndx.groupAll().reduceSum(function(d) {
    return d.amount_in
  })

  // Total spending
  var totalOutGrp = ndx.groupAll().reduceSum(function(d) {
    return d.amount_out
  })

  // Total balance
  var totalBalGrp = ndx.groupAll().reduceSum(function(d) {
    return d.amount
  })

  // Monthly income
  var monthInGrp = monthDim.group().reduceSum(function(d) {
    return d.amount_in
  })

  // Monthly spending
  var monthOutGrp = monthDim.group().reduceSum(function(d) {
    return d.amount_out
  })

  // Monthly balance
  var monthBalGrp = monthDim.group().reduceSum(function(d) {
    return d.amount
  })

  // Type income
  var typeInGrp = typeDim.group().reduceSum(function(d) {
    return d.amount_in
  })

  // Type spending
  var typeOutGrp = typeDim.group().reduceSum(function(d) {
    return d.amount_out
  })

  // Category income
  var categoryInGrp = categoryDim.group().reduceSum(function(d) {
    return d.amount_in
  })

  // Category spending
  var categoryOutGrp = categoryDim.group().reduceSum(function(d) {
    return d.amount_out
  })

  // ===========================================================================
  // TIMEFRAME SELECTORS
  // ===========================================================================

  yearSelector
    .dimension(yearDim)
    .promptText('All Years')
    .group(yearGrp)
    .title(function(d) {
      return d.key
    })
  yearSelector.render()

  monthSelector
    .dimension(monthStrDim)
    .group(monthGrp)
    .multiple(true)
    .controlsUseVisibility(true)
    .title(function(d) {
      return d.key[1]
    })
  monthSelector.render()

  // ===========================================================================
  // OVERVIEW
  // ===========================================================================

  overviewInNumber
    .transitionDuration(300)
    .formatNumber(function(d) {
      return '€' + d3.format(',.3s')(d)
    })
    .valueAccessor(function(d) {
      return d
    })
    .group(titalInGrp)
  overviewInNumber.render()

  overviewOutNumber
    .transitionDuration(300)
    .formatNumber(function(d) {
      return '€' + d3.format(',.3s')(d)
    })
    .valueAccessor(function(d) {
      return d
    })
    .group(totalOutGrp)
  overviewOutNumber.render()

  overviewBalNumber
    .transitionDuration(300)
    .formatNumber(function(d) {
      return '€' + d3.format(',.3s')(d)
    })
    .valueAccessor(function(d) {
      return d
    })
    .group(totalBalGrp)
  overviewBalNumber.render()

  overviewChart
    .transitionDuration(600)
    .width(null)
    .height(240)
    .margins({ top: 0, left: 50, right: 8, bottom: 30 })
    .colors(d3.scaleOrdinal(d3.schemeSet2))
    .x(
      d3
        .scaleLinear()
        .domain([monthDim.bottom(1)[0].month, monthDim.top(1)[0].month])
    )
    .brushOn(false)
    .yAxisPadding('20%')
    .compose([
      dc
        .lineChart(overviewChart)
        .dimension(monthDim)
        .colors('#66c2a5')
        .curve(d3.curveCardinal)
        .group(monthInGrp),
      dc
        .lineChart(overviewChart)
        .dimension(monthDim)
        .colors('#F45B69')
        .curve(d3.curveCardinal)
        .group(monthOutGrp),
      dc
        .lineChart(overviewChart)
        .dimension(monthDim)
        .colors('#4F86C6')
        .curve(d3.curveCardinal)
        .group(monthBalGrp),
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
  overviewChart.render()

  // ===========================================================================
  // INCOME
  // ===========================================================================

  summaryInNumber
    .transitionDuration(300)
    .formatNumber(function(d) {
      return '€' + d3.format(',.3r')(d)
    })
    .group(typeInGrp)
  summaryInNumber.render()

  summaryInChart
    .transitionDuration(800)
    .width(290)
    .height(290)
    .innerRadius(70)
    .externalLabels(30)
    .externalRadiusPadding(50)
    .dimension(categoryDim)
    .group(categoryInGrp)
    .legend(
      dc
        .htmlLegend()
        .container(summaryInChartLegend)
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
  summaryInChart.render()

  // ===========================================================================
  // SPENDING
  // ===========================================================================

  summaryOutNumber
    .transitionDuration(300)
    .formatNumber(function(d) {
      return '€' + d3.format(',.3r')(d)
    })
    .group(typeOutGrp)
  summaryOutNumber.render()

  summaryOutChart
    .transitionDuration(800)
    .width(290)
    .height(290)
    .innerRadius(70)
    .externalLabels(30)
    .externalRadiusPadding(50)
    .dimension(categoryDim)
    .group(categoryOutGrp)
    .legend(
      dc
        .htmlLegend()
        .container(summaryOutChartLegend)
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
  summaryOutChart.render()

  // ===========================================================================
  // TRANSACTIONS
  // ===========================================================================

  transactionsTableShort
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
  transactionsTableShort.render()

  transactionsTableAll
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
  transactionsTableAll.render()
})

// =============================================================================
// UTILITIES
// =============================================================================

// https://stackoverflow.com/questions/29371256/dc-js-piechart-legend-hide-if-result-is-0

// Disable income pie chart legend if value is 0
dc.override(summaryInChart, 'legendables', function() {
  var legendables = this._legendables()
  return legendables.filter(function(l) {
    return l.data > 0
  })
})

// Disable spending pie chart legend if value is 0
dc.override(summaryOutChart, 'legendables', function() {
  var legendables = this._legendables()
  return legendables.filter(function(l) {
    return l.data > 0
  })
})
