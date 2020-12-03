import './App.css';
import ConnectFour from './components/ConnectFour/ConnectFour'
import Navbar from './components/Navbar'
import PlayerChoice from './components/PlayerChoice/PlayerChoice'
import {Container} from 'react-bootstrap';


function App() {
  return (
    <div className="App"> 
      <Navbar className="navbar-app"></Navbar>
      <PlayerChoice/>
      <ConnectFour className="mt-5"></ConnectFour>
      {/* <Container className=" mt-5 pb-3 pt-5">
        <ConnectFour className="mt-5 marginTop"></ConnectFour>
      </Container> */}
      

    </div>
  );
}




export default App;
