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
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Modal from '@mui/material/Modal';
import Badge from "@mui/material/Badge";
import Checkbox from "@mui/material/Checkbox";

// Material Dashboard 2 PRO React components
import MDBox from "components/MDBox";
import MDButton from "components/MDButton";
import MDTypography from "components/MDTypography";

// Material Dashboard 2 PRO React examples
import DataTable from "examples/Tables/DataTable";
import { Autocomplete, CardContent, Typography, Tooltip, IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import MultiSelectDataTable from "examples/Tables/MultiSelectDataTable";

const ModalAddressSelect = ({addressTypes, statusOptions, addresses, setAddresses, moduleaddresses, selectedId, setSelectedId }) => {
  const [open, setOpen] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [indexAddr, setIndexAddr] = useState(0);

  const removeAddress = (index) => {
    const updatedAddresses = [...addresses];
    updatedAddresses.splice(index, 1);
    setAddresses(updatedAddresses);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const addressHandler = () => {
    // setAddresses([...addresses, newAddress]);
    const filteredAddresses = moduleaddresses.filter(address => selectedRows.includes(address.id));
    setAddresses(filteredAddresses);
    setOpen(false);
  };

  const getRows = (info) => {
    let updatedInfo = info.map((row, index) => {
      const address_type = addressTypes.find((address) => address.id === row?.AddressType?.address_type_id);
      const status_option = statusOptions.find((status) => status.id === row?.StatusType?.status_type_id);
      return {
        type: "addresses",
        id: index,
        street_address1: row.street_address1,
        street_address2: row.street_address2,
        city: row.city,
        state: row.state,
        country: row.country,
        postal_code: row.postal_code,
        latitude: row.latitude,
        longitude: row.longitude,
        address_type_id: address_type?.attributes?.type_name,
        status_type_id: (
            <Badge
              color={status_option?.attributes?.BadgeDetail?.color || 'primary'}
              variant={status_option?.attributes?.BadgeDetail?.variant}
              badgeContent={status_option?.attributes?.StatusType?.status_name}
              style={{marginLeft: '15px'}}
            >
            </Badge>
        ),
        isSelected: index === selectedId,
      };
    });
    return updatedInfo;
  };

  const dataTableData = {
    columns: [
      {
        Header: "Default",
        disableSortBy: true,
        accessor: "",
        Cell: (info) => {
          return (
            <Checkbox checked={info.cell.row.original.isSelected} onChange={() => handleCheckboxChange(info.cell.row.original.id)} />
          );
        },
      },
      { Header: "Status", accessor: "status_type_id", width: "10%" },
      { Header: "Type", accessor: "address_type_id", width: "10%" },
      { Header: "Street Address1", accessor: "street_address1", width: "15%" },
      { Header: "Street Address2", accessor: "street_address2", width: "15%" },
      { Header: "City", accessor: "city", width: "10%" },
      { Header: "State", accessor: "state", width: "10%" },
      { Header: "Country", accessor: "country", width: "10%" },
      { Header: "Postal Code", accessor: "postal_code", width: "10%" },
      { Header: "Lattitude", accessor: "latitude", width: "5%" },
      { Header: "Longitude", accessor: "longitude", width: "5%" },
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

    rows: getRows(addresses),
  };

  const handleCheckboxChange = (id) => {
    const updatedAddresses = addresses.map((address) => ({
      ...address,
      isSelected: address.id === id, // Set isSelected to true for the selected row
    }));
    setAddresses(updatedAddresses); // Update the addresses state with the selected row
    setSelectedId(id); // Update selectedId state with the selected row ID
  };


  return (
    <Card>
        <MDBox display="flex" flexDirection="column" px={3} my={2}>
            <MDBox display="flex" flexDirection="column" style={{marginTop: "1rem"}}>
                <MDBox
                    display="flex"
                >
                    <MDTypography variant="h5" color="secondary"  fontWeight="bold">
                    Addresses
                    </MDTypography>
                    <MDButton variant="gradient" color="dark" size="small" style={{marginLeft: "1rem"}} onClick={handleOpen}>Select Address</MDButton>
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
                        <Typography>Select Address</Typography>
                        <MultiSelectDataTable rowData={moduleaddresses} selectedRows={selectedRows} setSelectedRows={setSelectedRows}/>
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
              {addresses.length > 0 && (
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

export default ModalAddressSelect;
