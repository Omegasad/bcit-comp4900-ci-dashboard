## **This repository was manually copied from an existing private repository to protect confidential files. Therefore, the commit history is lost.**

# KPI Visualizations

1. Installation
2. Architecture
3. Directory Structure
4. Configuration Files
5. KPI Chart Logic
6. Unit Tests
7. NPM Commands
8. Included Documentations
9. Front End (React app)

## 1. Installation

* Clone git repository on the **prototype** branch, our latest working prototype
* Install and setup required software as described in *docs/howto_setup_and_run_dashboard.md*

NOTE: Use the build in the  **master** branch when integrating the project with live data sources. The dashboard date ranges are calculated dynamically based on the system date (except date range "all").

(The 'develop', 'prototype', and 'demo' branches have a hard-coded end date for all date ranges set to 2018-04-01 due to available sample data)

## 2. Architecture

![Backend Architecture](https://raw.githubusercontent.com/MikeWeiZhou/kpi-visualizations/master/docs/architecture_backend.png)

* **Scheduler** downloads new data periodically.

* **Data Collection** layer is responsible for reading from a type of data source and return a stream of objects.
* **Data Interface** layer maps each object from the stream and writes to the Data Storage.
* **Data Storage** is an interface to store and retrieve information from MySQL.
* **KPI Mapper** reads from Data Storage and produces KPI chart data for Plotly.js to plot onto the UI.
* **Web Server** contains the web API for front-end to access KPI chart data.
* **Front End** is a single-page React app.

## 3. Directory Structure

* **build** Javascript compiled from Typescript backend source code. Includes unit tests.
* **config** Configuration files.
* **data** Sample data files.
* **docs** Holds all the documentation and how-to's.
* **logs** Server error logs organized by date and time.
* **react-app** React dashboard application. Front-end view server when run in development mode.
* **source** Typescript backend source code. Includes unit tests.

## 4. Configuration Files

The "config" directory contains configuration settings for the CI Dashbaord back-end. A restart of the server must be completed before changes will take effect. Re-compilation/re-building code is not necessary.

* **config.js** pipeline, web server, error logging, date formats
* **config.dashboard.js** front-end dashboard config
* **config.db.js** database connection, table names
* **config.kpi.js** KPI goals and moving average settings
* **schedules.js** data collection scheduling
* **sqlqueries.js** required for setting up and updating database

## 5. KPI Chart Logic

All the KPI charts uses a simple moving average. For example, if the moving average period is 30 days, then each data point on the chart is an average (equally weighted per day) of 29 days before and the current day.

### Missing Data

Some charts will ignore (not plot) the missing data, and some will zero out the missing data points.

* All the build time and build success rate charts **ignores** missing data
* Defects: Bug Resolution Velocity, Bug Creation Velocity, Bug Resolution-Creation Difference all **zeroes** missing data
* Defects: Days To Resolve Bugs charts **ignores** missing data
* All charts in User Stories category **zeroes** missing data

Number of previous day data required per point on the chart is calculated by Math.floor(MovingAveragePeriod/2)

## 6. Unit Tests

* Run command: *npm run test*
* ^ Builds and runs unit test on the back-end

## 7. NPM Commands
These commands are mainly for easier development and testing. **DB Note**: If database model changes, old tables must be dropped/changed first.

* **npm run reset-all** deletes db tables and re-setup everything
* **npm run setup** installs node dependencies, builds front and back-end, and setup database
* **npm run setup-front** setup front-end only
* **npm run setup-back** setup back-end only, including the database
***
* **npm run setup-db** will re-run all setup queries in config/sqlqueries.js
* **npm run reset-db** deletes all tables and re-runs *setup-db* command
***
* **npm run build** builds front and back-end
* **npm run build-front** builds front-end only
* **npm run build-back** builds back-end only
***
* **npm run start** runs the built version of dashboard
***
* **npm run react** runs the development version of front-end only
***
* **npm run test** builds the back-end and runs unit tests on the back-end

## 8. Included Documentations

The folder "docs" includes these documentations:

* How To Setup And Run Dashboard
* How To Add Data Source
* How To Add KPI Chart

## 9. React app

The dashboard is able to display additional charts per row by decreasing the zoom level.
The React front-end is built responsively and will resize the menu bar to accomodate smaller zoom levels.

NOTE: A limitation of the dashboard is the start date for date range "all" is hard-coded. This setting can be found in the config.dashboard.js file.