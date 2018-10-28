var config_dashboard = {}

/************************************************
 * CONFIGURATIONS FOR THE REACT DASHBOARD       *
 *                                              *
 * WARNING:                                     *
 *                                              *
 * If you change any settings here,             *
 * you must recompile the front-end             *
 * using the command "npm run build-front"      *
 ************************************************/

config_dashboard = {

    // Start date for date range "all"
    date_range_all_startDate: "2017-01-01",

    // Auto update on/off state on app launch
    auto_update_on_load: true,

    // Auto update timer interval (in milliseconds)
    auto_update_interval: 1000 * 60 * 60,

    // Auto play on/off state on app launch
    auto_play_tabs_on_load: false,

    // Auto play switch tab timer interval (in milliseconds)
    auto_play_next_tab_timer: 1000 * 30

}

module.exports = config_dashboard;