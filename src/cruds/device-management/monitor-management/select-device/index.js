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
import { CardContent, Typography } from "@mui/material";
import MultiSelectDataTable from "examples/Tables/MultiSelectDataTable";

const ModalMultiSelect = ({rowData, selectedRows, setSelectedRows, label }) => {
  const [open, setOpen] = useState(false);
  const [tempSelectedRows, setTempSelectedRows] = useState([]);

  const handleOpen = () => {
    setTempSelectedRows([]);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const saveHandler = () => {
    const updatedRows = [...tempSelectedRows];
    setSelectedRows(updatedRows);
    setOpen(false);
  }

  return (
    <MDBox display="flex" flexDirection="column" style={{marginTop: "1rem"}}>
        <MDBox
            display="flex"
        >
          <MDTypography variant="h5" color="secondary"  fontWeight="bold">
            {label}
          </MDTypography>
          <MDButton variant="gradient" color="dark" size="small" style={{marginLeft: "1rem"}} onClick={handleOpen}>Select {label}</MDButton>
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
                <Typography>Select {label} </Typography>
                <MultiSelectDataTable rowData={rowData} selectedRows={tempSelectedRows} setSelectedRows={setTempSelectedRows}/>
                <MDBox ml="auto" mt={3} display="flex" justifyContent="flex-end">
                    <MDButton variant="contained" color="secondary" onClick={handleClose}>
                        Cancel
                    </MDButton>
                    <MDButton variant="contained" color="info" onClick={saveHandler} style={{marginLeft: '10px'}}>
                        Save
                    </MDButton>
                </MDBox>
            </CardContent>
          </Card>
        </Modal>
            </MDBox>
  );
};

export default ModalMultiSelect;
