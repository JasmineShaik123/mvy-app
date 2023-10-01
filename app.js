const express = require("express");
const { open } = require("sqlite");
const path = require("path");
const sqlite3 = require("sqlite3");
const dbPath = path.join(__dirname, "moviesData.db");
const app = express();
let db = null;
app.use(express.json());
const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });

    app.listen(3000, () => {
      console.log("server is running http://localhost:3000/");
    });
  } catch (e) {
    console.log(`DB Error:${e.message}`);
    process.exit(1);
  }
};
initializeDBAndServer();

const convertDbToResponse = (dbObject) => {
  return {
    movieId: dbObject.movie_id,
    movieName: dbObject.movie_name,
    directorId: dbObject.director_id,
    leadActor: dbObject.lead_actor,
  };
};

app.get("/movies/", async (request, response) => {
  const getMovieQuery = `SELECT * FROM movie;`;
  const movieArray = await db.all(getMovieQuery);
  response.send(
    movieArray.map((eachItem) => console.log(convertDbToResponse(eachItem)))
  );
});

app.get("movies/:movieId", async (request, response) => {
  const { movieId } = request.params;
  const getAMovieQuery = `SELECT * FROM movie WHERE movie_id=${movieId};`;
  const picture = await db.get(getAMovieQuery);
  response.send(convertDbToResponse(picture));
});
