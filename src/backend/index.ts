import { Server } from 'azle';
import express, { NextFunction, Request, Response } from 'express';

type Song = {
    id: number,
    name: string,
    author: string,
    genre: string,
    year: number
};

let songs: Song[] = [
    {
        id: 1,
        name: 'Culpable o no',
        author: 'Luis Miguel',
        genre: 'Pop',
        year: 1988
    }
];

// To debug
function logger(req: Request, res: Response, next: NextFunction) {
    console.log("Hello from Middleware");
    next();
}

export default Server(() => {

    const keysDefault = ['id', 'name', 'author', 'genre', 'year'];

    const app = express();

    app.use(express.json());

    app.use(logger);

    // GET
    app.get('/songs', (req: Request, res) => {
        try {
            res.json(songs)
        } catch (error) {
            res.status(500).send('Internal server error');
        }
    });

    // GET BY YEAR
    app.get('/songs/year/:year', (req: Request, res) => {
        try {
            if (!req.params.year) {
                res.status(400).send('Endpoint not valid');
            }
            const year = +req.params.year;
            if (!year) {
                res.status(400).send('Endpoint not valid');
            }
            const filterYear = songs.filter(song => song.year === year);

            res.json(filterYear)
        } catch (error) {
            res.status(500).send('Internal server error');
        }


    });

    // GET BY GENRE
    app.get('/songs/genre/:genre', (req: Request, res) => {
        try {
            if (!req.params.genre) {
                res.status(400).send('Endpoint not valid');
            }
            const genre = req.params.genre;

            const filterGenre = songs.filter(song => song.genre === genre);

            res.json(filterGenre);
        } catch (error) {
            res.status(500).send('Internal server error');
        }
    });

    // POST
    app.post('/songs', (req, res) => {
        try {
            const { id, name, author, genre, year } = req.body;
            if (!id || !name || !author || !genre || !year) {
                res.status(404).send('Error');
            }

            const newSong: Song = {
                id: req.body.id,
                name: req.body.name,
                author: req.body.author,
                genre: req.body.genre,
                year: req.body.year
            }

            songs = [...songs, newSong];
            res.send('OK');
        } catch (error) {
            res.status(500).send('Internal server error');
        }
    });

    // PUT
    app.put("/songs/:id", (req, res) => {
        try {
            if (!req.params.id) {
                res.status(400).send('Endpoint not valid');

            }
            const id = +req.params.id;
            if (!id) {
                res.status(400).send('Endpoint not valid');
            }
            const song = songs.find(song => song.id === id);

            if (!song) {
                res.status(404).send('Error');
                return
            }

            const updateKeys = Object.keys(req.body)

            for (let key of updateKeys) {
                if (!keysDefault.includes(key)) {
                    res.status(404).send('Error');
                    return;
                }
            }

            const updateBook = { ...song, ...req.body };

            songs = songs.map(b => b.id === updateBook.id ? updateBook : b);

            res.send('OK');
        } catch (error) {
            res.status(500).send('Internal server error');
        }
    });

    // DELETE
    app.delete('/song/:id', (req, res) => {
        try {
            const id = +req.params.id;
            if (!id) {
                res.status(400).send('Endpoint not valid');
            }
            songs = songs.filter(song => song.id !== id);
            res.send('OK');
        } catch (error) {
            res.status(500).send('Internal server error');
        }
    });

    return app.listen();
});
