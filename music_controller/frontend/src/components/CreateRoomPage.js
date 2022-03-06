import React, {Component} from "react";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormControl from "@material-ui/core/FormControl";
import {Link} from "react-router-dom";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import { FormLabel } from "@material-ui/core";


export default class CreateRoomPage extends Component{
    
    defaultVotes=2;
    
    constructor(props){
        super(props);
        this.state = {
            guestCanPause: true,
            votesToSkip: this.defaultVotes,
        };
        this.handleVotesChange = this.handleVotesChange.bind(this);
        this.handleGuestCanPauseChange = this.handleGuestCanPauseChange.bind(this);
        this.handleRoomButtonPressed = this.handleRoomButtonPressed.bind(this);
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

        fetch("/api/create", requestOptions).then((response)=>response.json()).then((data)=> this.props.history.push("/room/" + data.code));
    }

    render(){
        return (
            <Grid container spacing={1} style={{border:"10px solid red"}} align="center">
                
                <Grid item xs={12}  style={{border:"5px solid blue"}} align="center">
                    <Typography component="h4" variant="h4">
                        Create A Room 
                    </Typography>
                </Grid>

                <Grid item xs={12}  style={{border:"5px solid green"}} align="center">
                    <FormControl component="fieldset" style={{border:"5px solid red"}}>
                        <FormHelperText component= "div" style={{border:"5px solid green"}}>
                           <div align="center"> Guest Control of Playback State</div>
                        </FormHelperText>
                        <RadioGroup row defaultValue="true" onChange={this.handleGuestCanPauseChange}>
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
                            defaultValue={this.defaultVotes}
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
                
                <Grid
                    spacing={1}
                    container
                    direction="row"
                    alignItems="center"
                    justifyContent="center">
                
                    <Grid item align="right">
                        <Button  color="secondary" variant="outlined" onClick={this.handleRoomButtonPressed}>
                                Create A Room
                        </Button>
                    </Grid>
                    <Grid item  align="left">
                        <Button   color="primary" variant="outlined" to="/" component={Link}>
                            Back
                        </Button>
                    </Grid>
                </Grid>
            </Grid>
        );
    }

}