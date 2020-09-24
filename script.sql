CREATE TABLE competencia
(
    id int NOT NULL
    auto_increment,
 	nombre varchar
    (120) NOT NULL,
 	PRIMARY KEY
    (id)
);

    INSERT INTO competencia (nombre)
    VALUES
        ('¿Cuál es la mejor película?'),
        ('¿Qué drama te hizo llorar más?'),
        ('¿Cuál es la peli más bizarra?'),
        ('¿Cuál es la mejor película de Terror?'),
        ('¿Cuál peli es ams conocida?');

SELECT id, titulo from pelicula ORDER BY RAND() LIMIT 2;


CREATE TABLE votos (
  id int(11) unsigned NOT NULL AUTO_INCREMENT,
  pelicula_id int(11) unsigned NOT NULL,
  competencia_id int NOT NULL,
  fecha datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  FOREIGN KEY(competencia_id) REFERENCES competencia (id),
  FOREIGN KEY(pelicula_id) REFERENCES pelicula (id) 
) ;

ALTER TABLE competencia 
ADD COLUMN genero_id int unsigned;

ALTER TABLE competencia 
ADD FOREIGN KEY(genero_id) REFERENCES genero (id);

ALTER TABLE competencia 
ADD COLUMN director_id int unsigned;

ALTER TABLE competencia 
ADD FOREIGN KEY(director_id) REFERENCES director (id);

ALTER TABLE competencia 
ADD COLUMN actor_id int unsigned;

ALTER TABLE competencia 
ADD FOREIGN KEY(actor_id) REFERENCES actor (id);

