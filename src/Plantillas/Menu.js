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
import AccountTreeIcon from '@material-ui/icons/AccountTree';
import Ejecutar from '../backend/Interprete';
import { TIPO_DATO } from '../backend/instrucciones';
const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(1),
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
  p:{
    backgroundColor:'#2c2c2c',
    color:'#FFFF',
    marginTop:'0%',
  }
}));
const reports = {tsTr:[], erTr:[], tsEj:[], erEj:[]};
const intros = {AST:[], entrada:"", salida:""};
const tablero = document.createElement("div");
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});
export default function UI() {
  function analizar(entry) {
    document.getElementById('consola').value="";
    let AST;
    try {
        AST = parser.parse(entry);
        console.log(JSON.stringify(AST, null, 2));
        document.getElementById('consola').value=JSON.stringify(AST, null, 2);
        intros.AST=AST;
        return AST;
    } catch (error) {
        console.log(error);
        return error;
    }
  } 
  function Translate(){
    Traducir(analizar(intros.entrada), document.getElementById('consola'), intros.salida, reports);
  }
  function Interpretar(){
    tablero.innerHTML=document.createElement("div").innerHTML;
    Ejecutar(analizar(intros.entrada), document.getElementById('consola'), intros.salida, reports,  tablero);
   }
  function translationConsole(editor){
    intros.salida=editor;
  }
  function CursosLocation(editor){
    document.getElementById('posicion').innerHTML="Línea:"+(editor.getCursor().line+1)+" Columna:"+editor.getCursor().ch;
  }
  function EntryValue(value){
    intros.entrada=value;
  }
  function populateTableTsTr(tablaDeSimbolos){
      var row0 =  document.getElementById('tablaDeSalida').insertRow( document.getElementById('tablaDeSalida').rows.length);
      var celda01 = row0.insertCell(0);
      var celda02 = row0.insertCell(1);
      var celda03 = row0.insertCell(2);
      var celda05 = row0.insertCell(3);
      var celda06 = row0.insertCell(4);
      var celda07 = row0.insertCell(5);
      celda01.innerHTML = "No.";
      celda01.bgColor="#40a8c4";
      celda02.innerHTML = "Sentencia";
      celda02.bgColor="#40a8c4";
      celda03.innerHTML = "ID";
      celda03.bgColor="#40a8c4";
      celda05.innerHTML = "Fila";
      celda05.bgColor="#40a8c4";
      celda06.innerHTML = "Columna";
      celda06.bgColor="#40a8c4";
      celda07.innerHTML = "Ambito";
      celda07.bgColor="#40a8c4";
    if(tablaDeSimbolos.length!=0){
      let i=1;
      for(let simbolo of tablaDeSimbolos._simbolos) {
      i++;
      if(simbolo.si!="type"){
        var row =  document.getElementById('tablaDeSalida').insertRow( document.getElementById('tablaDeSalida').rows.length);
        var celda1 = row.insertCell(0);
        var celda2 = row.insertCell(1);
        var celda3 = row.insertCell(2);
        var celda5 = row.insertCell(3);
        var celda6 = row.insertCell(4);
        var celda7 = row.insertCell(5);
        celda1.innerHTML = i;
        celda2.innerHTML = simbolo.si;
        celda3.innerHTML = simbolo.id;
        celda5.innerHTML = simbolo.fila;
        celda6.innerHTML = simbolo.columna;
        celda7.innerHTML = simbolo.ambito;
      }else{
        var row =  document.getElementById('tablaDeSalida').insertRow( document.getElementById('tablaDeSalida').rows.length);
        var celda1 = row.insertCell(0);
        var celda2 = row.insertCell(1);
        var celda3 = row.insertCell(2);
        var celda4 = row.insertCell(3);
        var celda6 = row.insertCell(4);
        var celda7 = row.insertCell(5);
        celda1.innerHTML = i;
        celda2.innerHTML = simbolo.si;
        celda3.innerHTML = simbolo.id;
        celda5.innerHTML = simbolo.fila;
        celda6.innerHTML = simbolo.columna;
      }
      }
    }
  } 
  function populateTableErTr(Errores_Array){    
    if(Errores_Array.length!=0){
      var row0 =  document.getElementById('tablaDeSalida').insertRow( document.getElementById('tablaDeSalida').rows.length);
      var celda01 = row0.insertCell(0);
      var celda02 = row0.insertCell(1);
      var celda03 = row0.insertCell(2);
      var celda04 = row0.insertCell(3);
      var celda05 = row0.insertCell(4);
      var celda06 = row0.insertCell(5);
      celda01.innerHTML = "No.";
      celda02.innerHTML = "Tipo";
      celda03.innerHTML = "Fila";
      celda04.innerHTML = "Columna";
      celda05.innerHTML = "Símbolo/Descripcion";
      celda06.innerHTML = "Ambito";
      let i=1;  
      for(let err of Errores_Array){
        var row =  document.getElementById('tablaDeSalida').insertRow( document.getElementById('tablaDeSalida').rows.length);
        var celda1 = row.insertCell(0);
        var celda2 = row.insertCell(1);
        var celda3 = row.insertCell(2);
        var celda4 = row.insertCell(3);
        var celda5 = row.insertCell(4);
        celda1.innerHTML = i;
        celda2.innerHTML = err.tipo;
        celda3.innerHTML = err.linea;
        celda4.innerHTML = err.columna;
        celda5.innerHTML = err.descripcion;
        i++;
      }
    }
  }  
  function populateTableTsEj(tablaDeSimbolos){
    let tabla = document.createElement("table");
    tabla.bgColor= '#bbe1fa';
    tabla.align="center";
    tabla.width="80%";
    tabla.border="1px solid black";
    {/*"width'80%' style= border='1' align='center'";*/}
    var row0 =  tabla.insertRow( tabla.rows.length);
    var celda01 = row0.insertCell(0);
    var celda02 = row0.insertCell(1);
    var celda03 = row0.insertCell(2);
    var celda04 = row0.insertCell(3);
    var celda06 = row0.insertCell(4);
    var celda07 = row0.insertCell(5);
    var celda08 = row0.insertCell(6);
    celda01.innerHTML = "No.";
    celda01.bgColor="#40a8c4";
    celda02.innerHTML = "Sentencia";
    celda02.bgColor="#40a8c4";
    celda03.innerHTML = "ID";
    celda03.bgColor="#40a8c4";
    celda04.innerHTML = "Tipo";
    celda04.bgColor="#40a8c4";
    celda06.innerHTML = "Fila";
    celda06.bgColor="#40a8c4";
    celda07.innerHTML = "Columna";
    celda07.bgColor="#40a8c4";
    celda08.innerHTML = "Ambito";
    celda08.bgColor="#40a8c4";
  if(tablaDeSimbolos.length!=0){
    let i=0;
    for(let simbolo of tablaDeSimbolos._simbolos) {
    i++;
    if(simbolo.si=="variable"){
      var row = tabla.insertRow( tabla.rows.length);
      var celda1 = row.insertCell(0);
      var celda2 = row.insertCell(1);
      var celda3 = row.insertCell(2);
      var celda4 = row.insertCell(3);
      var celda6 = row.insertCell(4);
      var celda7 = row.insertCell(5);
      var celda8 = row.insertCell(6);
      celda1.innerHTML = i;
      celda2.innerHTML = simbolo.si;
      celda3.innerHTML = simbolo.id;
      celda4.innerHTML = simbolo.tipo;
      celda6.innerHTML = simbolo.fila;
      celda7.innerHTML = simbolo.columna;
      celda8.innerHTML = simbolo.ambito;
    }else if(simbolo.si=="funcion"){
      var row =  tabla.insertRow( tabla.rows.length);
      var celda1 = row.insertCell(0);
      var celda2 = row.insertCell(1);
      var celda3 = row.insertCell(2);
      var celda4 = row.insertCell(3);
      var celda6 = row.insertCell(4);
      var celda7 = row.insertCell(5);
      var celda8 = row.insertCell(6);
      celda1.innerHTML = i;
      celda2.innerHTML = simbolo.si;
      celda3.innerHTML = simbolo.id;
      celda4.innerHTML = simbolo.tipo;
      celda6.innerHTML = simbolo.fila;
      celda7.innerHTML = simbolo.columna;
      celda8.innerHTML = simbolo.ambito;
    }else{
      var row =  tabla.insertRow( tabla.rows.length);
      var celda1 = row.insertCell(0);
      var celda2 = row.insertCell(1);
      var celda3 = row.insertCell(2);
      var celda4 = row.insertCell(3);
      var celda5 = row.insertCell(4);
      var celda6 = row.insertCell(5);
      var celda7 = row.insertCell(6);
      celda1.innerHTML = i;
      celda2.innerHTML = simbolo.si;
      celda3.innerHTML = simbolo.id;
      celda5.innerHTML = simbolo.fila;
      celda6.innerHTML = simbolo.columna;
    }
    }
  }
  return tabla;
}
  function populateTableErEj(Errores_Array){    
    if(Errores_Array.length!=0){
      var row0 =  document.getElementById('tablaDeSalida').insertRow( document.getElementById('tablaDeSalida').rows.length);
      var celda01 = row0.insertCell(0);
      var celda02 = row0.insertCell(1);
      var celda03 = row0.insertCell(2);
      var celda04 = row0.insertCell(3);
      var celda05 = row0.insertCell(4);
      var celda06 = row0.insertCell(5);
      celda01.innerHTML = "No.";
      celda02.innerHTML = "Tipo";
      celda03.innerHTML = "Fila";
      celda04.innerHTML = "Columna";
      celda05.innerHTML = "Descripcion";
      celda06.innerHTML = "Ambito";
      let i=1;
      for(let err of Errores_Array){
        var row =  document.getElementById('tablaDeSalida').insertRow( document.getElementById('tablaDeSalida').rows.length);
        var celda1 = row.insertCell(0);
        var celda2 = row.insertCell(1);
        var celda3 = row.insertCell(2);
        var celda4 = row.insertCell(3);
        var celda5 = row.insertCell(4);
        celda1.innerHTML = i;
        celda2.innerHTML = err.tipo;
        celda3.innerHTML = err.linea;
        celda4.innerHTML = err.columna;
        celda5.innerHTML = err.descripción;
        i++;
      }
    }
  }
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  /* antigua funcion
  const handleClickOpen = () => {
    setOpen(true);
    populateTable(reports.tsTr);
   };*/
   async function handleClickOpenTsTr (){
    setOpen(true);
    await setTimeout(null, 300);
    populateTableTsTr(reports.tsTr);
   };
   async function handleClickOpenErTr (){
    setOpen(true);
    await setTimeout(null, 300);
    populateTableErTr(reports.erTr);
   };
   async function handleClickOpenTsEj (){
    setOpen(true);
    await setTimeout(null, 300);
    document.getElementById('tablero').innerHTML=tablero.innerHTML;
    document.getElementById('tablero').appendChild(populateTableTsEj(reports.tsEj));
   };
   async function handleClickOpenErEj (){
    setOpen(true);
    await setTimeout(null, 300);
    populateTableErEj(reports.erEj);
   };
   async function handleClickOpenAST (){
    setOpen(true);
    await setTimeout(null, 300);
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
              onChange={(editor, data, value) => {EntryValue(value)}}
              onCursorActivity={(editor, data, value)=>{CursosLocation(editor)}}
          />
          <p id="posicion" className={classes.p}>Línea:- Columna:-</p>
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
          onClick={()=>{Interpretar(intros.entrada)}}
        >
          Ejecutar
        </Button>
        <Button
              variant="contained"
              color="primary"
              size="large"
              className={classes.button}
              startIcon={<WebIcon />}
              onClick={handleClickOpenTsEj}
            >
              Tabla de símbolos de ejecución
            </Button>
            <Button
              variant="contained"
              color="primary"
              size="large"
              className={classes.button}
              startIcon={<ErrorOutlineIcon />}
              onClick={handleClickOpenErEj}
            >
              Errores de ejecución
            </Button>
            <Button
              variant="contained"
              color="primary"
              size="large"
              className={classes.button}
              startIcon={<AccountTreeIcon />}
              onClick={()=>{handleClickOpenAST()}}
            >
              AST
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
          onClick={handleClickOpenTsTr}
        >
          Tabla de Símbolos de traducción
        </Button>
              <Button
              variant="contained"
              color="primary"
              size="large"
              className={classes.button}
              startIcon={<WarningIcon />}
              onClick={handleClickOpenErTr}
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
              Tabla de Símbolos
            </Typography>
          </Toolbar>
        </AppBar>
        <div id="AST_FRAME"></div>
        <div id="tablero"></div>
       <table id="tablaDeSalida" width="80%" style={{background:'#bbe1fa'}} border='1' align='center'> 
       </table>
      </Dialog>
     {/*  <Dialog fullScreen open={open} onClose={handleClose} TransitionComponent={Transition}>
        <AppBar className={classes.appBar}>
          <Toolbar>
            <IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close">
              <CloseIcon />
            </IconButton>
            <Typography variant="h6" className={classes.title}>
              AST
            </Typography>
          </Toolbar>
        </AppBar>

   //aca tiene que ir la etiqueta que tenga el grafo :p
      </Dialog> */}
    </div>
  );
}

