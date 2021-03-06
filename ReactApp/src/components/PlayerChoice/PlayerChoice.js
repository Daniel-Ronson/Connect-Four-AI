import React, {useContext} from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import './PlayerChoice.css'
import {Dropdown, OverlayTrigger, Tooltip} from 'react-bootstrap';
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
            experimental: false,
            dropdownMessage: 'Single Player'
        };
    }

    setGameDifficulty(val){
        this.setState({dropdownMessage:val})
    }

    render(){ return(
    <AppContext.Consumer>
        {(context) => (
        <div className = "controlPanel">
            <div className="">
            <Dropdown className="mr-2" onClick={e => context.setGameType('singlePlayer')} variant="secondary"> 
                    <Dropdown.Toggle className="dropdown-bootrap">{this.state.dropdownMessage}</Dropdown.Toggle>
                
                    <Dropdown.Menu>
                    <Dropdown.Item onClick={e =>{this.setGameDifficulty('Easy AI');context.setGameDifficulty('easy')}}>Easy</Dropdown.Item>
                    <Dropdown.Item onClick={e => {this.setGameDifficulty('Medium AI');context.setGameDifficulty('medium')}}>Medium</Dropdown.Item>
                    <Dropdown.Item onClick={e =>{this.setGameDifficulty('Hard AI');context.setGameDifficulty('hard');}}>Hard</Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
            </div>
            <div className="aside-1">
            <button className={`controlPanelButton mr-2 ${context.state.gameType === 'multiPlayer' ? 'background-green' : 'background-gray'}`} value= "multiPlayer" onClick={e => context.setGameType(e.target.value)}>
                    Multiplayer
                </button>
            </div>
            <OverlayTrigger 
            placement="right" 
            delay={{ show: 250, hide: 400 }} 
            overlay={ <Tooltip id="button-tooltip">Space Age Features</Tooltip>}>
            <button className={`controlPanelButton ${context.state.experimentalFlag === true ? 'background-green' : 'background-gray'}`} value= "true" 
                onClick={context.setExperimentalFlag}>  Experimental</button>    
            </OverlayTrigger>            
        </div>
    )}
    </AppContext.Consumer>
    )
    }
        
}



  export default PlayerChoice