import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import * as XLSX from "xlsx";

const AllPinCode = () => {
    const [pinCodes, setPinCodes] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [fileName, setFileName] = useState("");
    const [excelData, setExcelData] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [file, setFile] = useState(null);
    const [excelLoading, setExcelLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);
    const [totalPages, setTotalPages] = useState(1);
    const AdminData = JSON.parse(sessionStorage.getItem("AdminData"))

    const hasAccessAdd = (module) => {
        return (
            AdminData?.role === "Admin" ||
            AdminData?.permissions?.[module]?.write === true
        );
    };

    const hasAccessDelete = (module) => {
        return (
            AdminData?.role === "Admin" ||
            AdminData?.permissions?.[module]?.delete === true
        );
    };

    const hasAccessEdit = (module) => {
        return (
            AdminData?.role === "Admin" ||
            AdminData?.permissions?.[module]?.update === true
        );
    };
    /* ================= FETCH ================= */
    const fetchPinCodes = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get(
                `https://api.cakenpetals.com/api/pincode/get-All-PinCodesWith-Pagination?page=${currentPage}&limit=${itemsPerPage}`
            );
            setIsLoading(false);
            setPinCodes(response?.data?.pinCodes || []);
            setTotalPages(response?.data?.pagination?.totalPages || 1);
        } catch (error) {
            setIsLoading(false);
            toast.error("Failed to fetch pin codes!");
        } finally {
            setIsLoading(false);
        }
    };
    useEffect(() => {
        fetchPinCodes();
    }, [currentPage, itemsPerPage]);

    /* ================= DELETE ================= */
    const handleDelete = async (id) => {
        const confirm = await Swal.fire({
            title: "Are you sure?",
            text: "This pin code will be deleted!",
            icon: "warning",
            showCancelButton: true,
        });

        if (confirm.isConfirmed) {
            try {
                await axios.get(
                    `https://api.cakenpetals.com/api/pincode/delete-Pincode/${id}`
                );
                setPinCodes((prev) => prev.filter((item) => item?._id !== id));
                toast.success("PinCode deleted successfully!");
            } catch {
                toast.error("Failed to delete pin code!");
            }
        }
    };

    /* ================= SEARCH ================= */
    const filteredPinCodes = pinCodes.filter(
        (item) =>
            item.pinCode?.toString().includes(searchQuery) ||
            item.area?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.stateName?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    /* ================= SAMPLE DOWNLOAD ================= */
    const downloadCSV = () => {
        const link = document.createElement("a");
        link.href = `https://admin.biziffy.com/images/All_PinCode.xlsx`;
        link.download = "All_PinCode.xlsx";
        link.click();
    };

    /* ================= EXCEL UPLOAD ================= */
    const handleFileUpload = (event) => {
        const file = event.target.files?.[0];
        if (!file) return;

        setFileName(file.name);

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = new Uint8Array(e.target.result);
                const workbook = XLSX.read(data, { type: "array" });
                const sheet = workbook.Sheets[workbook.SheetNames[0]];
                const jsonData = XLSX.utils.sheet_to_json(sheet, { defval: "" });
                setExcelData(jsonData);
                toast.success(`${jsonData.length} records ready to import`);
            } catch {
                toast.error("Invalid Excel file");
            }
        };
        reader.readAsArrayBuffer(file);
    };

    /* ================= EXPORT ================= */
    const downloadAllPinCodeCSV = () => {
        if (!pinCodes.length) {
            toast.error("No data to export");
            return;
        }

        const exportData = pinCodes.map((p) => ({
            "State Name": p.stateName,
            "Area Name": p.area,
            "Pin Code": p.pinCode,
            Status: p.isActive ? "Active" : "Inactive",
        }));

        const worksheet = XLSX.utils.json_to_sheet(exportData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "PinCodes");
        XLSX.writeFile(workbook, "All_PinCodes.xlsx");
    };


    const handleSubmitExcel = async () => {
        if (!excelData || excelData.length === 0) {
            toast({
                variant: "destructive",
                title: "No Data",
                description: "Please upload a valid Excel file first.",
            });
            return;
        }

        setExcelLoading(true);
        try {
            const response = await axios.post("https://api.cakenpetals.com/api/pincode/create-pincode-by-excel", excelData);
            console.log("response:==>", response)
            const { status, createdCount, duplicateCount, invalidCount, invalid = [] } = response || {};

            if (status) {
                let description = "";
                if (createdCount > 0) description += `${createdCount} created. `;
                if (duplicateCount > 0) description += `${duplicateCount} duplicates skipped. `;
                if (invalidCount > 0) description += `${invalidCount} invalid entries.`;

                toast({
                    title: "Upload Completed",
                    description,
                });

                setExcelData([]);
                setFileName("");
                setFile(null);
                fetchPinCodes(searchTerm, currentPage);

                // Clear file input
                const fileInput = document.getElementById("excel-file");
                if (fileInput) fileInput.value = "";
            } else {
                toast({
                    variant: "destructive",
                    title: "Upload Failed",
                    description: response?.data?.message || "Something went wrong.",
                });
            }
        } catch (error) {
            console.error("Excel submission failed:", error);
            toast({
                variant: "destructive",
                title: "Error",
                description: error?.response?.data?.message || "An unexpected error occurred.",
            });
        } finally {
            setExcelLoading(false);
        }
    };
    const handleStatusChange = async (productId, status) => {
        try {
            const data = {
                productId,
                status
            }
            const response = await axios.post(`https://api.cakenpetals.com/api/pincode/change-status`, data);
            fetchPinCodes(searchTerm, currentPage);
        } catch (error) {
            toast.error("Failed to fetch pin codes!");
        }
    }

    const handleDeleveryTimeChange = async (productId, status) => {

        try {
            const data = {
                productId,
                status
            }

            const response = await axios.post(`https://api.cakenpetals.com/api/pincode/change-delevery-time-status`, data);
            fetchPinCodes(searchTerm, currentPage);
        } catch (error) {
            toast.error("Failed to fetch pin codes!");
        }
    }
    return (
        <>
            <ToastContainer />

            {/* HEADER */}
            <div className="bread d-flex justify-content-between align-items-center mb-3">
                <h4>All PinCode List</h4>

                <div className="d-flex flex-wrap align-items-center gap-2">

                    {/* Sample Download */}
                    {hasAccessAdd('pincode') && <button
                        onClick={downloadCSV}
                        className="btn btn-outline-primary btn-sm d-flex align-items-center"
                    >
                        <i className="fa-solid fa-download me-2"></i>
                        Sample
                    </button>}

                    {/* Upload Excel */}
                    {hasAccessAdd('pincode') && <label className="btn btn-outline-secondary btn-sm mb-0 d-flex align-items-center">
                        <i className="fa-solid fa-upload me-2"></i>
                        Upload Excel
                        <input
                            type="file"
                            accept=".xlsx,.xls"
                            hidden
                            onChange={handleFileUpload}
                        />
                    </label>}

                    {/* Export */}
                    <button
                        onClick={downloadAllPinCodeCSV}
                        className="btn btn-success btn-sm d-flex align-items-center"
                    >
                        <i className="fa-solid fa-file-export me-2"></i>
                        Export
                    </button>

                    {/* Add New */}
                    {hasAccessAdd('pincode') &&
                        <Link
                            to="/add-pincode"
                            className="btn btn-primary btn-sm d-flex align-items-center"
                        >
                            <i className="fa-solid fa-plus me-2"></i>
                            Add New
                        </Link>}

                </div>

                {/* Selected File Info */}
                {fileName && (
                    <div className="mt-2">
                        <div className="alert alert-info py-2 px-3 d-flex justify-content-between align-items-center">
                            <div>
                                📄 <strong>{fileName}</strong>
                                {excelData.length > 0 && (
                                    <span className="ms-2 badge bg-success">
                                        {excelData.length} records found
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Import Button */}
                {excelData.length > 0 && (
                    <div className="mt-2">
                        <button
                            onClick={handleSubmitExcel}
                            disabled={excelLoading}
                            className="btn btn-warning btn-sm"
                        >
                            {excelLoading
                                ? "Processing..."
                                : `Import ${excelData.length} Records`}
                        </button>
                    </div>
                )}

            </div>

            {/* SEARCH */}
            <div className="mb-3">
                <input
                    type="text"
                    className="form-control"
                    placeholder="Search by state, area, pin..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            {/* TABLE */}
            <table className="table table-bordered table-hover">
                <thead className="table-dark">
                    <tr>
                        <th>S No</th>
                        <th>State</th>
                        <th>Area</th>
                        <th>Pin Code</th>
                        <th>Deleverd</th>
                        <th>30 to 60 min. Deleverd</th>
                        {(hasAccessDelete('pincode') || hasAccessEdit('pincode')) && <th>Actions</th>}
                    </tr>
                </thead>
                <tbody>
                    {isLoading ? (
                        <tr>
                            <td colSpan="6" className="text-center">
                                Loading...
                            </td>
                        </tr>
                    ) : filteredPinCodes.length === 0 ? (
                        <tr>
                            <td colSpan="6" className="text-center">
                                No PinCodes found.
                            </td>
                        </tr>
                    ) : (
                        filteredPinCodes.map((item, index) => (
                            <tr key={item._id}>
                                <td>{index + 1}</td>
                                <td>{item.stateName}</td>
                                <td>{item.area}</td>
                                <td>{item.pinCode}</td>
                                <td><input
                                    type="checkbox"
                                    name="FeaturedProducts"
                                    className="form-check-input me-2"
                                    disabled={!hasAccessEdit('pincode')}
                                    checked={item?.deleveryStatus}
                                    onChange={(e) => handleStatusChange(item?._id, e.target.checked)} />
                                </td>
                                <td><input
                                    type="checkbox"
                                    name="FeaturedProducts"
                                    className="form-check-input me-2"
                                    checked={item?.deleveryTime}
                                    disabled={!hasAccessEdit('pincode')}
                                    onChange={(e) => handleDeleveryTimeChange(item?._id, e.target.checked)} />
                                </td>
                                {/* <td>
                                    <span
                                        className={`badge ${item.isActive ? "bg-success" : "bg-danger"
                                            }`}
                                    >
                                        {item.isActive ? "Active" : "Inactive"}
                                    </span>
                                </td> */}
                                <td>
                                    {hasAccessEdit('pincode') && <Link
                                        to={`/edit-pincode/${item?._id}`}
                                        className="btn btn-sm btn-warning me-2"
                                    >
                                        Edit
                                    </Link>}
                                    {hasAccessDelete('pincode') && <button
                                        onClick={() => handleDelete(item?._id)}
                                        className="btn btn-sm btn-danger"
                                    >
                                        Delete
                                    </button>}
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>

            {/* PAGINATION */}
            {totalPages > 1 && (
                <div className="d-flex justify-content-center gap-2 mt-3">
                    <button
                        className="btn btn-outline-primary"
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage((prev) => prev - 1)}
                    >
                        Previous
                    </button>

                    <span className="btn btn-primary disabled">
                        Page {currentPage} of {totalPages}
                    </span>

                    <button
                        className="btn btn-outline-primary"
                        disabled={currentPage === totalPages}
                        onClick={() => setCurrentPage((prev) => prev + 1)}
                    >
                        Next
                    </button>
                </div>
            )}
        </>
    );
};

export default AllPinCode;
