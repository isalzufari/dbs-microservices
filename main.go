package main

import (
	"database/sql"
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
	_ "github.com/go-sql-driver/mysql"
)

type Movie struct {
	ID    int    `json:"id"`
	Title string `json:"title"`
}

func dbConn() (db *sql.DB) {
	dbDriver := "mysql"
	dbName := "cinema"
	dbUser := "root"
	dbPass := "my-secret-pw"
	db, err := sql.Open(dbDriver, dbUser+":"+dbPass+"@tcp(localhost:3308)/"+dbName)

	if err != nil {
		panic(err.Error())
	}

	return db
}

func getMovies(c *gin.Context) {
	var movies Movie
	var mv []Movie

	db := dbConn()
	rows, err := db.Query("SELECT * FROM movies")
	defer db.Close()

	if err != nil {
		log.Print(err.Error())
	}

	for rows.Next() {
		err := rows.Scan(&movies.ID, &movies.Title)

		if err != nil {
			log.Print(err.Error())
		} else {
			mv = append(mv, movies)
		}
	}

	c.IndentedJSON(http.StatusOK, mv)
}

func getMovieById(c *gin.Context) {
	id := c.Param("id")

	var movie Movie

	db := dbConn()
	rows := db.QueryRow("SELECT * FROM movies WHERE id=?", id)
	defer db.Close()

	result := rows.Scan(&movie.ID, &movie.Title)

	if result != nil && result == sql.ErrNoRows {
		c.IndentedJSON(http.StatusNotFound, gin.H{"message": "Movie not found!"})
		return
	}

	c.IndentedJSON(http.StatusOK, movie)
}

func postMovie(c *gin.Context) {
	var newMovie Movie

	if err := c.BindJSON(&newMovie); err != nil {
		c.IndentedJSON(http.StatusBadRequest, gin.H{"message": "Body error!"})
		return
	}

	id := newMovie.ID
	title := newMovie.Title

	db := dbConn()
	rows, err := db.Prepare("INSERT INTO movies (id, title) VALUES (?, ?)")

	if err != nil {
		log.Print(err.Error())
	}

	rows.Exec(id, title)
	defer db.Close()

	c.IndentedJSON(http.StatusCreated, newMovie)
}

func main() {
	router := gin.Default()
	router.GET("/", getMovies)
	router.GET("/:id", getMovieById)
	router.POST("/", postMovie)

	router.Run("localhost:3002")
}
