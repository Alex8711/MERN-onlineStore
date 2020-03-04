import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import {
  FormControl,
  Input,
  InputLabel,
  Button,
  Paper,
  Grid
} from "@material-ui/core";
import { login } from "../reducers/authReducer";

class Login extends Component {
  state = {
    email: "",
    password: "",
    errors: []
  };

  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  isFormvalid = ({ email, password }) => email && password;

  submitForm = event => {
    event.preventDefault();

    let dataToSubmit = {
      email: this.state.email,
      password: this.state.password
    };

    if (this.isFormvalid(this.state)) {
      this.setState({ errors: [] });
      this.props.login(dataToSubmit)
    } else {
      this.setState({
        errors: this.state.errors.concat("Form is not valid")
      });
    }
  };

  displayErrors = errors => errors.map((err, i) => <p key={i}>{err}</p>);
 
  componentDidUpdate(prevProps){
    const{error, isAuthenticated}=this.props;
    
    // if authenticated, redirect to home page
    if(isAuthenticated){
      this.props.history.push('/')
    }
  }



  render() {
    return (
      <Grid
        container
        spacing={0}
        alignItems="center"
        justify="center"
        style={{ minHeight: "100vh" }}
      >
        <Paper
          style={{
            width: "500px",
            height: "300px"
          }}
        >
          <form>
            <FormControl margin="normal" required fullWidth>
              <InputLabel htmlFor="email">Email Address</InputLabel>
              <Input
                id="email"
                name="email"
                autoComplete="email"
                value={this.state.email}
                onChange={e => this.handleChange(e)}
                autoFocus
              />
            </FormControl>
            <FormControl margin="normal" required fullWidth>
              <InputLabel htmlFor="password">Password</InputLabel>
              <Input
                name="password"
                type="password"
                id="password"
                autoComplete="current-password"
                value={this.state.password}
                onChange={e => this.handleChange(e)}
              />
            </FormControl>
            {this.state.errors.length > 0 && (
              <div>{this.displayErrors(this.state.errors)}</div>
            )}
            <Button
              component={Link}
              type="submit"
              name="action"
              to="/"
              fullWidth
              variant="contained"
              color="primary"
              mb={2}
              style={{ marginBottom: "20px", marginTop: "10px" }}
              onClick={this.submitForm}
            >
              Sign in
            </Button>
            <Button
              component={Link}
              to="/register"
              fullWidth
              variant="contained"
              color="primary"
              mb={2}
              style={{ marginBottom: "20px" }}
            >
              Sign up
            </Button>
            <Button
              component={Link}
              to="/auth/reset-password"
              fullWidth
              color="primary"
            >
              Forgot password
            </Button>
          </form>
        </Paper>
      </Grid>
    );
  }
}
const mapStateToProps = state=>({
  isAuthenticated: state.auth.isAuthenticated
})

// const mapDispatchToProps = dispatch => {
//   return {
//     loginUser,
//     dispatch
//   };
// };

export default connect(mapStateToProps,{login})(Login);
