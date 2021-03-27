import * as React from "react";
import { useState, useEffect } from 'react';
import { Switch, Route, Router, Link, useLocation } from 'react-router-dom';
import { Button, TextField } from '@material-ui/core';

type ClientLoginProps = {
    setRedirect: Function
}

const ClientLogin = ({setRedirect}: ClientLoginProps) => {

    const [brokers, brokersOnChange] = useState('');
    const [username, usernameOnChange] = useState('');
    const [password, passwordOnChange] = useState('');

    const handleSubmit = (e: { preventDefault: () => void; }) => {
        e.preventDefault()
        //save user details to localstorage
        const userDetails = {
            brokers,
            username,
            password
        }
        localStorage.setItem('userDetails', JSON.stringify(userDetails))
        //Upon setting setRedirect to true, it will immediately route to the other component, Main 
        setRedirect(true)
    }
    
        return (
        <div className='ClientLoginContainer'>

            <form 
                id='inputs' 
                // className={classes.root} 
                noValidate>
                <TextField
                    // className={classes.textfield}
                    label='Enter Brokers'
                    helperText='required'
                    required
                    id='standard-required'
                    onChange={(event) => { 
                    brokersOnChange(event.target.value)
                    }}
                />
                <TextField
                    // className={classes.textfield}
                    label='Enter Username'
                    helperText='required'
                    required
                    id='standard-required'
                    onChange={(event) => {
                    usernameOnChange(event.target.value);
                    }}
                />
                <TextField
                    // className={classes.textfield}
                    label='Enter Password'
                    helperText='required'
                    required
                    id='standard-required'
                    onChange={(event) => {
                    passwordOnChange(event.target.value);
                    }}
                />
                <br></br>
                <Button
                    variant='contained'
                    className='submitMetrics'
                    onClick={handleSubmit}
                >
                Submit
                </Button>

            </form>
        </div>
        )
    
}

export default ClientLogin