var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
var competenciaController = require('./controladores/competenciaController');

var app = express();

app.use(cors());

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(bodyParser.json());

app.get('/competencias', competenciaController.getCompetencias);
app.get('/competencias/:id', competenciaController.getCompetencia);
app.get('/competencias/:id/peliculas', competenciaController.getPelis);
app.post('/competencias/:id/voto', competenciaController.postVoto);
app.get('/competencias/:id/resultados', competenciaController.getResultados);
app.post('/competencias/', competenciaController.postCompetencia);
app.delete('/competencias/:id/votos', competenciaController.deleteVotos);
app.delete('/competencias/:id', competenciaController.deleteCompetencia);
app.get('/generos', competenciaController.getGeneros);
app.get('/directores', competenciaController.getDirectores);
app.get('/actores', competenciaController.getActores);
app.put('/competencias/:id', competenciaController.putCompetencia);


//seteamos el puerto en el cual va a escuchar los pedidos la aplicación
var puerto = '8080';

app.listen(puerto, function () {
  console.log( "Escuchando en el puerto " + puerto );
});

