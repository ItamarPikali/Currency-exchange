import { Component, SyntheticEvent } from "react";
import "./Admin.css";
import jwtAxios from "../../services/JwtAxios";
import { Button, InputLabel, TextField } from "@material-ui/core";
interface AdminState {
  err: string;
  image: any;
  successMessage: string;
  currencyName: string;
}
class Admin extends Component<{}, AdminState> {
  constructor(props: {}) {
    super(props);
    this.state = {
      err: "",
      image: "",
      successMessage: "",
      currencyName: "",
    };
  }
  public render(): JSX.Element {
    return (
      <div className="Admin">
        <h2>Add Currency Now</h2>
        <TextField
          className="loginInput"
          label="Currency Name"
          variant="outlined"
          type="text"
          onChange={this.currencyNameChanged}
          value={this.state.currencyName}
        />
        <p>
          <InputLabel>Currency Image:</InputLabel>
          <br />
          <input
            type="file"
            name="myImage"
            onChange={this.imageChanged}
            multiple
            accept="image/png, image/jpeg, image/webp, image/gif"
          />
        </p>
        <Button variant="contained" color="primary" onClick={this.addCurrency}>
          Add Currency
        </Button>
        <br />
        <br />
        {this.state.err && <div className="errMessage">{this.state.err}</div>}
        {this.state.successMessage && (
          <div className="successMessage">{this.state.successMessage}</div>
        )}
      </div>
    );
  }
  private imageChanged = (e: SyntheticEvent) => {
    const image = (e.target as HTMLInputElement).files;
    this.setState({ image: image });
  };

  currencyNameChanged = (e: SyntheticEvent) => {
    const currencyName = (e.target as HTMLInputElement).value;
    this.setState({ currencyName: currencyName });
  };

  addCurrency = async () => {
    if (!this.state.image) {
      this.setState({ err: "please select an image", successMessage: "" });
      return;
    } else if (!this.state.currencyName) {
      this.setState({ err: "please select Currency-Name", successMessage: "" });
      return;
    }
    const currency = new FormData();
    currency.append("image", this.state.image[0]);
    currency.append("currencyName", this.state.currencyName);
    try {
      await jwtAxios.post<any>(
        `http://localhost:4000/api/add/currency`,
        currency
      );
      this.setState({
        err: "",
        successMessage:
          "added successfully!!! go and check in OUR-CURRENCIES-PAGE",
        currencyName: "",
      });
    } catch (error: any) {
      if (error?.response?.data) {
        alert(error.response.data);
      }
    }
  };
}

export default Admin;
