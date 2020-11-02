import {Navbar, Nav} from 'react-bootstrap';
import logo from '../images/logo.PNG'
import '../App.css'
const MyNav = () =>{
    return (
        <Navbar bg="dark" variant="dark">

        <Navbar.Brand href="#home">
          <img
            alt="connectfour"
            src={logo}
            width="30"
            height="30"
            className="d-inline-block align-top mr-7"
          />{' '}
          Connect Four AI
        </Navbar.Brand>

        <Nav className="justify-content-center">
         <Nav.Link>Login</Nav.Link>
         <Nav.Link>Profile</Nav.Link>
      </Nav>
      
      </Navbar>
    )
}

export default MyNav