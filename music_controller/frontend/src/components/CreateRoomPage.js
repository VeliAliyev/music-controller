import React, {Component} from "react";
import {Link} from "react-router-dom";
import {
    Button, Grid, Typography, TextField, 
    FormHelperText, FormControl, Collapse, 
    Radio, RadioGroup, FormControlLabel 
} from "@material-ui/core";
import { useNavigate } from "react-router-dom";
import { Alert } from "@material-ui/lab"


function withRouter(Component) {    
    return props => <Component {...props} navigate={useNavigate()} />;
  }

class CreateRoomPage extends Component{
    
    static defaultProps = {
        votesToSkip: 2,
        guestCanPause: true,
        update: false,
        roomCode: null,
        updateCallback: () => {},
    }
    
    constructor(props){
        super(props);
        this.state = {
            guestCanPause: this.props.guestCanPause,
            votesToSkip: this.props.votesToSkip,
            errorMsg: "",
            successMsg: "",
        };
        this.handleVotesChange = this.handleVotesChange.bind(this);
        this.handleGuestCanPauseChange = this.handleGuestCanPauseChange.bind(this);
        this.handleRoomButtonPressed = this.handleRoomButtonPressed.bind(this);
        this.handleUpdateButtonPressed = this.handleUpdateButtonPressed.bind(this);
    }

    handleVotesChange(e){
        this.setState({
            votesToSkip: e.target.value,
        })
    }

    handleGuestCanPauseChange(e){
        this.setState({
            guestCanPause: e.target.value === "true" ? true : false,
        })
    }

    handleRoomButtonPressed(){
        const requestOptions = {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                votes_to_skip: this.state.votesToSkip,
                guest_can_pause: this.state.guestCanPause
            })
        };

        fetch("/api/create", requestOptions).then((response)=>response.json()).then((data)=> this.props.navigate("/room/" + data.code));
    }

    handleUpdateButtonPressed(){
        const requestOptions = {
            method: "PATCH",
            headers: {"Content-Type":"application/json"},
            body: JSON.stringify({
                votes_to_skip: this.state.votesToSkip,
                guest_can_pause: this.state.guestCanPause,
                code: this.props.roomCode,
            }),
        }
        
        fetch("/api/update-room", requestOptions).then((response) => {
            if(response.ok){
                this.setState({
                    successMsg: "Room updated successfully!",
                });
            }else{

                this.setState({
                    errorMsg: "Error..."
                })
            }
            this.props.updateCallback();
        })

    };

    renderCreateButton(){
        return(
            <Grid container spacing={1}>
                <Grid item xs={12} align="center">
                    <Button color="primary" variant="outlined" onClick={this.handleRoomButtonPressed}>
                        Create a Room
                    </Button>
                </Grid>
                <Grid item xs={12} align="center">
                    <Button color="primary" variant="outlined" to="/" component={Link}>
                        Back
                    </Button>
                </Grid>
            </Grid>
        )
    };

    renderUpdateButton(){
        return(
            <Grid container spacing={1}>
                <Grid item xs={12} align="center">
                    <Button color="primary" variant="outlined" onClick={this.handleUpdateButtonPressed}>
                        Update the Room
                    </Button>
                </Grid>
            </Grid>
        )
    };

    render(){

        const title = this.props.update ? "Update the Room" : "Create a Room";

        return (<Grid container spacing={1} align="center">
                
                <Grid item xs={12}   align="center">
                    <Collapse in={this.state.errorMsg != "" || this.state.successMsg != "" }>
                        {
                            this.state.successMsg != "" ? 
                            (<Alert severity="success" onClose={() => {this.setState({ successMsg: "" });}}>
                                {this.state.successMsg}
                            </Alert>):
                            (<Alert severity="error" onClose={() => {this.setState({ errorMsg: "" });}}>
                                {this.state.errorMsg}
                            </Alert>)
                        }
                    </Collapse>
                </Grid>

                <Grid item xs={12}   align="center">
                    <Typography component="h4" variant="h4">
                        {title}
                    </Typography>
                </Grid>

                <Grid item xs={12}   align="center">
                    <FormControl component="fieldset" >
                        <FormHelperText component= "div">
                           <div align="center"> Guest Control of Playback State</div>
                        </FormHelperText>
                        <RadioGroup row defaultValue={this.state.guestCanPause.toString()} onChange={this.handleGuestCanPauseChange}>
                            <FormControlLabel value="true" control={<Radio color="primary"/>} label="Play/Pause" labelPlacement="bottom"/>
                            <FormControlLabel value="false" control={<Radio color="primary"/>} label="No control" labelPlacement="bottom"/>  
                        </RadioGroup>
                    </FormControl>
                </Grid>
                
                <Grid item xs={12} align="center">
                    <FormControl>
                        <TextField 
                            required={true}
                            type="number"
                            defaultValue={this.state.votesToSkip}
                            inputProps={{
                                min: 1,
                                style: {textAlign:"center"}
                            }}
                            onChange={this.handleVotesChange}
                        />
                        <FormHelperText component= "div">
                            <div align="center">
                                    Votes Required To Skip Song
                            </div>
                        </FormHelperText>
                    </FormControl>
                </Grid>
                {this.props.update?this.renderUpdateButton():this.renderCreateButton()}
                
            </Grid>
        );
    }

}
export default withRouter(CreateRoomPage);