import { Component } from "react";
import "./SingelCurrency.css";
import {
  Card,
  CardContent,
  CardMedia,
  Grid,
  Typography,
} from "@material-ui/core";

interface SingleCurrencyProps {
  image: string;
  name: string;
}
class SingelCurrency extends Component<SingleCurrencyProps> {
  constructor(props: SingleCurrencyProps) {
    super(props);
    this.state = {};
  }
  public render(): JSX.Element {
    return (
      <Grid item xs={6} md={2} lg={3} xl={2}>
        <Card className="SingelCurrency">
          <CardMedia
            className="media"
            height={"130px"}
            component="img"
            image={`http://localhost:4000/api/images/${this.props.image}`}
            title="image"
          />
          <CardContent>
            <Typography variant="h5">{this.props.name}</Typography>
          </CardContent>
        </Card>
      </Grid>
    );
  }
}

export default SingelCurrency;
