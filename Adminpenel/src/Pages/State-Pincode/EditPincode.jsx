import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Country, State, City } from "country-state-city";
import Select from "react-select";

const EditPinCode = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [stateList, setStateList] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [pageLoading, setPageLoading] = useState(true);

    const [formData, setFormData] = useState({
        stateName: "",
        area: "",
        pinCode: "",
        isActive: true,
    });

    /* ================= FETCH STATES ================= */
    useEffect(() => {
        const states = State.getStatesOfCountry("IN");
        setStateList(states);

    }, []);

    /* ================= FETCH PINCODE BY ID ================= */
    useEffect(() => {
        const fetchPinCode = async () => {
            try {
                const res = await axios.get(
                    `https://api.cakenpetals.com/api/pincode/get-all-pin-codes-by-id/${id}`
                );

                if (res?.data?.status) {
                    const data = res?.data?.pinCodes;

                    setFormData({
                        stateName: data?.stateName || "",
                        area: data?.area || "",
                        pinCode: data?.pinCode || "",
                        isActive: data?.isActive ?? true,
                    });
                }
            } catch (error) {
                console.error("Failed to fetch pinCode:", error);
                toast.error("Failed to load PinCode!");
            } finally {
                setPageLoading(false);
            }
        };

        if (id) fetchPinCode();
    }, [id]);

    /* ================= HANDLE CHANGE ================= */
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    /* ================= VALIDATION ================= */
    const validateForm = () => {
        if (!formData.stateName) {
            toast.error("Please select a state");
            return false;
        }

        if (!formData.area.trim()) {
            toast.error("Area is required");
            return false;
        }

        if (!/^\d{6}$/.test(formData.pinCode)) {
            toast.error("PinCode must be exactly 6 digits");
            return false;
        }

        return true;
    };

    /* ================= SUBMIT UPDATE ================= */
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        setIsLoading(true);

        try {
            const res = await axios.post(
                `https://api.cakenpetals.com/api/pincode/update-pincode/${id}`,
                {
                    ...formData,
                    area: formData.area.trim(),
                    pinCode: formData.pinCode.trim(),
                }
            );

            if (res?.data?.status) {
                toast.success("PinCode updated successfully!");
                navigate("/all-pincode");
            } else {
                toast.error("Failed to update PinCode");
            }
        } catch (error) {
            console.error("Update error:", error);
            toast.error(
                error?.response?.data?.message || "Could not update PinCode."
            );
        } finally {
            setIsLoading(false);
        }
    };

    const stateLists = stateList.map((sub) => ({
        value: sub?.name,
        label: `${sub?.name}`,
    }));

    return (
        <>
            <ToastContainer />

            {/* ================= HEADER ================= */}
            <div className="bread">
                <div className="head">
                    <h4>Edit PinCode</h4>
                </div>
                <div className="links">
                    <Link to="/all-pincode" className="add-new">
                        Back <i className="fa-regular fa-circle-left"></i>
                    </Link>
                </div>
            </div>

            {/* ================= FORM ================= */}
            <div className="d-form">
                {pageLoading ? (
                    <div className="text-center py-5">Loading PinCode...</div>
                ) : (
                    <form className="row g-3" onSubmit={handleSubmit}>

                        {/* STATE */}
                        <div className="col-md-6">
                            <label className="form-label"> Select State </label>
                            <Select
                                options={stateLists}
                                value={stateLists.find(
                                    (opt) => opt.value === formData.stateName
                                )}
                                onChange={(selected) =>
                                    setFormData((prev) => ({
                                        ...prev,
                                        stateName: selected?.value || "",
                                    }))
                                }
                                placeholder="Select State"
                                isSearchable
                                classNamePrefix="react-select"
                            />
                        </div>

                        {/* AREA */}
                        <div className="col-md-6">
                            <label className="form-label">
                                Area <sup className="text-danger">*</sup>
                            </label>
                            <input
                                type="text"
                                name="area"
                                className="form-control"
                                value={formData.area}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        {/* PINCODE */}
                        <div className="col-md-6">
                            <label className="form-label">
                                PinCode <sup className="text-danger">*</sup>
                            </label>
                            <input
                                type="text"
                                name="pinCode"
                                maxLength="6"
                                className="form-control"
                                value={formData.pinCode}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        {/* STATUS */}
                        <div className="col-md-6 d-flex align-items-center mt-4">
                            <div className="form-check">
                                <input
                                    type="checkbox"
                                    name="isActive"
                                    className="form-check-input"
                                    checked={formData.isActive}
                                    onChange={handleChange}
                                />
                                <label className="form-check-label ms-2">
                                    Active
                                </label>
                            </div>
                        </div>

                        {/* BUTTON */}
                        <div className="col-md-12">
                            <button
                                type="submit"
                                className="btn btn-primary"
                                disabled={isLoading}
                            >
                                {isLoading ? "Updating..." : "Update PinCode"}
                            </button>
                        </div>

                    </form>
                )}
            </div>
        </>
    );
};

export default EditPinCode;
