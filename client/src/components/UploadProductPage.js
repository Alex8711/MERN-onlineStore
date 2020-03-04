import React, { useState } from "react";
import {
  FormControl,
  Input,
  Button,
  TextField,
} from "@material-ui/core";
import FileUpload from "./utils/FileUpload";
import axios from "axios";

import { useSelector } from "react-redux";

function UploadProductPage(props) {
  const [titleValue, setTitleValue] = useState("");
  const [descriptionValue, setDescriptionValue] = useState("");
  const [priceValue, setPriceValue] = useState(0);
  const [image, setImage] = useState("");
  const [imagePath, setImagePath] = useState("");
    const currentToken = useSelector(state=>
    state.auth.token
  )
  const onTitleChange = event => {
    setTitleValue(event.currentTarget.value);
  };
  const onDescriptionChange = event => {
    setDescriptionValue(event.currentTarget.value);
  };
  const onPriceChange = event => {
    setPriceValue(event.currentTarget.value);
  };

  const updateImage = newImage => {
    setImage(newImage);
    setImagePath(`/uploads/${newImage}`);
  };

  const onSubmit = event => {
    event.preventDefault();

    if (!titleValue || !descriptionValue || !priceValue || !image) {
      return alert("Please fill the field");
    }

    const variables = {
      title: titleValue,
      description: descriptionValue,
      price: priceValue,
      image: image,
      imagePath: imagePath
    };

    const config = {
      headers: {
                "x-auth-token":currentToken }
    };
    
    axios.post("/api/product/uploadProduct", variables,config).then(res => {
      if (res.data.success) {
        alert("Product successfully uploaded");
        props.history.push("/");
      } else {
        alert("Failed to uploadProduct");
      }
    });
  };

  return (
    <div style={{ maxWidth: "700px", margin: "2rem auto" }}>
      <div style={{ textAlign: "center", marginBottom: "2rem" }}>
        <h2>UploadProductPage</h2>
      </div>

      <form onSubmit={onSubmit}>
        <FileUpload refreshFunction={updateImage} />
        <FormControl margin="normal" required fullWidth>
          <label>Title</label>
          <Input
            id="title"
            name="title"
            value={titleValue}
            onChange={onTitleChange}
          />
        </FormControl>

        <FormControl margin="normal" required fullWidth>
          <label>Description</label>
          <br />
          <TextField
            name="description"
            id="description"
            multiline
            rowsMax="4"
            value={descriptionValue}
            onChange={onDescriptionChange}
          />
        </FormControl>

        <label>Price</label>
        <br />
        <Input
          name="price"
          id="price"
          type="number"
          value={priceValue}
          onChange={onPriceChange}
        />
        <br />
        <Button
          type="submit"
          name="action"
          variant="contained"
          color="primary"
          mb={2}
          style={{ marginBottom: "20px", marginTop: "10px" }}
          onClick={onSubmit}
        >
          Submit
        </Button>
      </form>
    </div>
  );
}

export default UploadProductPage;
