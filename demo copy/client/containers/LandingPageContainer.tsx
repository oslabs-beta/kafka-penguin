import LandingNavBar from '../components/LandingNavBar';
import LandingBody from '../components/LandingBody';
import { FC } from 'react';
import * as React from 'react';
import MainContainer from './MainContainer';


type Props = {
  setRedirect: (
    value: boolean
  ) => void;
};
const LandingPageContainer: FC <Props> = ({setRedirect}: Props) => {
  return (
  <div>
  <LandingNavBar />
  <LandingBody />
  </div>
  )
};

class Abc extends React.Component {
  handle(){
    alert('move to second component')
  }
   render (){
     return (<div><h1>second</h1><button onClick={this.handle}>move to second page</button></div>);

   }
}
class Pqr extends React.Component {
   render (){
     return (<div><h1>second</h1><button>click</button></div>)

   }
}
class Sqr extends React.Component {
   render (){
     return <h1>third</h1>
   }
}
ReactDOM.render(<Abc/>,document.getElementById('root')); 



export default {LandingPageContainer};