/**
=========================================================
* Material Dashboard 2 PRO React - v2.1.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-pro-react
* Copyright 2022 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

// @mui material components
import Card from "@mui/material/Card";

// Material Dashboard 2 PRO React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDAlert from "components/MDAlert";

// Material Dashboard 2 PRO React examples
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import DataTable from "examples/Tables/DataTable";
import MDButton from "components/MDButton";
import { Tooltip, IconButton } from "@mui/material";

import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

import CrudService from "services/cruds-service";
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AbilityContext, Can } from "Can";
import { useAbility } from "@casl/react";
import getId from "services/helper-service";

function MessageTemplate() {
  let { state } = useLocation();

  const navigate = useNavigate();
  const ability = useAbility(AbilityContext);
  const [data, setData] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [notification, setNotification] = useState({
    value: false,
    text: "",
  });

  useEffect(() => {
    (async () => {
      const response = await CrudService.getMessages();
      setData(response.data);
    })();
    document.title = `RIVIO | Message Template`;
  }, []);

  useEffect(() => {
    setTableData(getRows(data));
  }, [data]);

  useEffect(() => {
    if (!state) return;
    setNotification({
      value: state.value,
      text: state.text,
    });
  }, [state]);

  useEffect(() => {
    if (notification.value === true) {
      let timer = setTimeout(() => {
        setNotification({
          value: false,
          text: "",
        });
      }, 5000);
    }
  }, [notification]);

    const clickAddHandler = () => {
        navigate("/message-management/new-message");
    };

    const clickEditHandler = (id) => {
        navigate(`/message-management/edit-message/${id}`);
    };

    const clickDeleteHandler = async (e, id) => {
        try {
            if (!confirm("Are you sure you want to delete this message?")) {
                e.nativeEvent.stopImmediatePropagation();
            } else {
                await CrudService.deleteMessage(id);
                // the delete does not send a response
                // so I need to get again the categories to set it and this way the table gets updated -> it goes to the useEffect with data dependecy
                const response = await CrudService.getMessages();
                setData(response.data);
                setNotification({
                    value: true,
                    text: "The message has been successfully deleted",
                });
            }
        } catch (err) {
            // it sends error is the message is associated with an message
            console.error(err);
            if (err.hasOwnProperty("errors")) {
                setNotification({
                    value: true,
                    text: err.errors[0].title,
                });
            }
            return null;
        }
    };

  const getRows = (info) => {
    let updatedInfo = info.map((row) => {
      return {
        id: row.attributes.id,
        name: row.attributes.name,
        content: row.attributes.content,
      };
    });
    return updatedInfo;
  };

  const dataTableData = {
    columns: [
        { Header: "ID", accessor: "id" },
        { Header: "Name", accessor: "name", width: "35%" },
        { Header: "Content", accessor: "content", width: "35%" },
        {
            Header: "actions",
            disableSortBy: true,
            accessor: "",
            Cell: (info) => {
              return (
                <MDBox display="flex" alignItems="center">
                    <Tooltip title="Edit Message">
                      <IconButton onClick={() => clickEditHandler(info.cell.row.original.id)}>
                        <MDTypography><EditIcon /></MDTypography>
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete Message">
                      <IconButton onClick={(e) => clickDeleteHandler(e, info.cell.row.original.id)}>
                        <MDTypography><DeleteIcon /></MDTypography>
                      </IconButton>
                    </Tooltip>
                </MDBox>
              );
            },
          },
    ],

    rows: tableData,
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      {notification.value && (
        <MDAlert color="info" my="20px">
          <MDTypography variant="body2" color="white">
            {notification.text || ""}
          </MDTypography>
        </MDAlert>
      )}
      <MDBox pt={6} pb={3}>
        <MDBox mb={3}>
          <Card>
            <MDBox p={3} lineHeight={1} display="flex" justifyContent="space-between">
              <MDTypography variant="h5" fontWeight="medium">
                Message Management
              </MDTypography>

            <MDButton
                variant="gradient"
                color="dark"
                size="small"
                type="submit"
                onClick={clickAddHandler}
            >
                + Add Message
            </MDButton>
            </MDBox>
            <DataTable table={dataTableData} canSearch={true} />
          </Card>
        </MDBox>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default MessageTemplate;
