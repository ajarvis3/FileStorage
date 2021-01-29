import "./FileRetrieve.css";
import {useCallback, useEffect, useState} from "react";
import * as path from "path";
import * as signalR from "@microsoft/signalr";

function File(props) {
    const {name} = props;
    const api = process.env.REACT_APP_RETRIEVE_FILES;
    const delApi = process.env.REACT_APP_FILE_UPLOAD_API;

    const onClick = useCallback(() => {
        fetch(path.join(delApi, name), {
            method: "delete",
            mode: "cors"
        });
    });

    return (
        <div>
            <button onClick={onClick}>Delete</button>
            <img src={path.join(api, name)} alt={name} />
        </div>
    )
}

/**
 * updates files
 * @param {*} setFiles 
 */
function updateFiles(setFiles) {
    console.log("here?");
    const api = process.env.REACT_APP_RETRIEVE_FILES;
    fetch(api).then(res => {
        const val = res.json();
        return val;
    }).then(res => {
        setFiles(res);
    });
}

function FileRetrieve() {
    // perhaps in a more complete application, this would be
    // higher up so that file upload could manipulate it
    const [files, setFiles] = useState([]);

    // run once to retrieve files first time
    useEffect(() => {
        updateFiles(setFiles);
    }, []);
    // set up signalr
    useEffect(() => {
        const conn = new signalR.HubConnectionBuilder()
            .withUrl(process.env.REACT_APP_SIGNAL_R_CONNECTION_STRING)
            .configureLogging(signalR.LogLevel.Information)
            .withAutomaticReconnect()
            .build();
        try {
            conn.start();
            conn.on("updateFiles", () => {
                console.log("received");
                updateFiles(setFiles);
            });    
        } catch (err) {
            console.error(err);
        }
    }, []);

    const fileElems = files.map((value) => {
        return <File name={value} key={value} />;
    });

    return <div>
        {fileElems}
    </div>
}

export default FileRetrieve;