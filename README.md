> **NOTE: This repository is a copy of the student project (which used a private repository during development).**
> 
> Created by BCIT students:

> * Elisa Chu
> * Johnny Lee
> * Mike Zhou
> * Tony So

# KPI Dashboard

BCIT ISSP 2018 spring project - CI Dashboard

1. Installation
2. Configuration Files
3. KPI Chart Logic
4. Unit Tests
5. NPM Commands
6. Directory Structure
7. Included Documentations
8. React app

## 0. Prototype Update (Sun May 21, 2018 1:30 PM)

Since the last prototype:

* Implemented refresh, auto update, and auto play (cycles through tabs) features for React app
* Fixed all loading issues for front-end and made various styling and responsiveness tweaks
* Made KPI mappers more consistent in the code and in the view
* Better in-code comments of existing KPI mappers so they can serve as templates
* More documentation on how to add KPI mappers
* Bug fixes to both front- and back-end
* By default, the python date range sent only has the year-month-date, but it can be set to send the hour-minute-seconds as well in the config.js dateformat.python property
* Added config file for React app

There has been major changes including database schema update since last prototype, run command **npm run reset-all** to drop database tables and re-setup everything.

## 1. Installation

* Clone git repository on the **prototype** branch, our latest working prototype
* Install and setup required software as described in *docs/howto_setup_and_run_dashboard.md*

NOTE: Use the build in the  **master** branch when integrating the project with live data sources. The dashboard date ranges are calculated dynamically based on the system date (except date range "all").

(The 'develop', 'prototype', and 'demo' branches have a hard-coded end date for all date ranges set to 2018-04-01 due to available sample data)

## 2. Configuration Files

The "config" directory contains configuration settings for the CI Dashbaord back-end. A restart of the server must be completed before changes will take effect. Re-compilation/re-building code is not necessary.

* **config.js** pipeline, web server, error logging, date formats
* **config.dashboard.js** front-end dashboard config
* **config.db.js** database connection, table names
* **config.kpi.js** KPI goals and moving average settings
* **schedules.js** data collection scheduling
* **sqlqueries.js** required for setting up and updating database

## 3. KPI Chart Logic

All the KPI charts uses a simple moving average. For example, if the moving average period is 30 days, then each data point on the chart is an average (equally weighted per day) of 29 days before and the current day.

### Missing Data

Some charts will ignore (not plot) the missing data, and some will zero out the missing data points.

* All the build time and build success rate charts **ignores** missing data
* Defects: Bug Resolution Velocity, Bug Creation Velocity, Bug Resolution-Creation Difference all **zeroes** missing data
* Defects: Days To Resolve Bugs charts **ignores** missing data
* All charts in User Stories category **zeroes** missing data

Number of previous day data required per point on the chart is calculated by Math.floor(MovingAveragePeriod/2)

## 4. Unit Tests

* Run command: *npm run test*
* ^ Builds and runs unit test on the back-end

## 5. NPM Commands
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

## 6. Directory Structure

* **build** Javascript compiled from Typescript. Includes unit tests.
* **config** Configuration files.
* **data** Sample data files.
* **docs** Holds all the documentation and how-to's.
* **logs** Server error logs organized by date and time.
* **react-app** React dashboard application. Front-end view server when run in development mode.
* **source** Typescript source. Includes unit tests.

## 7. Included Documentations

The folder "docs" includes these documentations:

* How To Setup And Run Dashboard
* How To Add Data Source
* How To Add KPI Chart

## 8. React app

The dashboard is able to display additional charts per row by decreasing the zoom level.
The React front-end is built responsively and will resize the menu bar to accomodate smaller zoom levels.

NOTE: A limitation of the dashboard is the start date for date range "all" is hard-coded. This setting can be found in the config.dashboard.js file.
