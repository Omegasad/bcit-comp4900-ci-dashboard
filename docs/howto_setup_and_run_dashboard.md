# How To Setup And Run Dashboard

## 1. Install MySQL Community Server

Download MySQL Community Server installer from https://dev.mysql.com/downloads/windows/installer/8.0.html. The download requires an Oracle Web account, which is free to register.

* Leave install settings as default except:
* Select "Server only" as the Setup Type during the installation
* Select "Use Legacy Authentication Method (Retain MySQL 5.x Compatibility)" for Authentication Method

## 2. Setup MySQL and configuration

The MySQL Community Server should be registered as a service and automatically started. If not, set "MySQL80" service to start automatically.

* Run MySQL 8.0 Command Line Client and login
* Run query: **create database cidashboard**
* Update database credentials in **config/config.db.js**

## 3. Install Python
Download Python 2 or 3 from https://www.python.org/.

* Leave install settings as default except:
* Select to add Python to environmental path

## 4. Install and setup Node.js
Install the latest stable long-term-release (LTS) from https://nodejs.org/en/download/ and run the commands below:

* **This may take more than several minutes**
* cd *[directory to root of this project]*
* npm run setup

## 5. Run Server
Run these commands to start the server:

* cd *[directory to root of this project]*
* npm run start
* http://localhost (may need to specify port if config/config.js port is not set to 80)