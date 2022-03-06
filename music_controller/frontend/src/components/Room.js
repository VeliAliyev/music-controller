import React, {Component} from "react";
import { useParams } from 'react-router-dom';

function withParams(Component) {
    return props => <Component {...props} params={useParams()} />;
  }

class Room extends Component{
    
    constructor(props){
        super(props)
        this.state = {
            votesToSkip: 2,
            guestCanPause: false,
            isHost: false
        }
        this.roomCode = this.props.params.roomCode;
        this.getRoomDetails();
    }

    getRoomDetails(){
        fetch("/api/get-room" + "?code=" + this.roomCode).then((response)=>response.json()).then((data)=>{
           
            this.setState({

                votesToSkip: data.votes_to_skip,
                guestCanPause: data.guest_can_pause,
                isHost: data.is_host
            });
        })
    }

    render(){
        
        return <div>
            <h1>Room Code: {this.roomCode}</h1>
            <p>Votes: {this.state.votesToSkip}</p>
            <p>Can Guests Pause?: {this.state.guestCanPause ? "yes" : "no"}</p>
            <p>Host: {this.state.isHost ? "yes" : "no" }</p>
        </div>
    }

}

export default withParams(Room);