import React from 'react';
import { Component } from "react";
import {
    Grid,
    Typography,
    Card,
    IconButton,
    LinearProgress,
} from "@material-ui/core";

import PlayArrowIcon from "@material-ui/icons/PlayArrow";
import PauseIcon from "@material-ui/icons/Pause";
import SkipNextIcon from "@material-ui/icons/SkipNext";

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

    render(){

        const songProgress = (this.props.time / this.props.duration) * 100;

        return(

            <Card>
                <Grid container alignItems="center">
                    <Grid item xs={4}>
                        <img src={this.props.image_url} height="100%" width="100%"/>
                    </Grid>
                    <Grid item xs={8}>
                        <Typography component="h5" variant="h5">
                            {this.props.tite}
                        </Typography>
                        <Typography color="textSecondary" variant="subtitle1">
                            {this.props.artist}
                        </Typography>
                        <div>
                            <IconButton onClick={ this.playPauseSong}>
                                {this.props.is_playing ? <PauseIcon/> : <PlayArrowIcon/>}
                            </IconButton>
                            <IconButton>
                                <SkipNextIcon/>
                            </IconButton>
                        </div>
                    </Grid>
                </Grid>
                <LinearProgress variant="determinate" value={songProgress}/>
            </Card>
        )
    }
}