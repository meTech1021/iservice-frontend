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
import { useNavigate, useLocation } from "react-router-dom";

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
import MDButton from "components/MDButton";
import MDAlert from "components/MDAlert";
import { Tooltip, IconButton } from "@mui/material";

import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from '@mui/icons-material/Visibility';

import CrudService from "services/cruds-service";
import { AbilityContext } from "Can";
import { useAbility } from "@casl/react";
import GoogleMapComponent from "examples/Maps";

function MonitorManagement() {
  let { state } = useLocation();
  const ability = useAbility(AbilityContext);
  const [data, setData] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [notification, setNotification] = useState({
    value: false,
    text: "",
  });
  const [openModal, setOpenModal] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      const response = await CrudService.getDeviceMonitors();
      setData(response.data);
    })();
    document.title = `RIVIO | Internal Device Monitors`;
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

  const clickAddHandler = () => {
    navigate("/monitor-management/new-monitor");
  };

  const clickViewHandler = (id) => {
    navigate(`/monitor-management/view-monitor/${id}`);
  };

  const clickEditHandler = (id) => {
    navigate(`/monitor-management/edit-monitor/${id}`);
  };

  const clickDeleteHandler = async (e, id) => {
    try {
      if (!confirm("Are you sure you want to delete this device?")) {
        e.nativeEvent.stopImmediatePropagation();
      } else {
        await CrudService.deleteDeviceMonitor(id);
        // the delete does not send a response
        // so I need to get again the categories to set it and this way the table gets updated -> it goes to the useEffect with data dependecy
        const response = await CrudService.getDeviceMonitors();
        setData(response.data);
        setNotification({
          value: true,
          text: "The device monitor has been successfully deleted",
        });
      }
    } catch (err) {
      // it sends error is the device is associated with an device
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
      console.log(row, 'row')
      const deviceNames = row.attributes?.devices.map(device => device.Device.name);
      const combinedDeviceNames = deviceNames?.join(', ');
      const count = row.attributes?.devices.length;
      const frequency = 'Every ' + row.attributes?.frequency + ' ' + row.attributes?.time_unit +
      (parseInt(row.attributes?.frequency) > 1 ? '(s)' : '');
      return {
        type: "monitors",
        id: row.id,
        name: row.attributes?.name,
        frequency: frequency,
        count: count,

        status: (
          <Badge
            color={row.attributes?.StatusOption?.BadgeDetail?.color || 'primary'}
            variant={row.attributes?.StatusOption?.BadgeDetail?.variant}
            badgeContent={row.attributes?.StatusOption?.StatusType?.status_name}
            style={{marginLeft: '30px'}}
          >
          </Badge>
        ),
      };
    });
    return updatedInfo;
  };

  const dataTableData = {
    columns: [
      { Header: "ID", accessor: "id", width: "5%" },
      { Header: "Status", accessor: "status", width: "15%" },
      { Header: "Monitor Name", accessor: "name", width: "15%" },
      { Header: "Frequency", accessor: "frequency", width: "15%" },
      { Header: "Count", accessor: "count", width: "15%" },
      {
        Header: "actions",
        disableSortBy: true,
        accessor: "",
        Cell: (info) => {
          return (
            <MDBox display="flex" alignItems="center">
              {ability.can("view", "devices") && (
                <Tooltip title="View Monitor">
                  <IconButton onClick={() => clickViewHandler(info.cell.row.original.id)}>
                    <VisibilityIcon />
                  </IconButton>
                </Tooltip>
              )}
              {ability.can("edit", "devices") && (
                <Tooltip title="Edit Monitor">
                  <IconButton onClick={() => clickEditHandler(info.cell.row.original.id)}>
                    <MDTypography><EditIcon /></MDTypography>
                  </IconButton>
                </Tooltip>
              )}
              {ability.can("delete", "devices") && (
                <Tooltip title="Delete Monitor">
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
                Device Monitor Management
              </MDTypography>

              {ability.can("create", "devices") && (
                <MDButton
                  variant="gradient"
                  color="dark"
                  size="small"
                  type="submit"
                  onClick={clickAddHandler}
                >
                  + Add Device Monitor
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

export default MonitorManagement;
