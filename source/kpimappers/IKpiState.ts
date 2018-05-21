/**
 * IKpiState.
 * 
 * Interface of how a KpiState object should look like.
 * Needs to be directly consumable by Plotly.js
 */
export interface IKpiState
{
    data: Array<any>;
    layout: object;
    frames: Array<any>;
    config: object;
}