import React, { Component } from "react";
import { fetchHistData } from "./data/dataservice";
import { Line } from "react-chartjs-2";
import Select from "react-select";

let countryOptions = [{ value: "all", label: "World" }];

const countriesData = require("./assets/countries.json");

countriesData.forEach((country) =>
  countryOptions.push({
    value: country.name,
    label: country.name,
  })
);

class CountryGraph extends Component {
  constructor(props) {
    super(props);
    this.state = {
      country: "all",
      chartData: {
        labels: [],
        datasets: [
          {
            label: "Cases",
            data: [],
            fill: true,
            borderColor: "red",
          },
        ],
      },
    };
  }

  async componentDidMount() {
    this.loadData(this.state.country);
  }

  async componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevState.country !== this.state.country) {
      this.loadData(this.state.country);
    }
  }

  async loadData(country) {
    const { cases, deaths, recovered } = await fetchHistData(country);
    this.setState({
      chartData: {
        labels: Object.keys(cases),
        datasets: [
          {
            label: "Cases",
            data: Object.values(cases),
            fill: true,
            borderColor: "red",
          },
          {
            label: "Deaths",
            data: Object.values(deaths),
            fill: true,
            borderColor: "blue",
          },
          {
            label: "Recovered",
            data: Object.values(recovered),
            fill: true,
            borderColor: "green",
          },
        ],
      },
    });
  }

  handleChange = (event) => this.setState({ country: event.value });

  render() {
    return (
      <div className={"chart"}>
        <Select
          placeholder={"Select Country"}
          value={countryOptions.find((obj) => obj.value === this.state.country)}
          options={countryOptions}
          onChange={this.handleChange}
        />
        <Line data={this.state.chartData} />
      </div>
    );
  }
}

export default CountryGraph;