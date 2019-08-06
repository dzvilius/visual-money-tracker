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

// Total income for current month number display
var numberDisplayIncome = dc.numberDisplay('#numberDisplayIncome')

// Total spending for current month number display
var numberDisplaySpending = dc.numberDisplay('#numberDisplaySpending')

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
d3.csv('./assets/data/transactions-temp.csv').then(function(transactions) {
  // Set date format to'd/m/year'
  var dateFormat = d3.timeFormat('%d/%m/%Y')

  // Format the transactions
  transactions.forEach(function(d) {
    d.order = Number(d.order)
    d.date = dateFormat(new Date(d.date))
    if (d.in !== '') {
      d.inSt =
        '€' +
        Number(d.in)
          .toFixed(2)
          .toString()
          .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    }
    if (d.out !== '') {
      d.outSt =
        '€' +
        Number(d.out)
          .toFixed(2)
          .toString()
          .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    }
  })

  var test = function () {
    return 2 + 2
  }

  // function sum( obj ) {
  //   var sum = 0;
  //   for( var el in obj ) {
  //     if( obj.hasOwnProperty( el ) ) {
  //       sum += parseFloat( obj[el] );
  //     }
  //   }
  //   return sum;
  // }

  console.log( test() );
  // var sample = { a: 10 , b: 2 , c:3 };
  // var summed = sum( +transactions['in'] );
  // // console.log( 'sum: ' + summed );





  // console.log(
  //   [1, 2, 3, 4].reduce((a, b) => a + b, 0)
  // )

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

  // Type dimension
  var typeDim = ndx.dimension(function(d) {
    return d.type
  })

  // Income dimension
  var inDim = ndx.dimension(function(d) {
    return d.in
  })

  // Spending dimension
  var outDim = ndx.dimension(function(d) {
    return d.out
  })

  // Income group
  var inGroup = categoryDim.group().reduceSum(function(d) {
    return d.in
  })

  // Spending group
  var outGroup = categoryDim.group().reduceSum(function(d) {
    return d.out
  })

  // Total income group
  var totalInGroup = typeDim.group().reduceSum(function(d) {
    return d.in
  })

  // Total spending group
  var totalOutGroup = typeDim.group().reduceSum(function(d) {
    return d.out
  })

  // Render number display with income total for 12 months
  numberDisplayYearIncome
    .formatNumber(function(d) {
      //return '€' + d3.format(',')(d)
      return d
    })
    .group(totalInGroup)
  numberDisplayYearIncome.render()

  // Render number display with spending total for 12 months
  numberDisplayYearSpending
    .formatNumber(function(d) {
      //return '€' + d3.format(',')(d)
      return d
    })
    .group(totalOutGroup)
  numberDisplayYearSpending.render()

  // Render number display with balance for 12 months
  // numberDisplayYearBalance
  //   .formatNumber(function(d) {
  //     //console.log(d)
  //     //return '€' + d3.format(',')(d)
  //     return d
  //   })
  //   .group(totalYearBalance)
  // numberDisplayYearBalance.render()

  // Render number display with income total
  numberDisplayIncome
    .formatNumber(function(d) {
      return '€' + d3.format(',')(d)
    })
    .group(totalInGroup)
  numberDisplayIncome.render()

  // Render number display with spending total
  numberDisplaySpending
    .formatNumber(function(d) {
      return '€' + d3.format(',')(d)
    })
    .group(totalOutGroup)
  numberDisplaySpending.render()

  // Render pie chart with income breakdown
  pieChartIncome
    .width(290)
    .height(290)
    .innerRadius(60)
    .externalLabels(30)
    .externalRadiusPadding(50)
    .dimension(inDim)
    .group(inGroup)
    .legend(
      dc
        .htmlLegend()
        .container('#htmlLegendIncome')
        .horizontal(false)
        .highlightSelected(true)
        .legendText(function(d) {
          return d.name + ' - €' + d3.format(',')(d.data)
        })
    )
    .on('pretransition', function(chart) {
      chart.selectAll('text.pie-slice').text(function(d) {
        if (d.data.value !== 0) {
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
    .width(290)
    .height(290)
    .innerRadius(60)
    .externalLabels(30)
    .externalRadiusPadding(50)
    .dimension(outDim)
    .group(outGroup)
    .legend(
      dc
        .htmlLegend()
        .container('#htmlLegendSpending')
        .horizontal(false)
        .highlightSelected(true)
        .legendText(function(d) {
          return d.name + ' - €' + d3.format(',')(d.data)
        })
    )
    .on('pretransition', function(chart) {
      chart.selectAll('text.pie-slice').text(function(d) {
        if (d.data.value !== 0) {
          return (
            dc.utils.printSingleValue(
              Math.round(((d.endAngle - d.startAngle) / (2 * Math.PI)) * 100)
            ) + '%'
          )
        }
      })
    })
  pieChartSpending.render()

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
})
