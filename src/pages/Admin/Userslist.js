import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import Layout from "../../components/Layout";
import { showLoading, hideLoading } from "../../redux/alertsSlice";
import axios from "axios";
import {toast} from 'react-hot-toast'
import { Table } from "antd";
import moment from "moment";

function Userslist() {
  const [users, setUsers] = useState([]);
  const dispatch = useDispatch();
  const getUsersData = async () => {
    try {
      dispatch(showLoading());
      const resposne = await axios.get("/api/admin/get-all-users", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      dispatch(hideLoading());
      if (resposne.data.success) {
        setUsers(resposne.data.data);
      }
    } catch (error) {
      dispatch(hideLoading());
    }
  };

  const changeUserStatus = async (record, status) => {
    try {
      dispatch(showLoading());
      const resposne = await axios.post(
        "/api/admin/change-doctor-account-status",
        { usersId: record._id, userId: record.userId, status: status },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      dispatch(hideLoading());
      if (resposne.data.success) {
        toast.success(resposne.data.message);
        getUsersData();
      }
    } catch (error) {
      toast.error('Error in Deleting User');
      dispatch(hideLoading());
    }
  };

  useEffect(() => {
    getUsersData();
  }, []);

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
    },
    {
      title: "Email",
      dataIndex: "email",
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      render: (record , text) => moment(record.createdAt).format("DD-MM-YYYY"),
    },
    {
      title: "status",
      dataIndex: "status",
    },
    {
      title: "Actions",
      dataIndex: "actions",
      render: (text, record) => (
        <div className="d-flex">
          
          <h1 className="anchor"
          onClick={()=>changeUserStatus(record,"blocked")} >Delete</h1>
        </div>
      ),
    },
  ];

  return (
    <Layout>
      <h1 className="page-header">Users List</h1>
      <hr />
      <Table columns={columns} dataSource={users}/>
    </Layout>
  );
}

export default Userslist;
