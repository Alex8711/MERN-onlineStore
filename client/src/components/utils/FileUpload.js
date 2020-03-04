import React, { useState } from "react";
import Dropzone from "react-dropzone";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import { useSelector } from "react-redux";
import axios from "axios";

function FileUpload(props) {
  const [image, setImage] = useState("");
  const [imagePath, setImagePath] = useState("");
  const currentToken = useSelector(state=>
    state.auth.token
  )
  const onDrop = files => {
    let formData = new FormData();
    const config = {
      headers: { "Content-Type": "multipart/form-data",
                "x-auth-token":currentToken }
    };
  //   const tokenConfig= ()=>{
  //     // get token from localstorage
    
  //   // Headers
  //   let config = {
  //       headers:{
  //           'Content-Type':'multipart/form-data'
  //       }
  //   }
  //   // if token, add to headers
  //   if(currentToken){
  //       config.headers['x-auth-token']=currentToken;
  //   }
  //   return config;
  // }
    formData.append("file", files[0]);

    // save the Image we chose inside the Node Server
    axios.post("/api/product/uploadImage", formData, config).then(res => {
      if (res.data.success) {
        setImage(res.data.image);
        setImagePath(res.data.filePath);
        props.refreshFunction(res.data.image);
      } else {
        alert("Failed to save the Image in Server");
      }
    });
  };
  const onDelete = () => {
    setImage("");
    setImagePath("");
    props.refreshFunction("");
  };
  return (
    <div style={{ display: "flex", justifyContent: "space-between" }}>
      <Dropzone onDrop={onDrop} multiple={false} maxSize={80000000}>
        {({ getRootProps, getInputProps }) => (
          <div
            style={{
              width: "300px",
              height: "240px",
              border: "1px solid lightgray",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
            {...getRootProps()}
          >
            <input {...getInputProps()} />
            <AddCircleOutlineIcon style={{ fontSize: 50 }} color="primary" />
          </div>
        )}
      </Dropzone>
      <div
        style={{
          display: "flex",
          width: "350px",
          height: "240px",
          overflowX: "scroll"
        }}
      >
        <div onClick={onDelete}>
          <img
            style={{ minWidth: "300px", width: "300px", height: "240px" }}
            src={imagePath}
            alt=""
          />
        </div>
      </div>
    </div>
  );
}

export default FileUpload;
