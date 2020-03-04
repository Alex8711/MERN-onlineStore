import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import {
  FormControl,
  Input,
  InputLabel,
  Button,
  Paper,
  Grid
} from "@material-ui/core";
import {register} from '../reducers/authReducer'
import {Alert} from '@material-ui/lab';
import {clearErrors} from '../reducers/errorReducer'

class SignUp extends Component {
  state = {
    name: "",
    email: "",
    password: "",
    passwordConfirmation: "",
    errors: [],
    msg:null
  };

  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  isFormEmpty = ({ name, email, password, passwordConfirmation }) => {
    return !name || !email || !password || !passwordConfirmation;
  };

  isPasswordValid = ({ password, passwordConfirmation }) => {
    if (password.length < 6 || passwordConfirmation.length < 6) {
      return false;
    } else if (password !== passwordConfirmation) {
      return false;
    } else {
      return true;
    }
  };

  isFormValid = () => {
    let errors = [];
    let error;
    if (this.isFormEmpty(this.state)) {
      error = { message: "Fill in all fields" };
      this.setState({ errors: errors.concat(error) });
    } else if (!this.isPasswordValid(this.state)) {
      error = { message: "Password is invalid" };
      this.setState({ errors: errors.concat(error) });
    } else {
      return true;
    }
  };

  submitForm = event => {
    event.preventDefault();
    let dataToSubmit = {
      email: this.state.email,
      name: this.state.name,
      password: this.state.password,
      passwordConfirmation: this.state.passwordConfirmation
    };

    if (this.isFormValid()) {
      this.setState({ errors: [] });
      //attempt to register
      this.props.register(dataToSubmit)
    } else {
      console.error("Data is not valid");
    }
  };

  componentDidUpdate(prevProps){
    const{error, isAuthenticated}=this.props;
    if(error!==prevProps.error){
      // check for register error
      if(error.id==="REGISTER_FAIL"){
        this.setState({
          msg:error.msg.msg
        })
      }else{
        this.setState({msg:null});
      }
    }
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
        {this.state.msg?<Alert color="danger">{this.state.msg}</Alert>:null}
          <form>
            <FormControl margin="normal" required fullWidth>
              <InputLabel htmlFor="name">Name</InputLabel>
              <Input
                id="name"
                name="name"
                autoComplete="name"
                value={this.state.name}
                onChange={e => this.handleChange(e)}
              />
            </FormControl>
            <FormControl margin="normal" required fullWidth>
              <InputLabel htmlFor="email">Email Address</InputLabel>
              <Input
                id="email"
                name="email"
                autoComplete="email"
                value={this.state.email}
                onChange={e => this.handleChange(e)}
              />
            </FormControl>
            <FormControl margin="normal" required fullWidth>
              <InputLabel htmlFor="password">Password</InputLabel>
              <Input
                name="password"
                type="password"
                id="password"
                value={this.state.password}
                onChange={e => this.handleChange(e)}
              />
            </FormControl>
            <FormControl margin="normal" required fullWidth>
              <InputLabel htmlFor="password">Confirm Password</InputLabel>
              <Input
                name="passwordConfirmation"
                type="password"
                id="passwordConfirmation"
                value={this.state.passwordConfirmation}
                onChange={e => this.handleChange(e)}
              />
            </FormControl>

            {this.state.errors.length > 0 && (
              <div>something wrong</div>
            )}

            <Button
              component={Link}
              to="/"
              fullWidth
              variant="contained"
              color="primary"
              mb={2}
              style={{ marginTop: "10px" }}
              onClick={this.submitForm}
            >
              Sign up
            </Button>
          </form>
        </Paper>
      </Grid>
    );
  }
}

const mapStateToProps = state=>({
  isAuthenticated: state.auth.isAuthenticated,
  error:state.error
})

export default connect(mapStateToProps,{register,clearErrors})(SignUp);
