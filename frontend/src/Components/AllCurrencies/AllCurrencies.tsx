import { Component } from "react";
import "./AllCurrencies.css";
import { Grid } from "@material-ui/core";
import SingelCurrency from "../SingelCurrency/SingelCurrency";
import axios from "axios";
import Currency from "../../models/Currency";
interface AllCurrenciesState {
  allCurrencies: Currency[];
}
class AllCurrencies extends Component<{}, AllCurrenciesState> {
  constructor(props: {}) {
    super(props);
    this.state = { allCurrencies: [] };
  }
  public render(): JSX.Element {
    return (
      <div className="AllCurrencies">
        <h1>Our Currencies</h1>
        <Grid container spacing={2}>
          {this.state.allCurrencies.map((currency, i) => (
            <SingelCurrency
              key={i}
              image={currency.image}
              name={currency.name}
            />
          ))}
        </Grid>
      </div>
    );
  }
  componentDidMount = async () => {
    try {
      const response = await axios.get<Currency[]>(
        `http://localhost:4000/api/currencies/all`
      );
      this.setState({ allCurrencies: response.data });
    } catch (error: any) {
      alert(error);
    }
  };
}

export default AllCurrencies;
