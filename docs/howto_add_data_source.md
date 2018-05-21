# How To Add Data Source

We recommend Visual Studio Code for development as it provides IDE-level support for Typescript showing errors for typing and inheritance even before compilation.

## 1. Add table name to config/config.db.js

Add new table name entry to field *db.tablename*

## 2. Add sql queries to config/sqlqueries.js

* create table for new data source
* insert an entry into data source tracking table

Sample queries are provided within the file.

## 3. Add data collector layer (optional)

We already provided CSV file, JSON file, and Python data collectors. Add more if necessary.

## 4. Add a data interface layer

Create new class that implements IDataInterface. Sample data interface layer is provided.

## 5. Add a new schedule to config/schedules.js

New data sources will be queried with the data start date set in *config/config.db.js* DEFAULT field for the tracking table's TO_DATE.

* import required data collector and data interface layers at the top of the file
* add a schedule entry

Sample schedules are provided within the file. The Python sample data collector is commented out in the schedules by default. Uncomment to see it in action.

## 6. Update database and rebuild project

Run these commands from the root of the project directory:

1. npm run setup-db
2. npm run build-back