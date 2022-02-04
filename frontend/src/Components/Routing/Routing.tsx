import { Component } from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import Admin from "../Admin/Admin";
import AllCurrencies from "../AllCurrencies/AllCurrencies";
import Calculator from "../Calculator/Calculator";
import Login from "../Login/Login";
import Register from "../Register/Register";
import "./Routing.css";

class Routing extends Component {
  public render(): JSX.Element {
    return (
      <>
        <Switch>
          <Route path="/signup" component={Register} exact />
          <Route path="/admin" component={Admin} exact />
          <Route path="/login" component={Login} exact />
          <Route path="/calculator" component={Calculator} exact />
          <Route path="/currencies" component={AllCurrencies} exact />
          <Redirect from="/" to="/login" exact />
        </Switch>
      </>
    );
  }
}

export default Routing;
