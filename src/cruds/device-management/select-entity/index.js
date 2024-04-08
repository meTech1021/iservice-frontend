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
import EntityAddressItemSelectDataTable from "./datatable";

const ModalEntityAddressItemSelect = ({entityAddressItems, entityAddressItem, setEntityAddressItem }) => {
  const [open, setOpen] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);

  const removeAddress = (index) => {
    setEntityAddressItem([]);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const addressHandler = () => {
    // setAddresses([...addresses, newAddress]);
    const filteredAddresses = entityAddressItems.filter(address => selectedRows.includes(address.id));
    setEntityAddressItem(filteredAddresses);
    setOpen(false);
  };


  const getRows = (info) => {
    let updatedInfo = info.map((row, index) => {
      const entityName = row.Entity?.name;
      const firstName = row.Entity?.first_name;
      const lasttName = row.Entity?.last_name;

        return {
            type: "entityAddressItems",
            id: index,
            entity_name: entityName ? entityName : firstName + ' ' + lasttName,
            item_name: row.Item?.name,
            entity_address_item_name: row?.name,
            street_address1: row.Address.street_address1,
            street_address2: row.Address.street_address2,
            city: row.Address.city,
            state: row.Address.state,
            country: row.Address.country,
            postal_code: row.Address.postal_code,
            latitude: row.Address.latitude,
            longitude: row.Address.longitude
        };
    });
    return updatedInfo;
  };

  const dataTableData = {
    columns: [
      { Header: "Entity Name", accessor: "entity_name", width: "10%" },
      { Header: "Item Name", accessor: "item_name", width: "10%" },
      { Header: "Entity Address Name", accessor: "entity_address_item_name", width: "10%" },
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

    rows: getRows(entityAddressItem),
  };

  return (
    <Card>
        <MDBox display="flex" flexDirection="column" px={3} my={2}>
            <MDBox display="flex" flexDirection="column" style={{marginTop: "1rem"}}>
                <MDBox
                    display="flex"
                >
                    <MDTypography variant="h5" color="secondary"  fontWeight="bold">
                    Entity Address
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
                        <EntityAddressItemSelectDataTable rowData={entityAddressItems} selectedRows={selectedRows} setSelectedRows={setSelectedRows}/>
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
              {entityAddressItem.length > 0 && (
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

export default ModalEntityAddressItemSelect;
