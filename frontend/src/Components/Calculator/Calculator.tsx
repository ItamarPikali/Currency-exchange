import { Component, SyntheticEvent } from "react";
import "./Calculator.css";
import { InputLabel, MenuItem, Select, TextField } from "@material-ui/core";
import jwtAxios from "../../services/JwtAxios";

interface CalculatorState {
  result: number;
  options: string[];
  fromCurrency: string;
  toCurrency: string;
  numToCalculate: number;
  rate: number;
}
class Calculator extends Component<{}, CalculatorState> {
  constructor(props: {}) {
    super(props);
    this.state = {
      result: 0,
      options: ["USD","EUR","ILS","CNY","BRL","RUB","SAR","TMT","GBP","JOD","JPY","CHF"],
      fromCurrency: "",
      toCurrency: "",
      numToCalculate: 0,
      rate: 0,
    };
  }
  public render(): JSX.Element {
    return (
      <div className="Calculator">
        <h3>Calculate Now</h3>
        <br />
        <br />
        <InputLabel id="c-select-label">CURRENCY FOR CONVERSION :</InputLabel>
        <Select
          value={this.state.fromCurrency}
          onClick={this.fromCurrencyChanged}
          labelId="c-select-label"
          variant="outlined"
          defaultValue={0}
        >
          {this.state.options.map((option, index) => (
            <MenuItem key={index} value={option}>
              {option}
            </MenuItem>
          ))}
        </Select>
        <br />
        <br />

        <InputLabel id="c-select-label">CURRENCY CONVERT TO IT :</InputLabel>
        <Select
          value={this.state.toCurrency}
          onClick={this.toCurrencyChanged}
          labelId="c-select-label"
          variant="outlined"
          defaultValue={0}
        >
          {this.state.options.map((option, index) => (
            <MenuItem key={index} value={option}>
              {option}
            </MenuItem>
          ))}
        </Select>
        <br />
        <br />

        <TextField
          className="loginInput"
          label="ENTER AN AMOUNT"
          variant="outlined"
          type="text"
          onChange={this.numToCalculateChanged}
          value={this.state.numToCalculate}
        />

        <p>
          {this.state.numToCalculate !== 0 && this.state.numToCalculate}{" "}
          {this.state.numToCalculate !== 0 && this.state.fromCurrency}
          {this.state.result !== 0 && " = "}
          {this.state.result !== 0 && this.state.result}{" "}
          {this.state.result > 0 && this.state.toCurrency}
        </p>
        <p>{this.state.rate > 0 && `RATE : ${this.state.rate}`}</p>
      </div>
    );
  }
  fromCurrencyChanged = (e: SyntheticEvent) => {
    const fromCurrency = (e.target as HTMLInputElement).value;
    if (!fromCurrency || fromCurrency === this.state.toCurrency) return;
    this.setState({ fromCurrency: fromCurrency }, () => {
      this.calculate();
    });
  };
  toCurrencyChanged = (e: SyntheticEvent) => {
    const toCurrency = (e.target as HTMLInputElement).value;
    if (!toCurrency || toCurrency === this.state.fromCurrency) return;
    this.setState({ toCurrency: toCurrency }, () => {
      this.calculate();
    });
  };
  numToCalculateChanged = (e: SyntheticEvent) => {
    const numToCalculate = +(e.target as HTMLInputElement).value;
    if (!numToCalculate) return;
    this.setState({ numToCalculate: numToCalculate }, () => {
      this.calculate();
    });
  };
  calculate = async () => {
    if (
      !this.state.fromCurrency ||
      !this.state.numToCalculate ||
      !this.state.toCurrency
    ) {
      return;
    } else if (this.state.fromCurrency === this.state.toCurrency) {
      return;
    }
    try {
      const response = await jwtAxios.get(
        `http://localhost:4000/api/${this.state.fromCurrency}/${this.state.numToCalculate}/${this.state.toCurrency}`
      );
      this.setState({ result: response.data.result, rate: response.data.rate });
    } catch (error: any) {
      alert(error.response.data);
    }
  };
}

export default Calculator;
