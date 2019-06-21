# Visual Money Tracker

A data dashboard with transactions overview and charts built with D3.js library.

## UX

Income and spending data visualisation with D3 charts.

To learn more about the needs of user, please read the [Project Brief](ux/Project_Brief.md) document.

#### Objectives

- See a better overview of personal finances
- Increase money saving
- Reduce money spending

### Users

- Personal user

### Stories

---

**_"As a user, I want to see my transactions in one place, so that, I can see my income, spending and balance at once."_**

- As a user, I want to see my transactions in one place, so that, I can see all information at once.
  - [ ] Create a layout template for dashboard.
  - [ ] Load data from CSV via D3.js API.
  - [ ] Add DC.js for charts interlinking.
  - [ ] Format currency in Euros.

---

**_"As a user, I want to see my total amounts, so that, I can see my income, spending and balance."_**

- As a user, I want to see my income total, so that, I can see how much I earned.
  - [ ] Create a function to calculate income total.
  - [ ] Output 12 months income total value in 'Overview' section.
- As a user, I want to see my expanses total, so that, I can see how much I spent.
  - [ ] Create a function to calculate spending total.
  - [ ] Output 12 months spending total value in 'Overview' section.
- As a user, I want to see my balance, so that, I can see how much I have.
  - [ ] Create a function to calculate the balance.
  - [ ] Output 12 months balance value in 'Overview' section.

---

**_"As a user, I want to see my transactions data visually, so that, I can see my income, spending and balance over the period of 12 months."_**

- As a user, I want to see my income visually, so that, I know how much I earned over the year.
  - [ ] Display the data as a line chart with data points for each month.
  - [ ] Green colour scheme.
- As a user, I want to see my spending visually, so that, I know how much I spent over the year.
  - [ ] Display the data as a line chart with data points for each month.
  - [ ] Red colour scheme.
- As a user, I want to see my balance visually, so that, I know how my balance changed over the year.
  - [ ] Display the data as a line chart with data points for each month.
  - [ ] Blue colour scheme.

---

**_"As a user, I want to see a visual chart for my income only, so that, I can see my earnings in more detail."_**

- As a user, I want to see my income as a chart, so that, I can see what percentage comes from each source.
  - [ ] Display the data as a pie chart split into categories for each income source.
  - [ ] Display a percentage value.
  - [ ] Multi colour scheme with shades.

---

**_"As a user, I want to see a visual chart for my spending only, so that, I can see how much I spend in more detail."_**

- As a user, I want to see my spending as chart, so that, I can see what percentage goes to each spending category.
  - [ ] Display the data as a pie chart split into categories for each spending category.
  - [ ] Display a percentage value.
  - [ ] Multi colour scheme with shades.

---

**_"As a user, I want easy access to a complete transactions list, so that, I can see all of my transactions."_**

- As a user, I want to see a full list of transactions, so that, I can see all details.
  - [ ] Display a table with all transactions.
  - [ ] ~~Filter by month.~~
  - [ ] ~~View individual transaction.~~

---

## Features

- Data visualisation with charts
- Single page application (SPA)
- CSV import via API
- Data overview
- Data charts
- Data filtering
- Mobile optimised

_Features to be implemented in the future:_

- View an individual transaction
- Add new transaction
- Edit current transaction

## Structure

<u>_The Mindmap_</u>

![alt text](ux/Wireframes/Mindmap.png)

## Skeleton

#### Wireframes

<u>_Dashboard view_</u>

![alt text](ux/Wireframes/Dashboard.png)

<u>_Transactions view_</u>

![alt text](ux/Wireframes/Transactions.png)

## Surface

#### Fonts

- Ubuntu - https://fonts.google.com/specimen/Ubuntu (Primary font)

#### Colours

...

#### Design Mockups

...

## Tech

A list of all of the languages, frameworks and libraries used to construct this project.

- JavaScript, HTML & CSS
- D3.js API
  - Load transactions data from CVS file.
- DC.js library
  - Pie chart
  - Line chart
  - Table view
- SVG
  - Draw the charts using dynamic data
- Jasmine
  - Test driven development
- Bootstrap CSS - https://getbootstrap.com
  - Grid for application layout
- Google Fonts - https://fonts.google.com
  - Support non-standard fonts on user browser
- Prettier - https://prettier.io
  - Code clean up

## Testing

### UX

User needs checklist:

- [ ] User is able to see a numeric data overview of the transactions for 12 months.
- [ ] User is able to see the list of transactions and filter them by category.
- [ ] User is able to see a line chart for 12 month transactions.

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
