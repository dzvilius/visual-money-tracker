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
