import React from 'react';
import { Component } from "react";
import {
    Grid,
    Typography,
    Card,
    IconButton,
    LinearProgress,
    ButtonGroup,
} from "@material-ui/core";

import PlayArrowIcon from "@material-ui/icons/PlayArrow";
import PauseIcon from "@material-ui/icons/Pause";
import SkipNextIcon from "@material-ui/icons/SkipNext";
import SkipPreviousIcon from '@material-ui/icons/SkipPrevious';

export default class MusicPlayer extends Component {

    constructor(props){
        super(props);
        this.playPauseSong =  this.playPauseSong.bind(this);
    }

    playPauseSong(){
        
        const requestOptions={
            method: "PUT",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
               is_playing:this.props.is_playing
            })
        };
        fetch("/spotify/play-pause", requestOptions).then((response) => response.json());
    }

    skipNext(){
        const requestOptions={
            method: "PUT",
            headers: {"Content-Type": "application/json"},
        };
        fetch("/spotify/skip-next", requestOptions);
    }

    skipPrev(){
        const requestOptions={
            method: "PUT",
            headers: {"Content-Type": "application/json"},
        };
        fetch("/spotify/skip-prev", requestOptions);
    }

    render(){
       
        const songProgress = (this.props.time / this.props.duration) * 100;

        return(

            <Card>
                <Grid container alignItems="center">
                    <Grid item xs={4}>
                        <img src={this.props.image_url} height="100%" width="100%"/>
                    </Grid>
                    <Grid item xs={8} align="center">
                        <Typography component="h4" variant="h4">
                            {this.props.tite}
                        </Typography>
                        <Typography color="textSecondary" variant="h5" >
                            {this.props.artist}
                        </Typography>
                        
                        <Typography color="textSecondary" variant="h6">
                            {this.props.title}
                        </Typography>
                        
                        <ButtonGroup >
                            <IconButton onClick={ this.skipPrev}>
                                <SkipPreviousIcon/>
                            </IconButton>
                            <IconButton onClick={ this.playPauseSong} disabled={this.props.isHost || this.props.guestCanPause ? false : true}>
                                {this.props.is_playing ? <PauseIcon/> : <PlayArrowIcon/>}
                            </IconButton>
                            <IconButton onClick={ this.skipNext}>
                                <SkipNextIcon/>
                            </IconButton>
                        </ButtonGroup>
                        
                    </Grid>
                </Grid>
                <LinearProgress variant="determinate" value={songProgress}/>
            </Card>
        )
    }
}