// import React, { useState } from 'react';
// import './AddProduct.css';
// import upload_area from '../../Assets/upload_area.png';

// const AddProduct = () => {
//   const [image, setImage] = useState(null);
//   const [productDetails, setProductDetails] = useState({
//     name: "",
//     image: "",
//     category: "women",
//     new_price: "",
//     old_price: "",
//   });

//   const imageHandler = (e) => {
//     setImage(e.target.files[0]);
//   };

//   const changeHandler = (e) => {
//     setProductDetails({ ...productDetails, [e.target.name]: e.target.value });
//   };

//   const Add_Product = async () => {
//     console.log("📦 Product Details (before upload):", productDetails);

//     if (!image) {
//       alert("❌ Please select an image!");
//       return;
//     }

//     try {
//       // 1️⃣ Upload image first
//       const formData = new FormData();
//       formData.append('product', image);

//       const uploadRes = await fetch('http://localhost:4001/upload', {
//         method: 'POST',
//         body: formData,
//       });

//       const uploadData = await uploadRes.json();
//       console.log("🖼️ Image Upload Response:", uploadData);

//       if (!uploadData.success || !uploadData.imageUrl) {
//         throw new Error("Image upload failed or response missing imageUrl");
//       }

//       const imageUrl = uploadData.imageUrl;

//       // 2️⃣ Send product data to backend
//       const fullProduct = {
//         ...productDetails,
//         image: imageUrl,
//         new_price: Number(productDetails.new_price),
//         old_price: Number(productDetails.old_price),
//       };

//       console.log("🚀 Sending to /addproduct:", fullProduct);

//       const addRes = await fetch('http://localhost:4001/addproduct', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(fullProduct),
//       });

//       const addData = await addRes.json();
//       console.log("✅ Product Add Response:", addData);

//       if (addData.success) {
//         alert("✅ Product added successfully!");
//         setProductDetails({
//           name: "",
//           image: "",
//           category: "women",
//           new_price: "",
//           old_price: "",
//         });
//         setImage(null);
//       } else {
//         alert("❌ Failed to add product: " + addData.message);
//       }

//     } catch (error) {
//       console.error("❌ Error during add product:", error);
//       alert("❌ Something went wrong. Please try again.");
//     }
//   };

//   return (
//     <div className='add-product'>
//       <div className="addproduct-itemfield">
//         <p>Product Title</p>
//         <input
//           value={productDetails.name}
//           onChange={changeHandler}
//           type="text"
//           name='name'
//           placeholder='Type here'
//         />
//       </div>

//       <div className="addproduct-price">
//         <div className="addproduct-itemfield">
//           <p>Price</p>
//           <input
//             value={productDetails.old_price}
//             onChange={changeHandler}
//             type="text"
//             name="old_price"
//             placeholder='Type here'
//           />
//         </div>

//         <div className="addproduct-itemfield">
//           <p>Offer Price</p>
//           <input
//             value={productDetails.new_price}
//             onChange={changeHandler}
//             type="text"
//             name="new_price"
//             placeholder='Type here'
//           />
//         </div>
//       </div>

//       <div className="addproduct-item-field">
//         <p>Product Category</p>
//         <select
//           value={productDetails.category}
//           onChange={changeHandler}
//           name="category"
//           className='add-product-selector'
//         >
//           <option value="women">Women</option>
//           <option value="men">Men</option>
//           <option value="kid">Kid</option>
//         </select>
//       </div>

//       <div className="addproduct-upload-wrapper">
//         <label htmlFor="file-input">
//           <img
//             src={image ? URL.createObjectURL(image) : upload_area}
//             className='addproduct-thumbnail-img'
//             alt="Upload"
//           />
//         </label>
//         <input
//           onChange={imageHandler}
//           type="file"
//           name='image'
//           id='file-input'
//           hidden
//         />
//       </div>

//       <button onClick={Add_Product} className="addproduct-btn">ADD</button>
//     </div>
//   );
// };

// export default AddProduct;


import React, { useState } from 'react';
import './AddProduct.css';
import upload_area from '../../Assets/upload_area.png';

const BACKEND_URL = "https://shoppify-backend-gofd.onrender.com";

const AddProduct = () => {
  const [image, setImage] = useState(null);
  const [productDetails, setProductDetails] = useState({
    name: "",
    image: "",
    category: "women",
    new_price: "",
    old_price: "",
  });

  const imageHandler = (e) => {
    setImage(e.target.files[0]);
  };

  const changeHandler = (e) => {
    setProductDetails({ ...productDetails, [e.target.name]: e.target.value });
  };

  const Add_Product = async () => {
    console.log("📦 Product Details (before upload):", productDetails);

    if (!image) {
      alert("❌ Please select an image!");
      return;
    }

    try {
      // 1️⃣ Upload image first
      const formData = new FormData();
      formData.append('product', image);

      const uploadRes = await fetch(`${BACKEND_URL}/upload`, {
        method: 'POST',
        body: formData,
      });

      const uploadData = await uploadRes.json();
      console.log("🖼️ Image Upload Response:", uploadData);

      if (!uploadData.success || !uploadData.imageUrl) {
        throw new Error("Image upload failed or response missing imageUrl");
      }

      const imageUrl = uploadData.imageUrl;

      // 2️⃣ Send product data to backend
      const fullProduct = {
        ...productDetails,
        image: imageUrl,
        new_price: Number(productDetails.new_price),
        old_price: Number(productDetails.old_price),
      };

      console.log("🚀 Sending to /addproduct:", fullProduct);

      const addRes = await fetch(`${BACKEND_URL}/addproduct`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(fullProduct),
      });

      const addData = await addRes.json();
      console.log("✅ Product Add Response:", addData);

      if (addData.success) {
        alert("✅ Product added successfully!");
        setProductDetails({
          name: "",
          image: "",
          category: "women",
          new_price: "",
          old_price: "",
        });
        setImage(null);
      } else {
        alert("❌ Failed to add product: " + addData.message);
      }

    } catch (error) {
      console.error("❌ Error during add product:", error);
      alert("❌ Something went wrong. Please try again.");
    }
  };

  return (
    <div className='add-product'>
      <div className="addproduct-itemfield">
        <p>Product Title</p>
        <input
          value={productDetails.name}
          onChange={changeHandler}
          type="text"
          name='name'
          placeholder='Type here'
        />
      </div>

      <div className="addproduct-price">
        <div className="addproduct-itemfield">
          <p>Price</p>
          <input
            value={productDetails.old_price}
            onChange={changeHandler}
            type="text"
            name="old_price"
            placeholder='Type here'
          />
        </div>

        <div className="addproduct-itemfield">
          <p>Offer Price</p>
          <input
            value={productDetails.new_price}
            onChange={changeHandler}
            type="text"
            name="new_price"
            placeholder='Type here'
          />
        </div>
      </div>

      <div className="addproduct-item-field">
        <p>Product Category</p>
        <select
          value={productDetails.category}
          onChange={changeHandler}
          name="category"
          className='add-product-selector'
        >
          <option value="women">Women</option>
          <option value="men">Men</option>
          <option value="kid">Kid</option>
        </select>
      </div>

      <div className="addproduct-upload-wrapper">
        <label htmlFor="file-input">
          <img
            src={image ? URL.createObjectURL(image) : upload_area}
            className='addproduct-thumbnail-img'
            alt="Upload"
          />
        </label>
        <input
          onChange={imageHandler}
          type="file"
          name='image'
          id='file-input'
          hidden
        />
      </div>

      <button onClick={Add_Product} className="addproduct-btn">ADD</button>
    </div>
  );
};

export default AddProduct;

