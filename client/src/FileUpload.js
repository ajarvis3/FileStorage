import "./FileUpload.css"
import {useCallback, useRef} from "react";

async function postData(formRef) {
    const formData = new FormData(formRef.current);
    await fetch(formRef.current.action, {
        method: 'POST',
        body: formData
    });
}

function FileUpload() {
    const fileInput = useRef();
    const formRef = useRef();
    
    const handleSubmit = useCallback((event) => {
        event.preventDefault();
        postData(formRef);
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