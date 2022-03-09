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
            roomCode: "mooo"
        }

        this.handleJoinCodeChange = this.handleJoinCodeChange.bind(this);
        this.handleRoomButtonPressed = this.handleRoomButtonPressed.bind(this);
    };

    handleJoinCodeChange(e){

        this.setState({roomCode: e.target.value}, function () {
            console.log(this.state.roomCode);
        });
        
    };

    handleRoomButtonPressed(){
                
        fetch("/api/get-room" + "?code=" + this.state.roomCode).then((response)=>response.json()).then((data)=>{
            console.log(data)
            this.props.navigate("/room/" + data.code)
        });
    };

    render(){
        return(<Grid container>

            <Grid container alignItems="center" justifyContent="center">
                <Grid item>
                    <Typography component="h4" variant="h4">
                        Join A Room 
                    </Typography>
                </Grid>

            </Grid>

            <Grid container alignItems="center" justifyContent="flex-start" direction="column"> 

                <Grid item>
                    <FormControl>
                        <TextField 
                            required={true}
                            type="text"
                            inputProps={{
                                style: {textAlign:"center"}
                            }}
                            onChange={this.handleJoinCodeChange}
                        />
                        <FormHelperText component= "div">
                            <div align="center">
                                    Enter the join code
                            </div>
                        </FormHelperText>
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
