import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import CssBaseline from '@material-ui/core/CssBaseline';
import Button from '@material-ui/core/Button';
import TranslateIcon from '@material-ui/icons/Translate';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import TableChartIcon from '@material-ui/icons/TableChart';
import WebIcon from '@material-ui/icons/Web';
import WarningIcon from '@material-ui/icons/Warning';
import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline';
import Icon from '@material-ui/core/Icon';
import {UnControlled as CodeMirror} from 'react-codemirror2'
import 'codemirror/mode/javascript/javascript';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/mbo.css';
import 'codemirror/theme/cobalt.css';
import parser from '../backend/gramatica';
import Dialog from '@material-ui/core/Dialog';
import ListItemText from '@material-ui/core/ListItemText';
import ListItem from '@material-ui/core/ListItem';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import Slide from '@material-ui/core/Slide';
import Traducir from '../backend/Traductor';
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
  }, appBar: {
    position: 'relative',
  },
  title: {
    marginLeft: theme.spacing(2),
    flex: 1,
  },button: {
    margin: theme.spacing(1),
  },
}));
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});
export default function UI() {
  let entrada;
  let salida;
  function analizar(entry) {
    document.getElementById('consola').value="";
    let AST;
    try {
        AST = parser.parse(entry);
        console.log(JSON.stringify(AST, null, 2));
        document.getElementById('consola').value=JSON.stringify(AST, null, 2);
        return AST;
    } catch (error) {
        console.log(error);
        return error;
    }
  } 
  function Translate(){
    Traducir(analizar(entrada), document.getElementById('consola'), salida);
  }
  function translationConsole(editor){
    salida=editor;
  }
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const handleClickOpen = () => {
    setOpen(true);
   };
  const handleClose = () => {
    setOpen(false);
   };

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
            value=''
            options={{
                mode: 'javascript',
                theme: 'cobalt',
                lineNumbers: true,
                readOnly: true,
                indentAutoShift:true
            }}
            onChange={(editor, data, value) => {            }}
            editorDidMount={(editor)=>translationConsole(editor)}
        />
        </Grid>
        </Grid>
      <Grid container spacing={2}>
          <Grid item xs={6}>
            <Paper className={classes.paper}>CONSOLA</Paper>
            <textarea disabled id="consola" style={{width:"100%", height:"50vh", resize: "none", backgroundColor:"#0f4c75", color:"#ffff"}} ></textarea>

          </Grid> 
          <Grid item xs={6}>
              <div style={{height:'30%', marginTop:'10%', float:'inline-start', alignContent:'stretch'}}><Button
          variant="contained"
          color="secondary"
          className={classes.button}
          startIcon={<PlayArrowIcon />}
          onClick={()=>{analizar(entrada)}}
        >
          Ejecutar
        </Button>
        <Button
              variant="contained"
              color="primary"
              size="large"
              className={classes.button}
              startIcon={<WebIcon />}
              onClick={handleClickOpen}
            >
              Tabla de símbolos de ejecución
            </Button>
            <Button
              variant="contained"
              color="primary"
              size="large"
              className={classes.button}
              startIcon={<ErrorOutlineIcon />}
            >
              Errores de ejecución
            </Button>
        </div>
              <div>
              <Button
          variant="contained"
          color="secondary"
          size="large"
          className={classes.button}
          startIcon={<TranslateIcon/>}
          onClick={()=>{Translate()}}
        >
          Traducir Programa
        </Button>
        <Button
          variant="contained"
          color="primary"
          size="large"
          className={classes.button}
          startIcon={<TableChartIcon />}
        >
          Tabla de Símbolos de traducción
        </Button>
              <Button
              variant="contained"
              color="primary"
              size="large"
              className={classes.button}
              startIcon={<WarningIcon />}
            >
              Errores de Traducción
            </Button>
            
            </div>
       </Grid>
      </Grid>
      <Dialog fullScreen open={open} onClose={handleClose} TransitionComponent={Transition}>
        <AppBar className={classes.appBar}>
          <Toolbar>
            <IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close">
              <CloseIcon />
            </IconButton>
            <Typography variant="h6" className={classes.title}>
              Sound
            </Typography>
          </Toolbar>
        </AppBar>
        <List>
          <ListItem button>
            <ListItemText primary="Phone ringtone" secondary="Titania" />
          </ListItem>
          <Divider />
          <ListItem button>
            <ListItemText primary="Default notification ringtone" secondary="Tethys" />
          </ListItem>
        </List>
      </Dialog>
    </div>
  );
}

