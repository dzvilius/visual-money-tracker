# Visual Money Tracker

A data dashboard application to visualise personal income and spending.

[Live Preview](https://elastic-hawking-05c821.netlify.com/)

![alt text](ux/Screenshot.jpg)

## UX

An overview data dashboard with charts and list of transactions to visualise and track the money flow.

To learn more about the needs of the user, please read the [Project Brief](ux/Project_Brief.md) document.

#### Objectives

- Display a breakdown of totals
- Compare income vs spending
- Sort the transactions
- Calculate and display the balance

### Users

- Personal user

### Stories

Check out the [User Stories](ux/User_Stories.md) for this project.

## Features

- Import CSV import via API
- Format the data
- Output data as table
- Visual chart for income categories
- Visual chart for spending categories
- Data filtering by year, month, type and category
- Multiple month selection
- Responsive UI

_Features to be implemented in the future:_

- View an individual transaction
- Add new transaction
- Edit current transaction

## Structure

_The Mindmap_

![alt text](ux/Wireframes/Mindmap.png)

## Skeleton

#### Wireframes

_Home view_

![alt text](ux/Wireframes/Home.png)

_Transactions view_

![alt text](ux/Wireframes/Transactions.png)

## Surface

#### Fonts

- Ubuntu - https://fonts.google.com/specimen/Ubuntu (Primary font)

#### Colours

![alt text](ux/Designs/Colours.jpg)

#### Design Mockups

_Small:_ [Home](ux/Designs/Small/Home.png), [Transactions](ux/Designs/Small/Transactions.png)

_Medium:_ [Home](ux/Designs/Medium/Home.png), [Transactions](ux/Designs/Medium/Transactions.png)

_Large:_ [Home](ux/Designs/Large/Home.png), [Transactions](ux/Designs/Large/Transactions.png)

## Tech

A list of all of the languages, frameworks and libraries used to construct this project.

- JavaScript, HTML & CSS
- D3.js API - https://d3js.org/
  - Import transactions from CVS file.
- DC.js library - https://dc-js.github.io/dc.js/
  - Composite chart
  - Pie chart
  - Table view
  - Number display
  - Select menu
  - Checkbox
- Crossfilter.js library - https://github.com/crossfilter/crossfilter
  - Dimensions and filtering
- SVG
  - Draw the charts using dynamic data
- Jasmine - https://jasmine.github.io/
  - Test Driven Development (TDD)
- Bootstrap CSS - https://getbootstrap.com
  - Grid - for application layout
  - Buttons - for navigation
- Google Fonts - https://fonts.google.com
  - Support non-standard fonts in user browser
- Prettier - https://prettier.io
  - Code clean up

## Testing

### UX

User needs checklist:

- [x] User can select year and see the income for that year.
- [x] User can select year and see the spending for that year.
- [x] User can select year and see the balance for that year.
- [x] User can see a dynamic chart that updates based on the selection.
- [x] User can select multiple months and see the income for those months.
- [x] User can select multiple months and see the spending for those months.
- [x] User can select multiple months and see the balance for those months.
- [x] User can select category and see the income for that category.
- [x] User can select category and see the spending for that category.
- [x] User can see list of transactions and filter them by year, month or category.

### Code

...

### Browsers

...

## Deployment

...

## Credits

#### Media

...

#### Acknowledgements

...
