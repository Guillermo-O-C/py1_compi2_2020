import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import CssBaseline from '@material-ui/core/CssBaseline';
import Fab from '@material-ui/core/Fab';
import Tooltip from '@material-ui/core/Tooltip';
import TranslateIcon from '@material-ui/icons/Translate';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import TableChartIcon from '@material-ui/icons/TableChart';
import WebIcon from '@material-ui/icons/Web';
import WarningIcon from '@material-ui/icons/Warning';
import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline';
import {UnControlled as CodeMirror} from 'react-codemirror2'
import 'codemirror/mode/javascript/javascript';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/mbo.css';
import 'codemirror/theme/cobalt.css';
import parser from '../backend/gramatica';

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
    bottom: theme.spacing(55),
    right: theme.spacing(50),
  },absolute2: {
    position: 'absolute',
    bottom: theme.spacing(50),
    right: theme.spacing(45),
  },
  absolute3: {
    position: 'absolute',
    bottom: theme.spacing(45),
    right: theme.spacing(40),
  },absolute4: {
    position: 'absolute',
    bottom: theme.spacing(40),
    right: theme.spacing(35),
  },
  absolute5: {
    position: 'absolute',
    bottom: theme.spacing(35),
    right: theme.spacing(30),
  },absolute6: {
    position: 'absolute',
    bottom: theme.spacing(30),
    right: theme.spacing(25),
  }
}));
export default function UI() {
  let entrada;
  function analizar(entry) {
    let AST;
    try {
        AST = parser.parse(entry);
        console.log(JSON.stringify(AST, null, 2));
        return AST;
    } catch (error) {
        console.log(error);
        return error;
    }
  } 
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <Grid container spacing={2}>
        <Grid item xs={6}>
         <CssBaseline />
          <Paper className={classes.paper}>IDE </Paper>
          <CodeMirror value=''
              options={{
                  mode: 'javascript',
                  theme: 'mbo',
                  lineNumbers: true
              }}
              onChange={(editor, data, value) => {entrada=value}}
          />
        </Grid>
        <Grid item xs={6}>
          <Paper className={classes.paper}>Traducción

          </Paper>
          <CodeMirror  className={classes.cdm} 
            value='var a =3;'
            options={{
                mode: 'javascript',
                theme: 'cobalt',
                lineNumbers: true,
                readOnly: true
            }}
            onChange={(editor, data, value) => {
            }}
        />
        </Grid>
        </Grid>
      <Grid container spacing={1}>
          <Grid item xs={6}>
            <Paper className={classes.paper}>CONSOLA</Paper>
            <textarea disabled id="original" name="original" style={{width:"100%", height:"50vh", resize: "none", backgroundColor:"#0f4c75"}} ></textarea>

          </Grid> 
            <Grid>
        <Tooltip title="Ejecutar" aria-label="add" >
        <Fab color="secondary" className={classes.absolute} onClick={()=>{analizar(entrada)}}>
            <PlayArrowIcon/>
        </Fab>
        </Tooltip>
        <Tooltip title="Traducir" aria-label="add">
        <Fab color="secondary" className={classes.absolute2}>
            <TranslateIcon/>
          </Fab>
        </Tooltip>
        <Tooltip title="Tabla de Símbolos de Traudcción" aria-label="add">
        <Fab color="secondary" className={classes.absolute3}>
            <TableChartIcon/>
          </Fab>
        </Tooltip>
        <Tooltip title="Errores de Traducción" aria-label="add">
        <Fab color="secondary" className={classes.absolute4}>
            <WarningIcon/>
          </Fab>
        </Tooltip>
        <Tooltip title="Tabla de Símbolos de Ejecución" aria-label="add">
        <Fab color="secondary" className={classes.absolute5}>
            <WebIcon/>
          </Fab>
        </Tooltip>
        <Tooltip title="Errores de Ejecución" aria-label="add">
        <Fab color="secondary" className={classes.absolute6}>
            <ErrorOutlineIcon/>
          </Fab>
        </Tooltip>
        </Grid>
      </Grid>
    </div>
  );
}

