import React, { Component } from 'react';
import Plot from 'react-plotly.js';

/**
 * Graph represents a simple Plotly graph element
 */
class Graph extends Component {
    render() {    
        return (
                <Plot
                    className="graph"
                    data={this.props.data}
                    layout={this.props.layout}
                    frames={this.props.frames}
                    config={this.props.config}
                />
        );
      }
}

export default Graph;