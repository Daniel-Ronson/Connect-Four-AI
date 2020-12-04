import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import { setState, useEffect, useState } from "react";
import './PlayerChoice.css'
import ToggleButton from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/Button';
import Button from 'react-bootstrap/Button'
import DropdownButton from 'react-bootstrap/DropdownButton';
import Dropdown from 'react-bootstrap/Dropdown'
import AppContext from '../../AppContext'


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

    render(){ return(
    <AppContext.Consumer>
        {(context) => (
        <div className = 'controlPanel'>
            <Dropdown  onClick={e => context.setGameType('singlePlayer')} variant="secondary" className="mr-2"> 
            <Dropdown.Toggle>Single Player</Dropdown.Toggle>
          
            <Dropdown.Menu>
              <Dropdown.Item onClick={e => context.setGameDifficulty('easy')}>Easy</Dropdown.Item>
              <Dropdown.Item onClick={e => context.setGameDifficulty('medium')}>Medium</Dropdown.Item>
              <Dropdown.Item onClick={e => context.setGameDifficulty('hard')}>Hard</Dropdown.Item>
            </Dropdown.Menu>
        </Dropdown>

        <Button className="mr-2 controlPanelButton" variant="secondary" value= "multiplayer" onClick={e => context.setGameType(e.target.value)}>
            Multiplayer
        </Button>
        <Button className="controlPanelButton" variant="secondary"  value= "experimental" onClick={e => context.setGameType(e.target.value)}>Experimental</Button>

        </div>
    )}
    </AppContext.Consumer>
    )
    }
        
}



  export default PlayerChoice