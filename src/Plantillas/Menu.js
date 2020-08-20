import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import Button from '@material-ui/core/Button';
import Fab from '@material-ui/core/Fab';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import TranslateIcon from '@material-ui/icons/Translate';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import {UnControlled as CodeMirror} from 'react-codemirror2'
import 'codemirror/mode/javascript/javascript';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/yonce.css';


const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
  absolute: {
    position: 'absolute',
    top: theme.spacing(0),
    right: '60%',
  },absolute2: {
    position: 'absolute',
    top: theme.spacing(0),
    right: '55%',
  }
}));

export default function AutoGrid() {
  const classes = useStyles();

  return (
    <div className={classes.root} style={{backgroundColor:'#1b262c'}}>
      <Grid container spacing={2}>
        <Grid item xs alignItems="stretch" >
         <CssBaseline />
          <Paper className={classes.paper}>IDE </Paper>
       {/* <textarea style={{ backgroundColor: '#cfe8fc', height: '50vh', width: '100%', resize: 'none'}} /> */}
        <CodeMirror  value=''
            options={{
                mode: 'javascript',
                theme: 'yonce',
                lineNumbers: true
            }}
            onChange={(editor, data, value) => {
            }}
        /> 
        </Grid>
        <Grid item xs> 
          <Paper className={classes.paper}>Traducción 
         
          </Paper>
          <textarea disabled id="original" name="original" style={{width:"100%", height:"50vh", resize: "none"}} onkeydown="if(event.keyCode===9){var v=this.value,s=this.selectionStart,e=this.selectionEnd;this.value=v.substring(0, s)+'\t'+v.substring(e);this.selectionStart=this.selectionEnd=s+1;return false;}"></textarea>
          
        </Grid>
        
      </Grid>
      <Grid container spacing={2}>
        <Grid item xs>
          <Paper className={classes.paper}>CONSOLA</Paper>
          <textarea disabled id="original" name="original" style={{width:"100%", height:"35vh", resize: "none"}} onkeydown="if(event.keyCode===9){var v=this.value,s=this.selectionStart,e=this.selectionEnd;this.value=v.substring(0, s)+'\t'+v.substring(e);this.selectionStart=this.selectionEnd=s+1;return false;}"></textarea>

        </Grid> 
        <Grid item xs>
          <Paper className={classes.paper}>Tabla de Símbolos</Paper>
        </Grid>
       
      </Grid>
      <Tooltip title="Add" aria-label="add">
      <Fab color="secondary" className={classes.absolute}>
          <PlayArrowIcon/>
        </Fab>
        
      </Tooltip>
      <Tooltip title="Add" aria-label="add">
      <Fab color="secondary" className={classes.absolute2}>
          <TranslateIcon/>
        </Fab>
        
      </Tooltip>
    </div>
    
  );
}
