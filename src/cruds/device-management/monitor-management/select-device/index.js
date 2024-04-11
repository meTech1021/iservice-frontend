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

import { useState } from "react";

// @mui material components
import Card from "@mui/material/Card";
import Modal from '@mui/material/Modal';

// Material Dashboard 2 PRO React components
import MDBox from "components/MDBox";
import MDButton from "components/MDButton";
import MDTypography from "components/MDTypography";

// Material Dashboard 2 PRO React examples
import DataTable from "examples/Tables/DataTable";
import { CardContent, Typography, Tooltip, IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import DeviceSelectDataTable from "./datatable";

const ModalDeviceSelect = ({devices, device, setDevice }) => {
  const [open, setOpen] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);

  const removeAddress = (index) => {
    setDevice([]);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const addressHandler = () => {
    // setDevices([...Devices, newAddress]);
    const filteredDevices = devices.filter(device => selectedRows.includes(device.id));
    setDevice(filteredDevices);
    setOpen(false);
  };


  const getRows = (info) => {
    let updatedInfo = info.map((row, index) => {
        return {
            type: "devices",
            id: index,
        };
    });
    return updatedInfo;
  };

  const dataTableData = {
    columns: [
      {
        Header: "actions",
        disableSortBy: true,
        accessor: "",
        Cell: (info) => {
          return (
            <MDBox display="flex" alignItems="center">
              {(
                <Tooltip title="Delete Company">
                  <IconButton onClick={() => removeAddress(info.cell.row.original.id)}>
                    <DeleteIcon />
                  </IconButton>
                </Tooltip>
              )}
            </MDBox>
          );
        },
      }
    ],

    rows: getRows(device),
  };

  return (
    <Card>
        <MDBox display="flex" flexDirection="column" px={3} my={2}>
            <MDBox display="flex" flexDirection="column" style={{marginTop: "1rem"}}>
                <MDBox
                    display="flex"
                >
                    <MDTypography variant="h5" color="secondary"  fontWeight="bold">
                    Device
                    </MDTypography>
                    <MDButton variant="gradient" color="dark" size="small" style={{marginLeft: "1rem"}} onClick={handleOpen}>Select Device</MDButton>
                </MDBox>

                <Modal
                    open={open}
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
                        border: '2px solid #000',
                        boxShadow: 24,
                        p: 4,
                    }}
                    >
                    <CardContent>
                        <Typography>Select Device</Typography>
                        <DeviceSelectDataTable rowData={devices} selectedRows={selectedRows} setSelectedRows={setSelectedRows}/>
                        <MDBox ml="auto" mt={3} display="flex" justifyContent="flex-end">
                            <MDButton variant="contained" color="secondary" onClick={handleClose}>
                                Cancel
                            </MDButton>
                            <MDButton variant="contained" color="info" onClick={addressHandler} style={{marginLeft: '10px'}}>
                                Save
                            </MDButton>
                        </MDBox>
                    </CardContent>
                    </Card>
                </Modal>
                
            </MDBox>
            <MDBox>
              {device.length > 0 && (
                <DataTable
                  table={dataTableData}
                  canSearch={true}
                />
              )}
            </MDBox>
        </MDBox>
    </Card>
  );
};

export default ModalDeviceSelect;
