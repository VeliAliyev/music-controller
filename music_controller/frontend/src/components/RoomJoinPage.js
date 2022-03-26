import React, {Component} from "react";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormControl from "@material-ui/core/FormControl";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import { useNavigate } from "react-router-dom";
import {Link} from "react-router-dom";

function withRouter(Component) {    
    return props => <Component {...props} navigate={useNavigate()} />;
  }

class RoomJoinPage extends Component{
    constructor(props){
        super(props);
        this.state={
            roomCode: "",
            error: "",
        }

        this.handleJoinCodeChange = this.handleJoinCodeChange.bind(this);
        this.handleRoomButtonPressed = this.handleRoomButtonPressed.bind(this);
    };

    handleJoinCodeChange(e){
        this.setState({roomCode: e.target.value})
        
    };

    handleRoomButtonPressed(){
        
        const requestOptions={
            method: "POST",
            headers:{"Content-Type" : "application/json"},
            body: JSON.stringify({
                code: this.state.roomCode,
            })
        };
        
        fetch("/api/join", requestOptions).then((response)=>{

            if (response.ok){
                this.props.navigate("/room/"+this.state.roomCode);
            }
            else{
                this.setState({error:"Room not Found!"});
            }

        }).catch((error)=>{
            console.log(error);
        });
    };

    render(){
        return(<Grid container spacing={10}>

            <Grid container item alignItems="flex-end" justifyContent="center">
                <Grid item>
                    <Typography component="h4" variant="h4">
                        Join A Room 
                    </Typography>
                </Grid>

            </Grid>

            <Grid container alignItems="center" justifyContent="flex-start" direction="column" spacing={10}> 

                <Grid item>
                    <FormControl>
                        <TextField 
                            
                            label="Code"
                            placeholder="Enter a Room Code"
                            value={this.state.roomCode}
                            helperText={this.state.error}
                            variant="outlined"
                            required={true}
                            onChange={this.handleJoinCodeChange}
                        />
                    </FormControl>
                </Grid>

                <Grid container spacing={1} alignItems="center" justifyContent="center">
                    <Grid item>
                        <Button type="submit" color="primary" variant="outlined"  onClick={this.handleRoomButtonPressed}>
                            Submit
                        </Button>
                    
                    </Grid>
                    
                    <Grid item>
                        <Button type="submit" color="primary" variant="outlined" to="/" component={Link}>
                            Back
                        </Button>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>);
    }

}
export default withRouter(RoomJoinPage);
