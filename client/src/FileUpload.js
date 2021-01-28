import "./FileUpload.css"
import {useCallback, useRef} from "react";

/**
 * Adds files to formdata
 * @param {FormData} formData 
 * @param {FileList} files 
 */
function appendData(formData, files) {
    for (let i = 0; i < files.length; i++) {
        formData.append("files", files[i]);
    }
}

async function postData(formRef, files) {
    const formData = new FormData(formRef.current);
    console.log(formData.getAll("files"));
    // appendData(formData, form.current.files);
    const response = await fetch(formRef.current.action, {
        method: 'POST',
        // mode: "cors",
        // cache: "no-cache",
        // credentials: "omit",
        // redirect: "manual",
        // referrerPolicy: "no-referrer",
        body: formData
    });
    console.log(response.status, response.statusText);
}

function FileUpload() {
    const fileInput = useRef();
    const formRef = useRef();
    
    const handleSubmit = useCallback((event) => {
        event.preventDefault();
        console.log(fileInput, fileInput.current);
        console.log(formRef);
        postData(formRef, fileInput.current.files);
    }, [fileInput]);

    return (
        <div>
            <form 
                action={process.env.REACT_APP_FILE_UPLOAD_API}
                encType="multipart/form-data" 
                method="post"
                onSubmit={handleSubmit}
                ref={formRef}>
                <label id="inputLabel" htmlFor="input">Upload File</label>
                <input type="file" id="input" name="files" ref={fileInput} accept=".jpg,.png" multiple />
                <button type="submit">Submit</button>
            </form>
        </div>
    );
}

export default FileUpload;