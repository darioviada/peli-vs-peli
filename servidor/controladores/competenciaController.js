var connection = require('../lib/conexionbd');

function getCompetencias(req, res) {
  let sql = 'SELECT * FROM competencia';

  connection.query(sql, function (error, resultado, fields) {
    if (error) {
      console.log("Ha ocurrido un error en la consulta", error.message);
      return res.status(404).send("Ha ocurrido un error en la consulta");
    }
    if (resultado.length == 0) {
      return res.status(422).send("No hay competencias disponibles");
     }
    res.send(JSON.stringify(resultado));

  });
}

function getCompetencia(req, res) {
  let id = req.params.id;
  let sql = "select c.nombre, " +  "g.nombre as genero_nombre, " + "d.nombre as director_nombre, " + "a.nombre as actor_nombre " +    "from competencia as c " +  "Left Join genero as g on (c.genero_id = g.id) " + "Left Join director as d on (c.director_id = d.id) " + "Left Join actor as a on (c.actor_id = a.id) " + "where c.id = " + id;
  
  connection.query(sql, function (error, resultado, fields) {
    if (error) {
      console.log("Ha ocurrido un error en la consulta", error.message);
      return res.status(404).send("Ha ocurrido un error en la consulta");
    }
    if (resultado.length == 0) {
     return res.status(422).send("La competencia solicitada no existe");
    }
    var response = {
      'nombre': resultado[0].nombre,
      'genero_nombre': resultado[0].genero_nombre,
      'actor_nombre': resultado[0].actor_nombre,
      'director_nombre': resultado[0].director_nombre
      };
    res.send(JSON.stringify(response));

  });
}

function getPelis(req, res) {
  let id = req.params.id;
  let sql = 'select * from competencia where competencia.id = ' + id;


  connection.query(sql, function (error, resultado, fields) {
    if (error) {
      console.log("Ha ocurrido un error en la consulta", error.message);
      return res.status(404).send("Hubo un error en la consulta");
    }
    if (resultado.length == 0) {
      console.log("No se encontro la competencia solicitada");
      return res.status(422).send("No se encontro la competencia solicitada");
    }
    let genero_id = resultado[0].genero_id;
    let director_id = resultado[0].director_id;
    let actor_id = resultado[0].actor_id;

    let sql_join = ' ';
    let sql_where = '';

    if (genero_id) { sql_join = sql_join + " left join genero on (p.genero_id = genero.id) "; }
    if (director_id) { sql_join = sql_join + " left join director_pelicula as dp on (p.id = dp.pelicula_id) "; }
    if (actor_id) { sql_join = sql_join + " left join actor_pelicula as ap on (p.id = ap.pelicula_id) "; }

    if (genero_id || director_id || actor_id) { sql_where = ' WHERE '; } else { sql_where = ' '; }

    if (!genero_id) { var sql_genero = ''; } else { var sql_genero = ' p.genero_id =' + genero_id; }
    if (!director_id) { var sql_director = ''; } else { var sql_director = ' dp.director_id =' + director_id; }
    if (!actor_id) { var sql_actor = ''; } else { var sql_actor = ' ap.actor_id =' + actor_id; }
    if (genero_id && (director_id || actor_id)) { var and1 = ' AND '; } else { var and1 = ''; }
    if (director_id && actor_id) { var and2 = ' AND '; } else { var and2 = ''; }
    let sql_random = 'SELECT p.id, p.titulo, p.poster from pelicula as p ' + sql_join + sql_where + sql_genero + and1 + sql_director + and2 + sql_actor + ' ORDER BY RAND() LIMIT 2;';
    
    connection.query(sql_random, function (error_, resultado_random, fields_) {
      if (error_) {
        console.log("Hubo un error en la consulta", error_.message);
        return res.status(404).send("Hubo un error en la consulta");
      }
      var response = {
        'competencia': resultado[0].nombre,
        'peliculas': resultado_random

      };
      res.send(JSON.stringify(response));
    });

  });
}

function postVoto(req, res) {
  let idCompetencia = req.params.id;
  let idPelicula = req.body.idPelicula;
  let sql_competencia = 'select * from competencia where competencia.id = ' + idCompetencia;
  let sql_pelicula = 'select * from pelicula where pelicula.id = ' + idPelicula;
  let sql_voto = 'INSERT INTO votos (pelicula_id, competencia_id) VALUES (' + idPelicula + ', ' + idCompetencia + ');';
  connection.query(sql_competencia, function (error_competencia, resultado_competencia, fields_competencia) {
    if (error_competencia) {
      console.log("Ha ocurrido un error en la consulta", error_competencia.message);
      return res.status(404).send("Hubo un error en la consulta");
    }
    if (resultado_competencia.length == 0) {
      console.log("No se encontro la competencia solicitada");
      return res.status(404).send("No se encontro la competencia solicitada");
    }
    connection.query(sql_pelicula, function (error_pelicula, resultado_pelicula, fields_pelicula) {
      if (error_pelicula) {
        console.log("Ha ocurrido un error en la consulta", error_pelicula.message);
        return res.status(404).send("Hubo un error en la consulta");
      }
      if (resultado_pelicula.length == 0) {
        console.log("No se encontro la pelicula solicitada");
        return res.status(404).send("No se encontro la pelicula solicitada");
      }


      connection.query(sql_voto, function (error, resultado, fields) {
        if (error) {
          console.log("Ha ocurrido un error en la consulta", error.message);
          return res.status(404).send("Ha ocurrido un error en la consulta");
        }
        res.send(JSON.stringify(resultado));
      });
    });
  });

}

function getResultados(req, res) {
  let id = req.params.id;
  let sql = 'select nombre from competencia where competencia.id = ' + id;
  let sql_top3 = 'SELECT votos.pelicula_id , pelicula.titulo, pelicula.poster, COUNT(*) as votos from votos  left join pelicula on (votos.pelicula_id = pelicula.id) where votos.competencia_id =' + id + ' GROUP BY votos.pelicula_id ORDER BY votos DESC LIMIT 3;';

  connection.query(sql, function (error, resultado, fields) {
    if (error) {
      console.log("Ha ocurrido un error en la consulta", error.message);
      return res.status(404).send("Hubo un error en la consulta");
    }
    if (resultado.length == 0) {
      console.log("No se encontro la competencia solicitada");
      return res.status(404).send("No se encontro la competencia solicitada");
    }
    connection.query(sql_top3, function (error_top3, resultado_top3, fields_top3) {
      if (error_top3) {
        console.log("Hubo un error en la consulta", error_.message);
        return res.status(404).send("Hubo un error en la consulta");
      }

      var response = {
        'competencia': resultado[0].nombre,
        'resultados': resultado_top3

      };
      res.send(JSON.stringify(response));
    });

  });
}

function postCompetencia(req, res) {

  let nombreCompetencia = req.body.nombre;
  let genero_id = (req.body.genero == '0') ? null : req.body.genero;
  let director_id = (req.body.director == '0') ? null : req.body.director;
  let actor_id = (req.body.actor == '0') ? null : req.body.actor;
  let sql_join = ' ';
  let sql_where = '';

  if (genero_id) { sql_join = sql_join + " left join genero on (p.genero_id = genero.id) "; }
  if (director_id) { sql_join = sql_join + " left join director_pelicula as dp on (p.id = dp.pelicula_id) "; }
  if (actor_id) { sql_join = sql_join + " left join actor_pelicula as ap on (p.id = ap.pelicula_id) "; }

  if (genero_id || director_id || actor_id) { sql_where = ' WHERE '; } else { sql_where = ' '; }

  if (!genero_id) { var sql_genero = ''; } else { var sql_genero = ' p.genero_id =' + genero_id; }
  if (!director_id) { var sql_director = ''; } else { var sql_director = ' dp.director_id =' + director_id; }
  if (!actor_id) { var sql_actor = ''; } else { var sql_actor = ' ap.actor_id =' + actor_id; }
  if (genero_id && (director_id || actor_id)) { var and1 = ' AND '; } else { var and1 = ''; }
  if (director_id && actor_id) { var and2 = ' AND '; } else { var and2 = ''; }
  let sql_new = 'SELECT p.id, p.titulo, p.poster from pelicula as p ' + sql_join + sql_where + sql_genero + and1 + sql_director + and2 + sql_actor + ' ORDER BY RAND();';
 
  connection.query(sql_new, function (error, resultado, fields) {
    if (error) {
      console.log("Hubo un error en la consulta", error.message);
      return res.status(404).send("Hubo un error en la consulta");
    }
    if(resultado.length < 1){
      return res.status(422).send("No hay suficientes peliculas para esta competencia");
    }

    let sql_competencia = 'INSERT INTO competencia (nombre, genero_id, director_id , actor_id) VALUES ("' + nombreCompetencia + '", ' + genero_id + ', ' + director_id + ', ' + actor_id + ');';

    connection.query(sql_competencia, function (error_competencia, resultado_competencia, fields_competencia) {
      if (error_competencia) {
        console.log("Hubo un error en la consulta", error_competencia.message);
        return res.status(404).send("Hubo un error en la consulta");
      }
  
      res.send(JSON.stringify(resultado_competencia));
    });
  });
}




function deleteVotos(req, res) {
  let id = req.params.id;
  let sql = 'select nombre from competencia where competencia.id = ' + id;
  let sql_delete = 'DELETE FROM votos WHERE competencia_id =' + id;

  connection.query(sql, function (error, resultado, fields) {
    if (error) {
      console.log("Ha ocurrido un error en la consulta", error.message);
      return res.status(404).send("Hubo un error en la consulta");
    }
    if (resultado.length == 0) {
      console.log("No se encontro la competencia solicitada");
      return res.status(404).send("No se encontro la competencia solicitada");
    }
    connection.query(sql_delete, function (error_, resultado_, fields_) {
      if (error_) {
        console.log("Hubo un error en la consulta", error_.message);
        return res.status(404).send("Hubo un error en la consulta");
      }


    });

  });
}

function deleteCompetencia(req, res) {
  let id = req.params.id;
  let sql = 'select * from competencia where competencia.id = ' + id;
  let sql_delete_votos = 'DELETE FROM votos WHERE competencia_id =' + id;
  let sql_delete_competencia = 'DELETE FROM competencia WHERE id =' + id;

  connection.query(sql, function (error, resultado, fields) {
    if (error) {
      console.log("Ha ocurrido un error en la consulta", error.message);
      return res.status(404).send("Hubo un error en la consulta");
    }
    if (resultado.length == 0) {
      console.log("No se encontro la competencia solicitada");
      return res.status(404).send("No se encontro la competencia solicitada");
    }
    connection.query(sql_delete_votos, function (error_, resultado_, fields_) {
      if (error_) {
        console.log("Hubo un error en la consulta", error_.message);
        return res.status(404).send("Hubo un error en la consulta");
      }
      connection.query(sql_delete_competencia, function (error__, resultado__, fields__) {
        if (error__) {
          console.log("Hubo un error en la consulta", error__.message);
          return res.status(404).send("Hubo un error en la consulta");
        }
        res.send(JSON.stringify(resultado__));
      });

    });

  });
}


function putCompetencia(req, res) {
  let id = req.params.id;
  let nuevo_nombre = req.body.nombre;
  let sql = 'select * from competencia where competencia.id = ' + id;
  let sql_put = 'UPDATE competencia SET nombre = "'+  nuevo_nombre +'"  WHERE id =' + id;
  

  connection.query(sql, function (error, resultado, fields) {
    if (error) {
      console.log("Ha ocurrido un error en la consulta", error.message);
      return res.status(404).send("Hubo un error en la consulta");
    }
    if (resultado.length == 0) {
      console.log("No se encontro la competencia solicitada");
      return res.status(404).send("No se encontro la competencia solicitada");
    }
    connection.query(sql_put, function (error_, resultado_, fields_) {
      if (error_) {
        console.log("Hubo un error en la consulta", error_.message);
        return res.status(404).send("Hubo un error en la consulta");
      }

      res.send(JSON.stringify(resultado_));
    });

  });
}

function getGeneros(req, res) {
  let sql = 'select * from genero;';

  connection.query(sql, function (error, resultado, fields) {
    if (error) {
      console.log("Ha ocurrido un error en la consulta", error.message);
      return res.status(404).send("Hubo un error en la consulta");
    }

    res.send(JSON.stringify(resultado));

  });
}
function getDirectores(req, res) {
  let sql = 'select * from director;';

  connection.query(sql, function (error, resultado, fields) {
    if (error) {
      console.log("Ha ocurrido un error en la consulta", error.message);
      return res.status(404).send("Hubo un error en la consulta");
    }

    res.send(JSON.stringify(resultado));

  });
}

function getActores(req, res) {
  let sql = 'select * from actor;';

  connection.query(sql, function (error, resultado, fields) {
    if (error) {
      console.log("Ha ocurrido un error en la consulta", error.message);
      return res.status(404).send("Hubo un error en la consulta");
    }

    res.send(JSON.stringify(resultado));

  });
}

module.exports = {
  getCompetencias: getCompetencias,
  getPelis: getPelis,
  postVoto: postVoto,
  getResultados: getResultados,
  postCompetencia: postCompetencia,
  deleteVotos: deleteVotos,
  deleteCompetencia: deleteCompetencia,
  getGeneros: getGeneros,
  getDirectores: getDirectores,
  getActores: getActores,
  putCompetencia: putCompetencia,
  getCompetencia : getCompetencia,

};