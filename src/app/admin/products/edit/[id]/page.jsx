"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function EditProductPage() {

  const router = useRouter();

  const { id } = useParams();

  const [loading, setLoading] = useState(true);

  const [categories, setCategories] = useState([]);

  const [title, setTitle] = useState("");

  const [description, setDescription] = useState("");

  const [price, setPrice] = useState("");

  const [stock, setStock] = useState("");

  const [image, setImage] = useState("");

  const [categoryId, setCategoryId] = useState("");

const [imageFile, setImageFile] = useState(null);
const [preview, setPreview] = useState("");

  useEffect(() => {

    fetchProduct();

    fetchCategories();

  }, []);




  async function fetchProduct() {

    try {

     const response = await fetch(`/api/admin/products/${id}`);

      const data = await response.json();

      console.log(data);

      const product = data.product;

setTitle(product.title);
setDescription(product.description);
setPrice(product.price);
setStock(product.stock);
setImage(product.image || "");

if (product.image) {
  setPreview(`/images/${product.image}`);
}

setCategoryId(product.categoryId);

      setLoading(false);

    } catch (error) {

      console.log(error);

    }

  }





  async function fetchCategories() {

    try {

      const response = await fetch("/api/category");

      const data = await response.json();

      setCategories(data.categories || []);

    } catch (error) {

      console.log(error);

    }

  }
  function handleImageChange(e) {
  const file = e.target.files[0];

  if (!file) return;

  if (file.size > 5 * 1024 * 1024) {
    alert("Image must be less than 5MB");
    return;
  }

  if (!file.type.startsWith("image/")) {
    alert("Please select a valid image");
    return;
  }

  setImageFile(file);
  setPreview(URL.createObjectURL(file));
}

async function updateProduct(e) {
  e.preventDefault();

  try {
    const formData = new FormData();

    formData.append("title", title);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("stock", stock);
    formData.append("categoryId", categoryId);

    if (imageFile) {
      formData.append("image", imageFile);
    } else {
      formData.append("imageName", image);
    }

   const response = await fetch(`/api/admin/products/${id}`, {
      method: "PUT",
      body: formData,
    });

    const data = await response.json();

    alert(data.message);

    if (response.ok) {
      router.push("/admin/products");
    }

  } catch (error) {
    console.log(error);
    alert("Something went wrong");
  }
}



  if (loading) {

    return (

      <div className="text-center py-20 text-2xl">

        Loading...

      </div>

    );

  }
    return (

    <div className="min-h-screen bg-gray-100 px-6 py-16">

      <div className="max-w-3xl mx-auto bg-white p-8 rounded-xl shadow">

        <h1 className="text-3xl font-bold mb-8">

          Edit Product

        </h1>

        <form
          onSubmit={updateProduct}
          className="space-y-5"
        >

          <input
            type="text"
            placeholder="Product Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border p-3 rounded-lg"
          />

          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border p-3 rounded-lg h-32"
          />

          <input
            type="number"
            placeholder="Price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full border p-3 rounded-lg"
          />

          <input
            type="number"
            placeholder="Stock"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            className="w-full border p-3 rounded-lg"
          />

          <div>
  <label className="block mb-2 font-medium">
    Product Image
  </label>

  <input
    type="file"
    accept="image/png,image/jpeg,image/jpg,image/webp"
    onChange={handleImageChange}
    className="w-full border p-3 rounded-lg"
  />

  {preview && (
    <img
      src={preview}
      alt="Preview"
      className="mt-4 w-48 h-48 object-cover rounded-lg border"
    />
  )}
</div>
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="w-full border p-3 rounded-lg"
          >

            <option value="">

              Select Category

            </option>

            {categories.map((category) => (

              <option
                key={category.id}
                value={category.id}
              >

                {category.name}

              </option>

            ))}

          </select>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700"
          >

            Update Product

          </button>

        </form>

      </div>

    </div>

  );

}