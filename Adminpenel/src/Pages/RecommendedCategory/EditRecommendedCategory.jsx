import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams, Link } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";

const EditRecommendedCategory = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    ActiveonHome: false,
    image: null,
  });

  const [preview, setPreview] = useState("");

  useEffect(() => {
    axios
      .get(`http://localhost:7000/api/recommended-category/get-single-recommended-category/${id}`)
      .then((res) => {
        const data = res.data.data;
        setFormData({ name: data.name, ActiveonHome: data.ActiveonHome, image: null });
        setPreview(`http://localhost:7000/${data.image}`);
      })
      .catch(() => toast.error("Failed to load"));
  }, [id]);

  const handleChange = (e) => {
    const { name, type, checked, files, value } = e.target;
    if (type === "file") {
      setFormData((p) => ({ ...p, image: files[0] }));
      setPreview(URL.createObjectURL(files[0]));
    } else if (type === "checkbox") {
      setFormData((p) => ({ ...p, [name]: checked }));
    } else {
      setFormData((p) => ({ ...p, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const fd = new FormData();
    fd.append("name", formData.name);
    fd.append("ActiveonHome", formData.ActiveonHome);
    if (formData.image) fd.append("image", formData.image);

    await axios.put(
      `http://localhost:7000/api/recommended-category/update-recommended-category/${id}`,
      fd
    );

    toast.success("Updated");
    navigate("/all-recommended-category");
  };

  return (
    <>
      <ToastContainer />
      <div className="bread">
        <div className="head">
          <h4>Edit Recommended Category</h4>
        </div>
        <div className="links">
          <Link to="/all-recommended-category" className="add-new">
            Back <i className="fa-regular fa-circle-left"></i>
          </Link>
        </div>
      </div>


      <form onSubmit={handleSubmit} className="row g-3">
        <div className="col-md-6">
          <label>Name</label>
          <input name="name" value={formData.name} onChange={handleChange} className="form-control" />
        </div>

        <div className="col-md-6">
          <label>Image</label>
          <input type="file" onChange={handleChange} className="form-control" />
          {preview && <img src={preview} width="80" className="mt-2" />}
        </div>

        {/* <div className="col-md-6">
          <input type="checkbox" name="ActiveonHome" checked={formData.ActiveonHome} onChange={handleChange} />
          Active on Home
        </div> */}

        <div className="col-12 text-center">
          <button className="btn btn-dark">Update</button>
        </div>
      </form>
    </>
  );
};

export default EditRecommendedCategory;
