import React, { Component } from "react";
import Dashboard from "./Dashboard";
import config_dashboard from './config.dashboard';

class App extends Component {
  constructor(props) {
    super(props);
    // Initial state of the component
    this.state = {
      startDate: "",
      endDate: "",
      movAvgPeriod: null,
      initialized: false,
      updateDashboard: false,
      autoUpdate: config_dashboard.auto_update_on_load
    };
    
    // Temp end date for demo
    this.tempEndDate = new Date(2018, 3, 1);
    
    // Bind functions to class
    this.setDateRange_by_day = this.setDateRange_by_day.bind(this);
    this.setDateRange_by_month = this.setDateRange_by_month.bind(this);
    this.setDateRange_by_year = this.setDateRange_by_year.bind(this);
    this.setDateRange_ytd = this.setDateRange_ytd.bind(this);
    this.setDateRange_all = this.setDateRange_all.bind(this);
    this.triggerUpdate = this.triggerUpdate.bind(this);
    this.triggerAutoUpdate = this.triggerAutoUpdate.bind(this);
  }

  // Called after component is mounted
  componentDidMount() {
    this.setDateRange_by_day(7); // Default date range when app is loaded
    if (this.state.autoUpdate) {
      this.updateTimer = setInterval(this.triggerUpdate, config_dashboard.auto_update_interval);
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (!(this.state.initialized))
      this.requestMovingAveragePeriod();

    if (this.state.initialized 
      && this.state.movAvgPeriod == null 
      && prevState.startDate !== this.state.startDate)
      this.requestMovingAveragePeriod();

    if (this.state.updateDashboard)
      this.setState({ updateDashboard: false });
  }
  
  render() {
    return <Dashboard
            startDate={this.state.startDate}
            endDate={this.state.endDate}
            movAvgPeriod={this.state.movAvgPeriod}
            updateDashboard={this.state.updateDashboard}
            autoUpdate={this.state.autoUpdate}
            setDateRange_by_day={this.setDateRange_by_day}
            setDateRange_by_month={this.setDateRange_by_month}
            setDateRange_by_year={this.setDateRange_by_year}
            setDateRange_ytd={this.setDateRange_ytd}
            setDateRange_all={this.setDateRange_all}
            triggerUpdate={this.triggerUpdate}
            triggerAutoUpdate={this.triggerAutoUpdate}
            />;
  }

  async requestMovingAveragePeriod() {
    var url = `getkpimovingaverageperiod/${this.state.startDate}/${this.state.endDate}`;

    try{
      // GET request to retrieve data
      var res = await fetch(url);
      var resBody;

      if (res.ok) {
        // GET request to retrieve data
        resBody = await res.text();
        if (isNaN(resBody))
          resBody = null;
        if (this.state.initialized) {
          this.setState({
            movAvgPeriod: resBody
          });
        } else {
          this.setState({
            movAvgPeriod: resBody,
            initialized: true
          });
        }
      } else {
        resBody = await res.json();
        console.log(`Failed request - url: ${res.url}, status: ${res.status}`);
        console.log(resBody);
      }
    } catch (error) {
      console.log(error.message);      
    }
  }

  setDateRange(start, end) {
    this.setState({startDate: start, endDate: end});
  }

  setDateRange_by_day(day) {
    // var end = new Date();
    // var start = new Date();

    var end = this.tempEndDate;
    var start = new Date(end.toDateString());
    
    start.setDate(start.getDate() - (day - 1));
    this.setState({startDate: start.toDateString(), endDate: end.toDateString(), movAvgPeriod: null});
  }

  setDateRange_by_month(month) {
    // var end = new Date(); 
    // var start = new Date();

    var end = this.tempEndDate;
    var start = new Date(end.toDateString());

    start.setMonth(start.getMonth() - month);
    this.setState({startDate: start.toDateString(), endDate: end.toDateString(), movAvgPeriod: null});
  }

  setDateRange_by_year(year) {
    // var end = new Date();   
    // var start = new Date();

    var end = this.tempEndDate;
    var start = new Date(end.toDateString());

    start.setFullYear(start.getFullYear() - year);
    this.setState({startDate: start.toDateString(), endDate: end.toDateString(), movAvgPeriod: null});
  }

  setDateRange_ytd() {
    // var end = new Date();
    // var start = new Date();

    var end = this.tempEndDate;
    var start = new Date(end.toDateString());

    start.setMonth(0);
    start.setDate(1);
    this.setState({startDate: start.toDateString(), endDate: end.toDateString(), movAvgPeriod: null});
  }

  setDateRange_all() {
    // var end = new Date();
    var end = "end";    
    var start = "start";
    this.setState({startDate: start, endDate: end, movAvgPeriod: null});
  }

  triggerUpdate() {
    this.setState({ updateDashboard: true }); 
  }

  triggerAutoUpdate() {
    if (this.state.autoUpdate) {
      this.setState({ autoUpdate: false })
      clearInterval(this.updateTimer);
    } else {
      this.setState({ autoUpdate: true });
      this.updateTimer = setInterval(this.triggerUpdate, config_dashboard.auto_update_interval); 
    }
  }
}

export default App;