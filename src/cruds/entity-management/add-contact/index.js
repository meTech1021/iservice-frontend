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

// @mui material components
import Card from "@mui/material/Card";
import { Autocomplete, Badge, IconButton, Modal, Tooltip, Typography } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

// Material Dashboard 2 PRO React components
import MDBox from "components/MDBox";
import MDButton from "components/MDButton";
import MDTypography from "components/MDTypography";

// Material Dashboard 2 PRO React examples
import FormField from "layouts/applications/wizard/components/FormField";
import { useNavigate } from "react-router-dom";

import CrudService from "services/cruds-service";
import ModalContactAddressSelect from "cruds/address-management/contact";
import { MODULE_MASTER } from "utils/constant";
import { ToastContainer, toast } from 'react-toastify';
import 'material-react-toastify/dist/ReactToastify.css';
import DataTable from "examples/Tables/DataTable";

const ModalContact = ({
    open, setOpen,
    contactType, setContactType,
    contactStatusType, setContactStatusType,
    statusContact, setStatusContact,
    phoneAddresses, setPhoneAddresses,
    emailAddresses, setEmailAddresses,
    faxAddresses, setFaxAddresses,
    selectedPhoneId, setSelectedPhoneId,
    selectedEmailId, setSelectedEmailId,
    selectedFaxId, setSelectedFaxId,
    contact_first_name, setContactFirstName,
    contact_last_name, setContactLastName
}) => {
  const navigate = useNavigate();
  const [contactTypes, setContactTypes] = useState([]);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const response = await CrudService.getContactTypes();
        setContactTypes(response.data);
      } catch (err) {
        console.error(err);
        return null;
      }
    })();

    (async () => {
        try {
          const response = await CrudService.getStatusTypes(MODULE_MASTER.CONTACTS);
          setStatusContact(response.data);
          setContactStatusType(response.default_id);
        } catch (err) {
          console.error(err);
          return null;
        }
    })();
  }, []);

  const changeFirstNameHandler = (e) => {
    setContactFirstName({ ...contact_first_name, error: false, text: e.target.value });
  };

  const changeLastNameHandler = (e) => {
    setContactLastName({ ...contact_last_name, error: false, text: e.target.value });
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    if (contact_first_name.text.trim().length < 1) {
        setContactFirstName({ ...contact_first_name, error: true, textError: "The contact first name is required" });
        return;
    }

    if (contact_last_name.text.trim().length < 1) {
        setContactLastName({ ...contact_last_name, error: true, textError: "The contact last name is required" });
        return;
    }
    setVisible(true);
    setOpen(false);
  };

  const handleClose = () => {
    setOpen(false);
  };
  
  const clickDeleteHandler = () => {
    setVisible(false);
    setEmailAddresses([]);
    setPhoneAddresses([]);
    setFaxAddresses([]);
    setContactType([]);
    setContactFirstName({ ...contact_first_name, error: false, text: '' });
    setContactLastName({ ...contact_last_name, error: false, text: '' });
    setContactStatusType();
    setOpen(false);
  }

  const getRows = () => {
    let phone = phoneAddresses.find((contact, index) => contact.address_type_id === 1 && index === selectedPhoneId);
    let email = emailAddresses.find((contact, index) => contact.address_type_id === 2 && index === selectedEmailId);
    let fax = faxAddresses.find((contact, index) => contact.address_type_id === 3 && index === selectedFaxId);
    const rowData = {
        type: "contacts",
        id: 0,
        first_name: contact_first_name.text,
        last_name: contact_last_name.text,
        type: contactType?.attributes?.type_name,
        phone: phone ? phone.contact_address : '', // Render phone.contact_address if phone exists, otherwise an empty string
        email: email ? email.contact_address : '', // Render email.contact_address if email exists, otherwise an empty string
        fax: fax ? fax.contact_address : '',
        status: (
          <Badge
            color={statusContact[0]?.attributes?.BadgeDetail?.color || 'primary'}
            variant={statusContact[0]?.attributes?.BadgeDetail?.variant}
            badgeContent={statusContact[0]?.attributes?.StatusType?.status_name}
            style={{marginLeft: '30px'}}
          >
          </Badge>
        ),

    };
    return [rowData];
  };

  const dataTableData = {
    columns: [
      { Header: "Status", accessor: "status", width: "15%" },
      { Header: "First Name", accessor: "first_name", width: "15%" },
      { Header: "Last Name", accessor: "last_name", width: "15%" },
      { Header: "Type", accessor: "type", width: "20%" },
      { Header: "Phone", accessor: "phone", width: "15%" },
      { Header: "Email", accessor: "email", width: "15%" },
      { Header: "Fax", accessor: "fax", width: "15%" },
      {
        Header: "actions",
        disableSortBy: true,
        accessor: "",
        Cell: (info) => {
          return (
            <MDBox display="flex" alignItems="center">
                <Tooltip title="Delete Contact">
                    <IconButton onClick={clickDeleteHandler}>
                    <DeleteIcon />
                    </IconButton>
                </Tooltip>
            </MDBox>
          );
        },
      },
    ],

    rows: getRows(),
  };

  return (
    <MDBox>
        <ToastContainer/>
        <MDBox display="flex" flexDirection="column" px={3} my={2}>
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
                  <MDBox display="flex" flexDirection="column" px={3} my={2} >
                      <MDBox p={1}>
                          <FormField
                              type="text"
                              label="First Name"
                              name="contact_first_name"
                              value={contact_first_name.text}
                              onChange={changeFirstNameHandler}
                              error={contact_first_name.error}
                          />
                          {contact_first_name.error && (
                              <MDTypography variant="caption" color="error" fontWeight="light">
                              {contact_first_name.textError}
                              </MDTypography>
                          )}
                      </MDBox>

                      <MDBox p={1}>
                          <FormField
                              type="text"
                              label="Last Name"
                              name="contact_last_name"
                              value={contact_last_name.text}
                              onChange={changeLastNameHandler}
                              error={contact_first_name.error}
                          />
                          {contact_last_name.error && (
                              <MDTypography variant="caption" color="error" fontWeight="light">
                              {contact_last_name.textError}
                              </MDTypography>
                          )}
                      </MDBox>

                      <Autocomplete
                          defaultValue=""
                          options={contactTypes}
                          getOptionLabel={(option) => (option.attributes ? option.attributes.type_name : "")}
                          value={contactType}
                          onChange={(event, newContactType) => {
                            setContactType(newContactType);
                          }}
                          renderInput={(params) => (
                              <FormField {...params} label="contact Type" InputLabelProps={{ shrink: true }} required />
                          )}
                      />

                      <Autocomplete
                          defaultValue=""
                          options={statusContact}
                          getOptionLabel={(option) => (option.attributes ? option.attributes?.StatusType.status_name : "")}
                          value={contactStatusType ?? ""}
                          onChange={(event, newStatus) => {
                              setContactStatusType(newStatus);
                          }}
                          renderInput={(params) => (
                              <FormField {...params} label="Status" InputLabelProps={{ shrink: true }} />
                          )}
                      />    

                      <MDBox sx={{
                        maxHeight: '50vh', // Limit the modal height to 80% of viewport height
                        overflowY: 'auto'                          
                      }}>
                        <ModalContactAddressSelect phoneAddresses={phoneAddresses} setPhoneAddresses={setPhoneAddresses} emailAddresses={emailAddresses} setEmailAddresses={setEmailAddresses} faxAddresses={faxAddresses} setFaxAddresses={setFaxAddresses} selectedPhoneId={selectedPhoneId} selectedEmailId={selectedEmailId} selectedFaxId={selectedFaxId} setSelectedPhoneId={setSelectedPhoneId} setSelectedEmailId={setSelectedEmailId} setSelectedFaxId={setSelectedFaxId} />
                      </MDBox>

                      <MDBox ml="auto" mt={4} mb={2} display="flex" justifyContent="flex-end">
                          <MDBox mx={2}>
                              <MDButton
                                variant="gradient"
                                color="dark"
                                size="small"
                                px={2}
                                mx={2}
                                onClick={clickDeleteHandler}
                              >
                              Cancel
                              </MDButton>
                          </MDBox>
                          <MDButton variant="gradient" color="dark" size="small" onClick={submitHandler}>
                              Save
                          </MDButton>
                      </MDBox>
                  </MDBox>
              </Card>                

          </Modal>
        </MDBox>
        {
          contact_first_name.text !== '' && 
          <MDBox>
            <Typography ml={3}>New Contact</Typography>
            {visible && <DataTable
                table={dataTableData}
                canSearch={true}
            />}
          </MDBox>
        }
    </MDBox>
  );
};

export default ModalContact;
