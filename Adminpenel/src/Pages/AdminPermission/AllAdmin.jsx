import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import RolePermissionModel from "./RolePermissionModel";
import { Link } from "react-router-dom";

const AllAdmin = () => {
  const [users, setUsers] = useState([]);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [roleForm, setRoleForm] = useState({ role: "", permissions: {}, });
  const [editingRole, setEditingRole] = useState(null);

  const modules = [
    { key: "dashboard", name: "Dashboard" },
    { key: "orders", name: "Orders" },
    { key: 'contactQuery', name: 'Contact Query' },
    { key: 'mainCategory', name: 'Main Category' },
    { key: 'category', name: 'Sub Category' },
    { key: 'subCategory', name: 'Child Category' },
    { key: "products", name: "Products" },
    { key: 'recommendedProducts', name: 'Recommended Products' },
    { key: 'recommendedCategory', name: 'Recommended Category' },
    { key: 'size', name: 'Size' },
    { key: 'cakeBanner', name: 'Level Banner' },
    { key: 'banners', name: 'Banner' },
    { key: 'reels', name: 'Reels' },
    { key: 'users', name: 'Users' },
    { key: 'pincode', name: 'Pin Code' },
    { key: 'coupon', name: 'Coupon' },
    { key: 'countdown', name: 'Count Down' },
    { key: 'adminUser', name: 'admin User' },
    { key: 'subscribeEmail', name: 'Subscribe Email' }
  ];
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

  // Fetch users from the API
  const fetchUsers = async () => {
    try {
      const response = await axios.get("https://api.cakenpetals.com/api/get-admin-user");
      if (response.data.success) {
        setUsers(response.data.data); // Save the user data
      } else {
        console.error("Failed to fetch users:", response.data.message);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  // Delete user by ID
  const deleteUser = async (userId) => {
    // SweetAlert2 confirmation
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You will not be able to recover this user!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        const response = await axios.delete(
          `https://api.cakenpetals.com/api/delete-user/${userId}`
        );
        if (response.status === 200) {
          Swal.fire("Deleted!", "The user has been deleted.", "success");
          // Refresh the user list after deletion
          fetchUsers();
        } else {
          Swal.fire("Failed!", response.data.message, "error");
        }
      } catch (error) {
        console.log(error);
        Swal.fire("Error!", "Something went wrong!", "error");
      }
    }
  };

  // Load data on component mount
  useEffect(() => {
    fetchUsers();
  }, []);

  const handlePermission = (user) => {
    setEditingRole(null); // or load role if needed
    setShowRoleModal(true);
    setRoleForm({ _id: user?._id, role: user?.role, permissions: user?.permissions || {}, });
    setEditingRole({ _id: user?._id, role: user?.role, permissions: user?.permissions || {}, });
  };

  return (
    <>
      <div className="bread">
        <div className="head">
          <h4>All Admin</h4>
        </div>
        {hasAccessAdd('adminUser') && <div className="links">
          <Link to="/add-admin" className="add-new">
            Add Admin User
          </Link>
        </div>}

      </div>

      <section className="main-table">
        <div className="table-responsive mt-4">
          <table className="table table-bordered table-striped table-hover">
            <thead>
              <tr>
                <th scope="col">Sr.No.</th>
                <th scope="col">Name</th>
                <th scope="col">Email</th>
                <th scope="col">Role</th>
                {/* <th scope="col">Referral Code </th> */}
                <th scope="col">Join Date</th>
                {(hasAccessDelete('adminUser') || hasAccessEdit('adminUser')) && <th scope="col">Actions</th>}
              </tr>
            </thead>
            <tbody>
              {users.length > 0 ? (
                users.map((user, index) => (
                  <tr key={user._id}>
                    <th scope="row">{index + 1}</th>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.role || "User"}</td>
                    {/* <td>{user?.referralCode || "-"}</td> */}
                    <td>{new Date(user.createdAt).toLocaleString()}</td>
                    <td>
                      <div style={{ gap: 12, display: 'flex' }}>
                        {hasAccessEdit('adminUser') && <button
                          onClick={() => handlePermission(user)}
                          className="bt edit"
                        >
                          Permission <i className="fa-solid fa-user-shield"></i>
                        </button>}
                        {hasAccessDelete('adminUser') && <button
                          onClick={() => deleteUser(user?._id)}
                          className="bt delete"
                        >
                          Delete <i className="fa-solid fa-trash"></i>
                        </button>}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center">
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {showRoleModal && (
          <RolePermissionModel
            showRoleModal={showRoleModal}
            setShowRoleModal={setShowRoleModal}
            fetchRoles={fetchUsers}
            roleForm={roleForm}
            setRoleForm={setRoleForm}
            editingRole={editingRole}
            setEditingRole={setEditingRole}
            modules={modules}
          />
        )}

      </section>
    </>
  );
};

export default AllAdmin;
