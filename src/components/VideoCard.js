import { useState } from 'react'

function getValidThumnail(thumbnails){
    /*
        props.videoData.video.snippet.thumbnails.maxres?.url |
        props.videoData.video.snippet.thumbnails.high?.url   |
        props.videoData.video.snippet.thumbnails.medium?.url |
        props.videoData.video.snippet.thumbnails.default?.url
    **/
    if(thumbnails.maxres){
        return thumbnails.maxres.url;
    }

    if(thumbnails.high){
        return thumbnails.high.url;
    }

    if(thumbnails.medium){
        return thumbnails.medium.url;
    }

    if(thumbnails.default){
        return thumbnails.default.url;
    }
}

async function getDownloadLinks(url){
    var response = await fetch("https://downloader-api.herokuapp.com/youtube?url="+url);
    var data = await response.json();

    return data;
}

const DownloadLinks = (props) => {
    return (
        <ul className="list-group list-group-flush">
            {props.downloadLinks?.map((link, index) => {
                return(
                    <li className="list-group-item bg-dark" key={link.format_id}>
                        <a href={link.url} target="_blank" rel="noopener noreferrer" download={true}>
                            <span class="badge rounded-pill bg-success">{link.format} - {link.ext}</span>
                        </a>
                    </li>
                )
            })}
        </ul>
    )
}

const WhatsappButton = (props) => {
    // react component to unlock download links on share website url
    return (
        <div 
            className="whatsapp-share-button"
            onClick={() => {
                setTimeout(() => {
                    props.onClick();
                }, 1000);
            }}    
        >
            <a href={`https://api.whatsapp.com/send?text=Baixe vídeos do youtube aqui: ${window.location.href}`} target="_blank" rel="noopener noreferrer">
                <img src="https://img.icons8.com/color/48/000000/whatsapp.png" alt="whatsapp" />
                <span>Compartilhe para Desbloquear</span>
            </a>
        </div>
    )
}


const VideoCard = (props) => {
    const [downloadLinks, setDownloadLinks] = useState([]);
    const [lock, setLock] = useState(true);

    return(
        <div className="card col-md-12 bg-dark">
            <div className="row g-0">
                <div className="col-md-4">
                <img src={
                        getValidThumnail(props.videoData.video.snippet.thumbnails)
                    } 
                    className="img-fluid rounded-start" 
                    alt="..." 
                />
                </div>
                <div className="col-md-8">
                    <div className="card-body">
                        <h5 className="card-title">{props.videoData.video.snippet.title}</h5>
                        <p className="card-text">{props.videoData.video.snippet.description.substr(0, 100) + '...' }</p>
                    </div>
                </div>
                {lock ?
                    <ul className='list-group list-group-flush'>
                        <li className="list-group-item bg-dark">
                            <WhatsappButton onClick={() => {
                                getDownloadLinks(props.url).then(data => {
                                    setDownloadLinks(data.video.formats);
                                    setLock(false);
                                })
                            }}/>
                        </li>
                    </ul>    
                    :
                    <DownloadLinks 
                        downloadLinks={downloadLinks}
                    />
                }
            </div>
        </div>
    )
}

export {
    VideoCard
}