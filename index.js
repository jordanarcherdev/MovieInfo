const electron = require('electron');
const imdb = require('imdb-api');

const { app, BrowserWindow, ipcMain } = electron;

let mainWindow;

app.on('ready', () => {
  mainWindow = new BrowserWindow({});
  mainWindow.loadURL(`file://${__dirname}/index.html`);
});


ipcMain.on('movie:submit', (event, movieName) => {
  console.log(movieName)
  imdb.get({name: movieName}, {apiKey: '5467c2e2', timeout: 30000}).then((film) => {
      //Create Movie Object
      const newMovie = {
              name: film.name,
              title : film.title,
              year: film._year_data,
              rated: film.rated,
              duration: film.runtime,
              director: film.director,
              writer: film.writer,
              starring: film.actors.split(", "),
              genres: film.genres.split(", "),
              plot: film.plot,
              poster: film.poster,
              kind: film.type,
            }

            mainWindow.webContents.send('movie:info', newMovie);


  }).catch(err => {
      console.log(err);
      mainWindow.webContents.send('movie:info', err);
    })
});
