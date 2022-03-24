import React, {Component} from "react";
import { useParams } from 'react-router-dom';
import { Grid, Button, Typography } from "@material-ui/core";
import { useNavigate } from "react-router-dom";
import CreateRoomPage from "./CreateRoomPage";
import MusicPlayer from "./MusicPlayer";

function withParams(Component) {
    return props => <Component {...props} params={useParams()} navigate={useNavigate()}/>;
  }

class Room extends Component{
    
    constructor(props){
        super(props)
        this.state = {
            votesToSkip: 2,
            guestCanPause: false,
            isHost: false,
            showSettings: false,
            spotifyAuthenticated: false,
            song: {},
        }
        this.roomCode = this.props.params.roomCode;
        this.leaveButtonPressed = this.leaveButtonPressed.bind(this);
        this.updateShowSettings = this.updateShowSettings.bind(this);
        this.renderSettingsButton = this.renderSettingsButton.bind(this);
        this.getRoomDetails = this.getRoomDetails.bind(this);
        this.authenticateSpotify = this.authenticateSpotify.bind(this);
        this.getCurrentSong = this.getCurrentSong.bind(this);
        this.getRoomDetails();
       
        
    }

    componentDidMount(){
        this.interval = setInterval(this.getCurrentSong, 1000)
    }

    componentWillUnmount(){
        clearInterval(this.interval)
    }

    authenticateSpotify(){
        fetch("/spotify/is-authenticated").then((response) => response.json())
        .then((data) => {
            this.setState({
                spotifyAuthenticated: data.status
            })
            if(!data.status){
                fetch("/spotify/get-auth-url").then((response) => response.json()).then((data)=> window.location.replace(data.url));
            }
        });
    }

    getCurrentSong(){

        fetch("/spotify/current-song").then((response) => response.json()).then((data)=>{
            this.setState({
                song: data
            });
            console.log(this.state.song.is_playing);
        });
    }

    getRoomDetails(){
        fetch("/api/get-room" + "?code=" + this.roomCode).then((response)=>{

            if(!response.ok){
                this.props.leaveRoomCallback();
                this.props.navigate("/");
            }
            else return response.json();
        
        }).then((data)=>{
           
            this.setState({

                votesToSkip: data.votes_to_skip,
                guestCanPause: data.guest_can_pause,
                isHost: data.is_host
            });
            if(this.state.isHost)
                this.authenticateSpotify();
        })
    }

    leaveButtonPressed(){
        const requestOptions = {
            method: "POST",
            headers: {"Content-Type":"application/json"},
        }
        
        fetch("/api/leave-room", requestOptions).then((response)=>{
            this.props.leaveRoomCallback();
            this.props.navigate("/");
        });  
    };

    updateShowSettings(value){
        this.setState({
            showSettings: value,
        });
    }

    renderSettingsButton(){
        
        return(<Grid item xs={12} align="center">
                    <Button
                    variant="outlined"
                    color="primary"
                    onClick={() => this.updateShowSettings(true)}>
                        Settings
                    </Button>
                </Grid>)
    }

    renderSettings(){
        return(<Grid container spacing={1}>

            <Grid item xs={12} align="center">
                <CreateRoomPage
                    update={true}
                    votesToSkip={this.state.votesToSkip}
                    guestCanPause={this.state.guestCanPause}
                    roomCode={this.roomCode}
                    updateCallback={this.getRoomDetails}
                />
            </Grid>
            <Grid item xs={12} align="center">
                <Button
                 variant="outlined"
                 color="secondary"
                 onClick={()=>this.updateShowSettings(false)}
                >
                    Close
                </Button>
            </Grid>
        </Grid>
        )
    }

    render(){
         
            if(this.state.showSettings)
                return this.renderSettings();
    
            return(<Grid container spacing={1}>
                <Grid item xs={12} align="center">
                    <Typography variant="h4" component="h4">
                        Code: {this.roomCode}
                    </Typography>
                </Grid>
                <MusicPlayer {...this.state.song}/>
                {this.state.isHost ? this.renderSettingsButton() : null}
                <Grid item xs={12} align="center">
                    <Button
                    variant="outlined"
                    color="secondary"
                    onClick={this.leaveButtonPressed}>
                        Leave Room
                    </Button>
                </Grid>
            </Grid>
        
    )};

}

export default withParams(Room);

