var kpi = {};

kpi.moving_average =
{
    // If date range factor = 0.1 (10%)
    // the moving average period will be 10% of the selected date range
    date_range_factor: .3,

    // Maximum days in a period, will be used if date_range_factor becomes
    // greater than this setting
    max_days_in_period: 40
};

kpi.goals =
{
    // Build time including queue (for successful builds)
    build_time_from_queue:
    {
        target_minutes: 500,
        stretch_minutes: 400
    },

    // Story points to be completed annually
    story_points_velocity:
    {
        target_annual:  400,
        stretch_annual: 500
    },

    // Daily build success rate
    build_success_rate:
    {
        target_rate: 0.5,
        stretch_rate: 0.6
    },

    // Targets for daily bugs created
    bugs_per_day:
    {
        target: 1,
        stretch: 0.75
    },

    // Targets for difference (resolved - created) annually
    bugs_rc_difference:
    {
        target_annual: 100,
        stretch_annual: 200
    },

    // Days to resolve major bugs
    bugs_resolution_time_major:
    {
        target: 180,
        stretch: 90
    },

    // Days to resolve critical bugs
    bugs_resolution_time_critical:
    {
        target: 30,
        stretch: 15
    }
};

module.exports = kpi;