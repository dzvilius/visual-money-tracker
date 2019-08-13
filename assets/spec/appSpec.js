// Visual Money Tracker v1.0.0 | github.com/dzvilius/visual-money-tracker
// Author: Vilius Dzemyda | hello@viliusdzemyda.com

// =============================================================================
// TESTS
// =============================================================================

// Table of transactions
describe('Table of transactions', function() {

  // Check if table contains correct amount of columns
  describe('Total of columns', function() {
    it('Should be equal to 4', function() {
      expect(tableColConfig().length).toEqual(4)
    })
  })

  // Check for correct column names
  describe('Column names', function() {
    it("Should be equal to 'Date', 'Payee', 'In', 'Out'", function() {
      expect(tableColConfig()[0]).toEqual('date')
      expect(tableColConfig()[1]).toEqual('payee')
      expect(tableColConfig()[2].label).toEqual('In')
      expect(tableColConfig()[3].label).toEqual('Out')
    })
  })
})

// Month names generation
describe('Month generation', function() {

  // Set months
  var monthJan = monthName(1)[1]
  var monthFeb = monthName(2)[1]
  var monthMar = monthName(3)[1]
  var monthApr = monthName(4)[1]
  var monthMay = monthName(5)[1]
  var monthJun = monthName(6)[1]
  var monthJul = monthName(7)[1]
  var monthAug = monthName(8)[1]
  var monthSep = monthName(9)[1]
  var monthOct = monthName(10)[1]
  var monthNov = monthName(11)[1]
  var monthDec = monthName(12)[1]

  describe('Month names', function() {
    it('Data type should be string', function() {
      expect(typeof(monthJan)).toEqual('string')
      expect(typeof(monthFeb)).toEqual('string')
      expect(typeof(monthMar)).toEqual('string')
      expect(typeof(monthApr)).toEqual('string')
      expect(typeof(monthMay)).toEqual('string')
      expect(typeof(monthJun)).toEqual('string')
      expect(typeof(monthJul)).toEqual('string')
      expect(typeof(monthAug)).toEqual('string')
      expect(typeof(monthSep)).toEqual('string')
      expect(typeof(monthOct)).toEqual('string')
      expect(typeof(monthNov)).toEqual('string')
      expect(typeof(monthDec)).toEqual('string')
    })
  })

  // Check if month name is correct
  describe('Month numbers', function() {
    it('01 should be equal to January', function() {
      expect(monthJan).toEqual('January')
    })
    it('02 should be equal to February', function() {
      expect(monthFeb).toEqual('February')
    })
    it('03 should be equal to March', function() {
      expect(monthMar).toEqual('March')
    })
    it('04 should be equal to April', function() {
      expect(monthApr).toEqual('April')
    })
    it('05 should be equal to May', function() {
      expect(monthMay).toEqual('May')
    })
    it('06 should be equal to June', function() {
      expect(monthJun).toEqual('June')
    })
    it('07 should be equal to July', function() {
      expect(monthJul).toEqual('July')
    })
    it('08 should be equal to August', function() {
      expect(monthAug).toEqual('August')
    })
    it('09 should be equal to September', function() {
      expect(monthSep).toEqual('September')
    })
    it('10 should be equal to October', function() {
      expect(monthOct).toEqual('October')
    })
    it('11 should be equal to November', function() {
      expect(monthNov).toEqual('November')
    })
    it('12 should be equal to December', function() {
      expect(monthDec).toEqual('December')
    })
  })
})
