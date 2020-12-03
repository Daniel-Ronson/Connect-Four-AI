import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import { setState, useEffect, useState } from "react";
import './PlayerChoice.css'
import ToggleButton from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/Button';
import Button from 'react-bootstrap/Button'
import DropdownButton from 'react-bootstrap/DropdownButton';
import Dropdown from 'react-bootstrap/Dropdown'


class PlayerChoice extends React.Component{
    constructor(props) {
        super(props);

        this.state = {
            singlePlayer: false,
            easy: false,
            medium: false,
            hard: false,
            mulitplayer: false,
            experimental: false
        };
    }
    
    singplePlayerOptions()
    {
        this.setState({singlePlayer: true})
        
    }

    render(){

        let options


        options = 
        <ButtonGroup className = 'singlePlayer'>
            <Dropdown > 
            <Dropdown.Toggle>Single Player</Dropdown.Toggle>
          
            <Dropdown.Menu>
              <Dropdown.Item href="/easy">Easy</Dropdown.Item>
              <Dropdown.Item href="/medium">Medium</Dropdown.Item>
              <Dropdown.Item href="/hard">Hard</Dropdown.Item>
            </Dropdown.Menu>
        </Dropdown>
        <Button href="multi">Multiplayer</Button>
        <Button href="experimental">Experimental</Button>
        </ButtonGroup>


        return(
            <>              
                {options}                           
            </>

        )
    }
        
}



  export default PlayerChoice