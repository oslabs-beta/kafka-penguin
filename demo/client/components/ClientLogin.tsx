import * as React from 'react';
import { useState } from 'react';
import { Button, TextField } from '@material-ui/core';

type ClientLoginProps = {
    setRedirect: (arg: boolean) => void
}

const ClientLogin: React.FC<ClientLoginProps> = ({setRedirect}: ClientLoginProps) => {

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
        noValidate>
        <TextField
          label='Enter Brokers'
          helperText='required'
          required
          id='standard-required'
          onChange={(event) => { 
            brokersOnChange(event.target.value)
          }}
        />
        <TextField
          label='Enter Username'
          helperText='required'
          required
          id='standard-required'
          onChange={(event) => {
            usernameOnChange(event.target.value);
          }}
        />
        <TextField
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