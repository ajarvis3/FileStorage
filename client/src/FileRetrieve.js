import "./FileRetrieve.css";
import {useState} from "react";
import * as path from "path";

function File(props) {
    const {name} = props;
    const api = process.env.REACT_APP_RETRIEVE_FILES;

    return (
        <img src={path.join(api, name)} alt={name} />
    )
}

function FileRetrieve() {
    const [files, setFiles] = useState([]);

    const api = process.env.REACT_APP_RETRIEVE_FILES;
    fetch(api).then(res => {
        const val = res.json();
        return val;
    }).then(res => {
        setFiles(res);
    });

    const fileElems = files.map((value) => {
        return <File name={value} key={value} />;
    });

    return <div>
        {fileElems}
    </div>
}

export default FileRetrieve;