import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FiUserPlus, FiUserMinus, FiSearch, FiRefreshCw } from "react-icons/fi";
import getAllUsers from "../../api/getAllUsers";
import changeUserRole from "../../api/changeUserRole";
import { useMyContext } from "../../context";

const ManageAdmins = () => {
  // States for users and admins
  const [users, setUsers] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userSearch, setUserSearch] = useState("");
  const [adminSearch, setAdminSearch] = useState("");
  const [processingUser, setProcessingUser] = useState(null);
  const { accessToken } = useMyContext();

  // Change role function
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await getAllUsers(accessToken);

        // Destructure the data from the response
        const { users = [], admins = [], counts = {} } = response;

        // Set the states with the fetched data
        setUsers(users);
        setAdmins(admins);
      } catch (error) {
        console.error("Error fetching users and admins:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleUserPromotion = async (newRole) => {
    const result = await changeUserRole(accessToken, newRole);
    if (result.status === "failed") {
      console.log(result.message);
    }
  }

  // Filter users and admins based on search
  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(userSearch.toLowerCase()) ||
      user.email.toLowerCase().includes(userSearch.toLowerCase())
  );

  const filteredAdmins = admins.filter(
    (admin) =>
      admin.name.toLowerCase().includes(adminSearch.toLowerCase()) ||
      admin.email.toLowerCase().includes(adminSearch.toLowerCase())
  );

  const itemVariants = {
    hidden: { y: 10, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
      },
    },
  };

  // Handler for refreshing data (to be implemented with actual API)
  const handleRefresh = () => {
    setLoading(true);
    // Simulating API call
    setTimeout(() => {
      setLoading(false);
    }, 800);

    // Replace with actual API call later
    // fetchData();
  };

  // Render the user card
  const UserCard = ({ user }) => (
    <motion.div
      variants={itemVariants}
      className="bg-light rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
    >
      <div className="p-4 flex justify-between items-center">
        <div>
          <h3 className="font-medium text-gray-800">{user.name}</h3>
          <p className="text-sm text-gray-500">{user.email}</p>
          <p className="text-xs text-gray-400 mt-1">
            Joined: {new Date(user.createdAt).toLocaleDateString()}
          </p>
        </div>
        <motion.button
          whileTap={{ scale: 0.95 }}
          className={`flex items-center gap-1 px-3 py-2 rounded-md ${
            processingUser === user._id
              ? "bg-blue-200 text-blue-700 cursor-wait"
              : "bg-blue-500 text-white hover:bg-blue-600"
          }`}
          onClick={() => handleUserPromotion("admin")}
          disabled={processingUser === user._id}
        >
          {processingUser === user._id ? (
            <>
              <motion.span
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1 }}
              >
                <FiRefreshCw className="mr-1" />
              </motion.span>
              Processing
            </>
          ) : (
            <>
              <FiUserPlus className="mr-1" />
              Make Admin
            </>
          )}
        </motion.button>
      </div>
    </motion.div>
  );

  // Render the admin card
  const AdminCard = ({ admin }) => (
    <motion.div
      variants={itemVariants}
      className="bg-blue-50 border border-blue-100 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
    >
      <div className="p-4 flex justify-between items-center">
        <div>
          <div className="flex items-center">
            <h3 className="font-medium text-gray-800">{admin.name}</h3>
            <span className="ml-2 px-2 py-0.5 text-xs bg-blue-100 text-blue-800 rounded-full">
              Admin
            </span>
          </div>
          <p className="text-sm text-gray-500">{admin.email}</p>
          <p className="text-xs text-gray-400 mt-1">
            Admin since: {new Date(admin.createdAt).toLocaleDateString()}
          </p>
        </div>
        <motion.button
          whileTap={{ scale: 0.95 }}
          className={`flex items-center gap-1 px-3 py-2 rounded-md ${
            processingUser === admin._id
              ? "bg-red-200 text-red-700 cursor-wait"
              : "bg-red-500 text-white hover:bg-red-600"
          }`}
          onClick={() => handleUserPromotion("user")}
          disabled={processingUser === admin._id}
        >
          {processingUser === admin._id ? (
            <>
              <motion.span
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1 }}
              >
                <FiRefreshCw className="mr-1" />
              </motion.span>
              Processing
            </>
          ) : (
            <>
              <FiUserMinus className="mr-1" />
              Remove Admin
            </>
          )}
        </motion.button>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen pt-20 bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white shadow rounded-lg mb-8 p-6"
        >
          <h1 className="text-2xl font-bold text-gray-900">Admin Management</h1>
          <p className="mt-1 text-gray-600">
            Manage your application's admin users and permissions
          </p>
          <div className="mt-4 flex justify-between">
            <p className="text-sm text-gray-500">
              <span className="font-medium">{users.length}</span> Regular Users
              <span className="font-medium ml-1">{admins.length}</span> Admins
            </p>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handleRefresh}
              disabled={loading}
              className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900"
            >
              <motion.span
                animate={loading ? { rotate: 360 } : {}}
                transition={{ repeat: loading ? Infinity : 0, duration: 1 }}
              >
                <FiRefreshCw />
              </motion.span>
              Refresh
            </motion.button>
          </div>
        </motion.div>

        {/* Main content grid */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {/* Users Section */}
          <div>
            <div className="mb-4 flex justify-between items-center">
              <h2 className="text-xl font-medium text-gray-900">
                Regular Users
              </h2>
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search users..."
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="bg-white rounded-lg shadow-md overflow-hidden h-24 animate-pulse"
                  >
                    <div className="p-4 flex justify-between items-center">
                      <div className="space-y-2">
                        <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                        <div className="h-2 bg-gray-200 rounded w-1/4"></div>
                      </div>
                      <div className="h-8 bg-gray-200 rounded w-24"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredUsers.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-white p-8 rounded-lg shadow-md text-center"
              >
                <p className="text-gray-500">No users found</p>
                {userSearch && (
                  <p className="text-sm text-gray-400 mt-1">
                    Try adjusting your search term
                  </p>
                )}
              </motion.div>
            ) : (
              <motion.div
                initial="hidden"
                animate="visible"
                className="space-y-4"
              >
                {filteredUsers.map((user) => (
                  <UserCard key={user._id} user={user} />
                ))}
              </motion.div>
            )}
          </div>

          {/* Admins Section */}
          <div>
            <div className="mb-4 flex justify-between items-center">
              <h2 className="text-xl font-medium text-gray-900">
                Administrators
              </h2>
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search admins..."
                  value={adminSearch}
                  onChange={(e) => setAdminSearch(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {loading ? (
              <div className="space-y-4">
                {[1, 2].map((i) => (
                  <div
                    key={i}
                    className="bg-blue-50 rounded-lg shadow-md overflow-hidden h-24 animate-pulse"
                  >
                    <div className="p-4 flex justify-between items-center">
                      <div className="space-y-2">
                        <div className="h-4 bg-blue-200 rounded w-1/3"></div>
                        <div className="h-3 bg-blue-200 rounded w-1/2"></div>
                        <div className="h-2 bg-blue-200 rounded w-1/4"></div>
                      </div>
                      <div className="h-8 bg-blue-200 rounded w-28"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredAdmins.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-blue-50 p-8 rounded-lg shadow-md text-center"
              >
                <p className="text-gray-500">No administrators found</p>
                {adminSearch && (
                  <p className="text-sm text-gray-400 mt-1">
                    Try adjusting your search term
                  </p>
                )}
              </motion.div>
            ) : (
              <motion.div
                initial="hidden"
                animate="visible"
                className="space-y-4"
              >
                {filteredAdmins.map((admin) => (
                  <AdminCard key={admin._id} admin={admin} />
                ))}
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageAdmins;
