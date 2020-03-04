import React from "react";
import { AppBar, Typography, Toolbar,IconButton} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { useSelector } from "react-redux";
import {logout} from '../../reducers/authReducer'
import { useDispatch } from "react-redux";


const useStyles = makeStyles(theme => ({
  grow: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    // display: 'none',
    [theme.breakpoints.up('sm')]: {
      display: 'block',
    },
  },
  
  sectionDesktop: {
    // display: 'none',
    [theme.breakpoints.up('md')]: {
      display: 'flex',
    },
  },
}));

const Navbar = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(state=>
    state.auth.isAuthenticated
  )
  const user = useSelector(state=>
    state.auth.user
  )


  // const handleLogout = ()=>{
  //   logout();
  // }
      
  return (
    <div className={classes.grow}>
    <AppBar position="static">
      <Toolbar>
        
        <Typography className={classes.title} variant="h6" noWrap>
        <IconButton color="inherit" href="/">
            
        Online Store  
      
       </IconButton>
        </Typography>

        <div className={classes.grow} />
        <div className={classes.sectionDesktop}>

         {isAuthenticated? (<div>
          <span style={{fontSize:"30px",marginRight:"15px"}} >Welcome {user.name}</span>
          <IconButton color="inherit" href="/cart">
            
              Cart
            
          </IconButton>
          <IconButton  color="inherit" href="#" onClick={()=>{dispatch(logout())}}>
           
             Logout
          
          </IconButton></div>)
          : (
            <div><IconButton  color="inherit" href="/login">
           
          Login
       
       </IconButton>
       <IconButton  color="inherit" href="/register">
           
       Sign Up
    
    </IconButton>
       
       </div>)
         }
        </div>
      </Toolbar>
    </AppBar>
  </div>
  );
};

export default Navbar; 
