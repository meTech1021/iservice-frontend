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

import { useEffect, useState } from "react";

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
import FormField from "layouts/applications/wizard/components/FormField";
import DataTable from "examples/Tables/DataTable";
import { Autocomplete, CardContent, Typography, Tooltip, IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import MDEditor from "components/MDEditor";
import InputMask from 'react-input-mask';
import { ToastContainer, toast } from 'react-toastify';
import 'material-react-toastify/dist/ReactToastify.css';
import crudsService from "services/cruds-service";

const ModalContactAddress = ({phoneAddresses, setPhoneAddresses, emailAddresses, setEmailAddresses, faxAddresses, setFaxAddresses, selectedPhoneId, selectedEmailId, selectedFaxId, setSelectedPhoneId, setSelectedEmailId, setSelectedFaxId }) => {
  const [addressType, setAddressType] = useState();

  const [newAddress, setNewAddress] = useState({ contact_address: "", description: "", address_type_id: 1 });
  const [open, setOpen] = useState(false);
  const [indexAddr, setIndexAddr] = useState(0);
  const [handleMode, setHandleMode] = useState(false);
  const [descError, setDescError] = useState(false);
  const [contactAddressTypes, setContactAddressTypes] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const response = await crudsService.getContactAddressTypes();
        setContactAddressTypes(response.data);
      } catch (err) {
        console.error(err);
        return null;
      }
    })();
  }, []);

  const changeAddressHandler = (index, field, value) => {
    if(field === 'contact_address' && !newAddress.address_type_id) {
      toast.warning('Please select type first!', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      return;
    }

    if(!handleMode) {
      setNewAddress((prevAddress) => ({
        ...prevAddress,
        [field]: value
      }));  
    }

    if(handleMode) {
        switch(newAddress?.address_type_id) {
          case 1:
            const updatedPhoneAddresses = [...phoneAddresses];
            updatedPhoneAddresses[index][field] = value;
            setPhoneAddresses(updatedPhoneAddresses);    
            break;
          case 2:
            const updatedEmailAddresses = [...emailAddresses];
            updatedEmailAddresses[index][field] = value;
            setEmailAddresses(updatedEmailAddresses);    
            break;
          case 3:
            const updatedFaxAddresses = [...faxAddresses];
            updatedFaxAddresses[index][field] = value;
            setFaxAddresses(updatedFaxAddresses);    
            break;        
        }
  
    }
  };

  const isValidEmail = (email) => {
      // Your email validation logic here
      return /\S+@\S+\.\S+/.test(email); // Example: Check if it's a valid email format
  };

  const isValidFax = (fax) => {
      // Your fax validation logic here
      return /^\d{10}$/.test(fax); // Example: Check if it's a 10-digit number (similar to phone number)
  };

  const addressHandler = () => {
    // const keysToExclude = ['street_address2', 'latitude', 'longitude', 'address_type_id', 'status_type_id'];

    // // for (const key in newAddress) {
    // //   if (newAddress.hasOwnProperty(key) && !keysToExclude.includes(key) && newAddress[key].trim() === '') {
    // //     alert("You need to fill out " + key);
    // //     return false; // Return false if any non-excluded field is blank
    // //   }
    // // }

    // for (const key in newAddress) {
    //     if (
    //     newAddress.hasOwnProperty(key) &&
    //     !keysToExclude.includes(key) &&
    //     typeof newAddress[key] === 'string' && // Check if the value is a string
    //     newAddress[key].trim() === ''
    //     ) {
    //     alert("You need to fill out " + key);
    //     return false; // Return false if any non-excluded field is blank
    //     }
    // }
    switch (newAddress.address_type_id) {
        case 2:
            if (!isValidEmail(newAddress.contact_address)) {
                toast.warning('Invalid email address!', {
                  position: 'top-right',
                  autoClose: 3000,
                  hideProgressBar: false,
                  closeOnClick: true,
                  pauseOnHover: true,
                  draggable: true,
                  progress: undefined,
                });
                return;
            }
            break;
        case 3:
            if (!isValidFax(newAddress.contact_address)) {
                toast.warning('Invalid fax number!', {
                  position: 'top-right',
                  autoClose: 3000,
                  hideProgressBar: false,
                  closeOnClick: true,
                  pauseOnHover: true,
                  draggable: true,
                  progress: undefined,
                });
                return;
            }
            break;
        default:
            // Handle other address types if needed
            break;
    }
    if(!handleMode) {
      switch(newAddress?.address_type_id) {
        case 1:
          setPhoneAddresses([...phoneAddresses, newAddress])
          break;
        case 2:
          setEmailAddresses([...emailAddresses, newAddress])
          break;
        case 3:
          setFaxAddresses([...faxAddresses, newAddress])
          break;        
      }
  
    }
    // // setAddresses([...addresses, { street_address1: "t", street_address2: "t", city: "t", state: "t", postal_code: "", country: "", latitude: "", longitude: "", address_type_id: "", status_type_id: "" }]);
    // setNewAddress({ contact_address: "", description: "", address_type_id: "" });
    setOpen(false);
  };

  const editAddress = (type, index) => {
    let updatedAddresses;
    switch(type) {
      case 'Phone':
        const updatedPhoneAddresses = [...phoneAddresses];
        updatedAddresses = updatedPhoneAddresses;
        setNewAddress(updatedPhoneAddresses[index]);
        break;
      case 'Email':
        const updatedEmailAddresses = [...emailAddresses];
        updatedAddresses = updatedEmailAddresses;
        setNewAddress(updatedEmailAddresses[index]);
        break;
      case 'Fax':
        const updatedFaxAddresses = [...faxAddresses];
        updatedAddresses = updatedFaxAddresses;
        setNewAddress(updatedFaxAddresses[index]);
        break;        
    }

    setIndexAddr(index);
    setHandleMode(true);
    
    const address_type = contactAddressTypes.find((address) => address.id === updatedAddresses[index]?.address_type_id);
    setAddressType(address_type);
    
    setOpen(true);
  };

  const removeAddress = (type, index) => {
    switch(type) {
      case 'Phone':
        const updatedPhoneAddresses = [...phoneAddresses];
        updatedPhoneAddresses.splice(index, 1);
        setPhoneAddresses(updatedPhoneAddresses);
        break;
      case 'Email':
        const updatedEmailAddresses = [...emailAddresses];
        updatedEmailAddresses.splice(index, 1);
        setPhoneAddresses(updatedEmailAddresses);
        break;
      case 'Fax':
        const updatedFaxAddresses = [...faxAddresses];
        updatedFaxAddresses.splice(index, 1);
        setPhoneAddresses(updatedFaxAddresses);
        break;        
    }

  };

  const handleOpen = () => {
    setOpen(true);
    setHandleMode(false);
    setAddressType();
    setNewAddress({ contact_address: "", description: "", address_type_id: "" });
    setIndexAddr(0);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const getRows = (info) => {
    let selectedId;
    switch(info[0]?.address_type_id) {
      case 1:
        selectedId = selectedPhoneId;
        break;
      case 2:
        selectedId = selectedEmailId;
        break;
      case 3:
        selectedId = selectedFaxId;
        break;        
    }
    let updatedInfo = info.map((row, index) => {
      const address_type = contactAddressTypes.find((address) => address.id === row.address_type_id);
      return {
        type: "addresses",
        id: index,
        contact_address: row.contact_address,
        description: row.description,
        address_type_id: address_type?.attributes?.type_name,
        isSelected: index === selectedId,
      };
    });
    return updatedInfo;
  };

  const phoneDataTableData = {
    columns: [
      {
        Header: "Default",
        disableSortBy: true,
        accessor: "",
        width: "10%",
        Cell: (info) => {
          return (
            <Checkbox checked={info.cell.row.original.isSelected} onChange={() => handleCheckboxChange(info.cell.row.original.address_type_id, info.cell.row.original.id)} />
          );
        },
      },
      { Header: "Type", accessor: "address_type_id", width: "15%" },
      { Header: "Contact Address1", accessor: "contact_address", width: "20%" },
      { Header: "description", accessor: "description", width: "35%" },
      {
        Header: "actions",
        disableSortBy: true,
        accessor: "",
        Cell: (info) => {
          return (
            <MDBox display="flex" alignItems="center">
              {(
                <Tooltip title="Edit Contact">
                  <IconButton onClick={() => editAddress(info.cell.row.original.address_type_id, info.cell.row.original.id)}>
                    <MDTypography><EditIcon /></MDTypography>
                  </IconButton>
                </Tooltip>
              )}
              {(
                <Tooltip title="Delete Contact">
                  <IconButton onClick={() => removeAddress(info.cell.row.original.address_type_id, info.cell.row.original.id)}>
                    <MDTypography><DeleteIcon /></MDTypography>
                  </IconButton>
                </Tooltip>
              )}
            </MDBox>
          );
        },
      }
    ],

    rows: getRows(phoneAddresses),
  };

  const emailDataTableData = {
    columns: [
      {
        Header: "Default",
        disableSortBy: true,
        accessor: "",
        width: "10%",
        Cell: (info) => {
          return (
            <Checkbox checked={info.cell.row.original.isSelected} onChange={() => handleCheckboxChange(info.cell.row.original.address_type_id, info.cell.row.original.id)} />
          );
        },
      },
      { Header: "Type", accessor: "address_type_id", width: "15%" },
      { Header: "Contact Address1", accessor: "contact_address", width: "20%" },
      { Header: "description", accessor: "description", width: "35%" },
      {
        Header: "actions",
        disableSortBy: true,
        accessor: "",
        Cell: (info) => {
          return (
            <MDBox display="flex" alignItems="center">
              {(
                <Tooltip title="Edit Address">
                  <IconButton onClick={() => editAddress(info.cell.row.original.address_type_id, info.cell.row.original.id)}>
                    <MDTypography><EditIcon /></MDTypography>
                  </IconButton>
                </Tooltip>
              )}
              {(
                <Tooltip title="Delete Address">
                  <IconButton onClick={() => removeAddress(info.cell.row.original.address_type_id, info.cell.row.original.id)}>
                    <MDTypography><DeleteIcon /></MDTypography>
                  </IconButton>
                </Tooltip>
              )}
            </MDBox>
          );
        },
      }
    ],

    rows: getRows(emailAddresses),
  };

  const faxDataTableData = {
    columns: [
      {
        Header: "Default",
        disableSortBy: true,
        accessor: "",
        width: "10%",
        Cell: (info) => {
          return (
            <Checkbox checked={info.cell.row.original.isSelected} onChange={() => handleCheckboxChange(info.cell.row.original.address_type_id, info.cell.row.original.id)} />
          );
        },
      },
      { Header: "Type", accessor: "address_type_id", width: "15%" },
      { Header: "Contact Address1", accessor: "contact_address", width: "20%" },
      { Header: "description", accessor: "description", width: "35%" },
      {
        Header: "actions",
        disableSortBy: true,
        accessor: "",
        Cell: (info) => {
          return (
            <MDBox display="flex" alignItems="center">
              {(
                <Tooltip title="Edit Address">
                  <IconButton onClick={() => editAddress(info.cell.row.original.address_type_id, info.cell.row.original.id)}>
                    <MDTypography><EditIcon /></MDTypography>
                  </IconButton>
                </Tooltip>
              )}
              {(
                <Tooltip title="Delete Address">
                  <IconButton onClick={() => removeAddress(info.cell.row.original.address_type_id, info.cell.row.original.id)}>
                    <MDTypography><DeleteIcon /></MDTypography>
                  </IconButton>
                </Tooltip>
              )}
            </MDBox>
          );
        },
      }
    ],

    rows: getRows(faxAddresses),
  };

  const handleCheckboxChange = (type, id) => {
    switch(type) {
      case 'Phone':
        const updatedPhoneAddresses = phoneAddresses.map((address, index) => ({
          ...address,
          isSelected: index === id, // Set isSelected to true for the selected row
        }));
        setPhoneAddresses(updatedPhoneAddresses); // Update the addresses state with the selected row
    
        setSelectedPhoneId(id);
        break;
      case 'Email':
        const updatedEmailAddresses = emailAddresses.map((address, index) => ({
          ...address,
          isSelected: index === id, // Set isSelected to true for the selected row
        }));
        setEmailAddresses(updatedEmailAddresses); // Update the addresses state with the selected row

        setSelectedEmailId(id);
        break;
      case 'Fax':
        const updatedFaxAddresses = faxAddresses.map((address, index) => ({
          ...address,
          isSelected: index === id, // Set isSelected to true for the selected row
        }));
        setEmailAddresses(updatedFaxAddresses); // Update the addresses state with the selected row
        
        setSelectedFaxId(id);
        break;        
    }
  };


  return (
    <Card>
        <ToastContainer/>
        <MDBox display="flex" flexDirection="column" px={3} my={2}>
            <MDBox display="flex" flexDirection="column" style={{marginTop: "1rem"}}>
                <MDBox
                    display="flex"
                >
                    <MDTypography variant="h5" color="secondary"  fontWeight="bold">
                    Addresses
                    </MDTypography>
                    <MDButton variant="gradient" color="dark" size="small" style={{marginLeft: "1rem"}} onClick={handleOpen}>+ Add Address</MDButton>
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
                        maxHeight: '80vh', // Limit the modal height to 80% of viewport height
                        overflowY: 'auto', // Enable vertical scrolling
                    }}
                    >
                    <CardContent>
                        <Typography>New Address</Typography>
                        <Autocomplete
                            required
                            defaultValue=""
                            value={addressType}
                            options={contactAddressTypes}
                            getOptionLabel={(option) => (option ? option.attributes?.type_name : "")}
                            style={{ marginTop: "1rem" }}
                            onChange={(event, newAddressType) => changeAddressHandler(indexAddr, "address_type_id", newAddressType ? newAddressType.attributes?.address_type_id : null, newAddressType.attributes?.address_type_id)}
                            renderInput={(params) => (
                                <FormField {...params} label="Address Type" InputLabelProps={{ shrink: true }} />
                            )}
                        />      
                      {
                        newAddress.address_type_id === 1 && 
                        <InputMask
                          mask="(999) 999-9999"
                          value={newAddress.contact_address}
                          onChange={(e) =>
                            changeAddressHandler(indexAddr, "contact_address", e.target.value, newAddress?.address_type_id)
                          }

                      >
                          {() => (
                              <FormField
                                  label="Phone"
                                  placeholder="(123) 456-7890"
                              />
                          )}
                      </InputMask>
                      }
                      {
                        newAddress.address_type_id !== 1 && 
                        <FormField
                          required
                          type="text"
                          label="Contact Address"
                          value={newAddress.contact_address}
                          style={{ marginTop: "1rem" }}
                          onChange={(e) =>
                              changeAddressHandler(indexAddr, "contact_address", e.target.value, newAddress?.address_type_id)
                          }
                      />

                      }
                    
                        <MDBox mt={2}>
                            <MDBox mb={1} ml={0.5} lineHeight={0} display="inline-block">
                            <MDTypography
                                component="label"
                                variant="button"
                                fontWeight="regular"
                                color="text"
                            >
                                Description&nbsp;&nbsp;
                            </MDTypography>
                            </MDBox>
                            <MDEditor value={newAddress.description}  onChange={(value) => changeAddressHandler(indexAddr, "description", value, newAddress?.address_type_id)} />
                            
                            {descError && (
                            <MDTypography variant="caption" color="error" fontWeight="light">
                                The contact description is required
                            </MDTypography>
                            )}
                        </MDBox>

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
            <MDBox mt={3}>
              {phoneAddresses.length > 0 && <Typography>Phone Number</Typography>}  
              {phoneAddresses.length > 0 && (
                <DataTable
                  table={phoneDataTableData}
                  canSearch={true}
                />
              )}
            </MDBox>

            <MDBox mt={3}>
              {emailAddresses.length > 0 && <Typography>Email</Typography>}
              {emailAddresses.length > 0 && (
                <DataTable
                  table={emailDataTableData}
                  canSearch={true}
                />
              )}
            </MDBox>
            <MDBox mt={3}>
              {faxAddresses.length > 0 && <Typography>Fax</Typography>}
              {faxAddresses.length > 0 && (
                <DataTable
                  table={faxDataTableData}
                  canSearch={true}
                />
              )}
            </MDBox>
        </MDBox>
    </Card>
  );
};

export default ModalContactAddress;
