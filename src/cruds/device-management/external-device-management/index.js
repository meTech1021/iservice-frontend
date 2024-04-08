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

import SyncIcon from '@mui/icons-material/Sync';

import CrudService from "services/cruds-service";
import { AbilityContext } from "Can";
import { useAbility } from "@casl/react";
import MapDevice from "./map-device";
import MultiSelectDataTable from "examples/Tables/MultiSelectDataTable";

function ExternalDeviceManagement() {
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
  const [selectedRows, setSelectedRows] = useState([]);

  useEffect(() => {
    (async () => {
      const response = await CrudService.getExternalDevices();
      setData(response.data);
    })();
    document.title = `RIVIO | External Devices`;
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

  const clickSyncHandler = (id) => {
    // navigate(`/external-device-management/edit-device/${id}`);
    const deviceData = data.find((item) => item.device_id === id);
    setMapData(deviceData);
    setOpenModal(true);
  };

  const handleClose = () => {
    setOpenModal(false);
  };

  const getRows = (info) => {
    let updatedInfo = info.map((row) => {
      let color = row?.status_type_id === 19 ? 'success' : 'info';
      let variant = row?.status_type_id === 19 ? 'gradient' : 'contained';
      let badgeContent = row?.status_type_id === 19 ? 'Mapped' : 'Not Mapped';
      
      return {
        type: "devices",
        id: row.device_id,
        devicename: row?.title,
        map_status: (
          <Badge
            color={color}
            variant={variant}
            badgeContent={badgeContent}
            style={{ display: 'inline-block', whiteSpace: 'nowrap', marginLeft: "20px" }}
          >
          </Badge>
        ),
        status_type_id: row?.status_type_id,
        status: row?.status,
        version: row?.version,
        lng: row?.lng,
        address: row?.address,
        units: row?.units,
        reported: row?.reported,
        tx_reported: row?.tx_reported,
        last_updated_on: row?.last_updated_on,
        wifi_signal: row?.wifi_signal,
        tx_signal: row?.tx_signal,
        is_premium: row?.is_premium,
        percent_level: row?.device_data?.percent_level,
        battery_voltage: row?.device_data?.battery_voltage,
        battery_status: row?.device_data?.battery_status,
        volume_level: row?.device_data?.volume_level,
        inch_level: row?.device_data?.inch_level,
        depth: row?.device_setup?.depth,
        power_x: row?.device_setup?.power_x,
        power_y: row?.device_setup?.power_y,
        power_z: row?.device_setup?.power_z,
        shape: row?.device_setup?.shape,
        diameter: row?.device_setup?.diameter,
        length: row?.device_setup?.length,
      };
    });
    return updatedInfo;
  };

  const dataTableData = {
    columns: [
      { Header: "External Device ID", accessor: "id" },
      { Header: "Status", accessor: "status" },
      { Header: "Map Status", accessor: "map_status" },
      { Header: "Device Name", accessor: "devicename"},
      { Header: "Version", accessor: "version" },
      { Header: "Latitude", accessor: "lat" },
      { Header: "Longitude", accessor: "lng" },
      { Header: "Address", accessor: "address" },
      { Header: "Units", accessor: "units" },
      { Header: "reported", accessor: "reported" },
      { Header: "tx_reported", accessor: "tx_reported" },
      { Header: "last_updated_on", accessor: "last_updated_on" },
      { Header: "wifi_signal", accessor: "wifi_signal" },
      { Header: "tx_signal", accessor: "tx_signal" },
      { Header: "is_premium", accessor: "is_premium" },
      { Header: "Percent Level", accessor: "percent_level" },
      { Header: "Battery Voltage", accessor: "battery_voltage" },
      { Header: "Battery Status", accessor: "battery_status" },
      { Header: "Volume Level", accessor: "volume_level" },
      { Header: "Inch Level", accessor: "inch_level" },
      { Header: "Depth", accessor: "depth" },
      { Header: "Power X", accessor: "power_x" },
      { Header: "Power Y", accessor: "power_y" },
      { Header: "Power Z", accessor: "power_z" },
      { Header: "Shape", accessor: "shape" },
      { Header: "Diameter", accessor: "diameter" },
      { Header: "Length", accessor: "length" },
      {
        Header: "actions",
        disableSortBy: true,
        accessor: "",
        Cell: (info) => {
          return (
            <MDBox display="flex" alignItems="center">
              {ability.can("edit", "devices") && (info.cell.row.original.status_type_id === 20) && (
                <Tooltip title="Sync Devoce">
                  <IconButton onClick={() => clickSyncHandler(info.cell.row.original.id)}>
                    <SyncIcon />
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
            {notification.text}
          </MDTypography>
        </MDAlert>
      )}
      <MDBox pt={6} pb={3}>
        <MDBox mb={3}>
          <Card>
            <MDBox p={3} lineHeight={1} display="flex" justifyContent="space-between">
                <MDTypography variant="h5" fontWeight="medium">
                    Device Management
                </MDTypography>
            </MDBox>
            <Modal  
                open={openModal}
                onClose={handleClose}
                aria-labelledby="modal-title"
                aria-describedby="modal-description"
            >
              <Card
                sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '80%', // Set the desired width here
                    backgroundColor: 'white',
                    boxShadow: 24,
                    p: 4,
                }}
              >
                <CardContent>                 
                  <Typography>Map Device</Typography>
                  <MapDevice setOpen={setOpenModal} mapData={mapData} data={data} setData={setData} />
                </CardContent>
              </Card>
            </Modal>
            <DataTable table={dataTableData} canSearch={true}/>
            {/* <MultiSelectDataTable rowData={getRows(data)} selectedRows={selectedRows} setSelectedRows={setSelectedRows}/> */}
            
          </Card>
        </MDBox>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default ExternalDeviceManagement;
