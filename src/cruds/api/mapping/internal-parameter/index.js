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

import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

// @mui material components
import Card from "@mui/material/Card";
import Badge from "@mui/material/Badge";
import Modal from "@mui/material/Modal";

// Material Dashboard 2 PRO React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// Material Dashboard 2 PRO React examples
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import DataTable from "examples/Tables/DataTable";
import MDAlert from "components/MDAlert";
import { Tooltip, IconButton, CardContent, Typography } from "@mui/material";

import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

import CrudService from "services/cruds-service";
import { AbilityContext } from "Can";
import { useAbility } from "@casl/react";
import MDButton from "components/MDButton";
import { useNavigate } from "react-router-dom";

function InternalParameterManagement() {
    const navigate = useNavigate();
    let { state } = useLocation();
    const ability = useAbility(AbilityContext);
    const [data, setData] = useState([]);
    const [mapData, setMapData] = useState([]);
    const [tableData, setTableData] = useState([]);
    const [notification, setNotification] = useState({
        value: false,
        text: "",
    });
    const [openModal, setOpenModal] = useState(false);

    useEffect(() => {
        (async () => {
            const response = await CrudService.getInternalParameters();
            setData(response.data);
            console.log(response.data, 'response.data')
        })();
        document.title = `RIVIO | Internal Parameters`;
    }, []);

    useEffect(() => {
        if (!state) return;
        setNotification({
            value: state.value,
            text: state.text,
        });
    }, [state]);

    useEffect(() => {
        setTableData(getRows(data));
    }, [data]);

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

    const clickDeleteHandler = async (e, id) => {
        try {
          if (!confirm("Are you sure you want to delete this company?")) {
            e.nativeEvent.stopImmediatePropagation();
          } else {
            await CrudService.deleteInternalParameter(id);
            // the delete does not send a response
            // so I need to get again the companies to set it and this way the table gets updated -> it goes to the useEffect with data dependecy
            const response = await CrudService.getInternalParameters();
            setData(response.data);
            setNotification({
              value: true,
              text: "The Internal Paramter has been successfully deleted",
            });
          }
        } catch (err) {
          // it sends error is the company is associated with an item
          console.error(err);
          console.log(err.errors[0].detail, 'error')
          if (err.hasOwnProperty("errors")) {
            setNotification({
              value: true,
              text: err.errors[0].detail,
            });
          }
          return null;
        }
      };
    

    const handleClose = () => {
        setOpenModal(false);
    };

    const clickAddHandler = () => {
        navigate("/internal-parameter-management/new-parameter");
    };

    const clickEditHandler = (id) => {
        navigate(`/internal-parameter-management/edit-parameter/${id}`);
    };
    

    const getRows = (info) => {
        let updatedInfo = info.map((row) => {      
            console.log(row, '____')
            return {
                type: "parameters",
                id: row.parameter_id,
                api_name: row.ApiName?.api_name,
                paramname: row?.parameter_name,
                type: row?.DeviceParameterType.type_name,
                label: row?.label,
                tooltip: row?.tooltip,
                isThreRequired: row?.is_threshold_required ? 'True' : 'False'
            };
        });
        return updatedInfo;
    };

  const dataTableData = {
    columns: [
      { Header: "Internal Parameter ID", accessor: "id" },
      { Header: "API Name", accessor: "api_name" },
      { Header: "Parameter Name", accessor: "paramname"},
      { Header: "Label", accessor: "label"},
      { Header: "Tool Tip", accessor: "tooltip"},
      { Header: "Type", accessor: "type"},
      { Header: "Threshold Allowed", accessor: "isThreRequired"},
      {
        Header: "actions",
        disableSortBy: true,
        accessor: "",
        Cell: (info) => {
            return (
                <MDBox display="flex" alignItems="center">
                    {ability.can("edit", "devices") && (
                        <Tooltip title="Edit Parameter">
                            <IconButton onClick={(e) => clickEditHandler(info.cell.row.original.id)}>
                                <MDTypography><EditIcon /></MDTypography>
                            </IconButton>
                        </Tooltip>
                    )}    
                    {ability.can("delete", "devices") && (
                        <Tooltip title="Delete Parameter">
                            <IconButton onClick={(e) => clickDeleteHandler(e, info.cell.row.original.id)}>
                                <MDTypography><DeleteIcon /></MDTypography>
                            </IconButton>
                        </Tooltip>
                    )}    
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
                    Internal Parameter Management
                </MDTypography>
                {ability.can("create", "devices") && (
                    <MDButton
                        variant="gradient"
                        color="dark"
                        size="small"
                        type="submit"
                        onClick={clickAddHandler}
                    >
                    + Add Company
                    </MDButton>
                )}
            </MDBox>
            
            <DataTable table={dataTableData} canSearch={true}/>
            {/* <MultiSelectDataTable rowData={getRows(data)} selectedRows={selectedRows} setSelectedRows={setSelectedRows}/> */}
            
          </Card>
        </MDBox>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default InternalParameterManagement;
