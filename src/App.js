import { useState } from 'react'
import './App.css';
import { VideoCard } from './components/VideoCard';

function validateUrl(url) {
  const regExp = /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/;
  return regExp.test(url);
}

function getIdfromUrl(url) {
  //https://www.youtube.com/watch?v=rNbZ4DD7IPo
  // extrach v from url
  var regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  var match = url.match(regExp);
  if (match && match[2].length == 11) {
    return match[2];
  }
  return null;

}

async function getVideoData(id) {
  var response = await fetch("https://downloader-api.herokuapp.com/youtube/"+id);
  var data = await response.json();

  return data;
}

function App() {
  const [url, setUrl] = useState("");
  const [downloading, setDownloading] = useState(false);
  const [videoData, setVideoData] = useState({});

  return (
    <div className="App">
      <header className="App-header">
        <div className='row col-md-12 col-sm-12'>
          <div className='col-sm-8 offset-sm-2 col-md-6 offset-md-3'>
            <form>
              <div className="mb-3">
                <label for="url-input" className="form-label">Youtube Video URL:</label>
                <input type="url" value={url} onChange={e => {
                  setUrl(e.target.value)
                }} className="form-control" id="url-input" placeholder='https://www.youtube.com/watch?v=rNbZ4DD7IPo' aria-describedby="url-help" />
                <div id="url-help" className="form-text">Copie o link do vídeo e cole aqui.</div>
              </div>
              <button 
                type="submit"
                className="btn btn-primary"
                onClick={e => {
                  e.preventDefault();
                  if (validateUrl(url)) {
                    var id = getIdfromUrl(url);
                    getVideoData(id).then(data => {
                      setDownloading(true);
                      setVideoData(data);
                    })

                  }else{
                    alert("URL inválida!");
                  }
                }}
              >Baixar</button>
            </form>
          </div>
        </div>
        <div className='row col-md-12 m-0'>
          <div className='col-sm-8 offset-sm-2 col-md-6 offset-md-3'>
            {downloading ?
              <VideoCard
                videoData={videoData}
                url={url}
              />
            : ''}
          </div>
        </div>
      </header>
    </div>
  );
}

export default App;
