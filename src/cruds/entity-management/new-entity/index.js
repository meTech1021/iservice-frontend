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
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";

// Material Dashboard 2 PRO React components
import MDBox from "components/MDBox";
import MDButton from "components/MDButton";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";

// Material Dashboard 2 PRO React examples
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import FormField from "layouts/applications/wizard/components/FormField";
import { useNavigate } from "react-router-dom";
import { Autocomplete, Menu, MenuItem } from "@mui/material";
import { MODULE_MASTER } from "utils/constant"
import { ToastContainer, toast } from 'react-toastify';
import 'material-react-toastify/dist/ReactToastify.css';

import CrudService from "services/cruds-service";
import ModalModuleAddress from "cruds/address-management/module";
import ModalContact from "../add-contact";
import ModalSelectContact from "../add-contact/select";

const NewEntity = () => {
  const navigate = useNavigate();

  const [name, setName] = useState({
    text: "",
    error: false,
    textError: "",
  });

  const [firstName, setFirstName] = useState({
    text: "",
    error: false,
    textError: "",
  });

  const [lastName, setLastName] = useState({
    text: "",
    error: false,
    textError: "",
  });

  const [company, setCompany] = useState("");
  const [companies, setCompanies] = useState([]);
  const [addressTypes, setAddressTypes] = useState([]);
  const [entityType, setEntityType] = useState([]);
  const [entityTypes, setEntityTypes] = useState([]);
  const [statusAddress, setStatusAddress] = useState([]);
  const [statusType, setStatusType] = useState([]);
  const [statusEntity, setStatusEntity] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [selectedId, setSelectedId] = useState(0);
  const [items, setItems] = useState([]);
  const [attributeValue, setAttributeValue] = useState([]);
  const [module, setModule] = useState([]);

  ///////////////// contact addresss ////////////////
  const [contactType, setContactType] = useState([]);
  const [contactStatusType, setContactStatusType] = useState([]);
  const [statusContact, setStatusContact] = useState([]);
  const [phoneAddresses, setPhoneAddresses] = useState([]);
  const [emailAddresses, setEmailAddresses] = useState([]);
  const [faxAddresses, setFaxAddresses] = useState([]);
  const [selectedPhoneId, setSelectedPhoneId] = useState(0);
  const [selectedEmailId, setSelectedEmailId] = useState(0);
  const [selectedFaxId, setSelectedFaxId] = useState(0);
  const [contacts, setContacts] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [open, setOpen] = useState(false);
  const [openSelect, setOpenSelect] = useState(false);
  const [selectedContacts, setSelectedContacts] = useState([]);

  const [contact_first_name, setContactFirstName] = useState({
    text: "",
    error: false,
    textError: "",
  });
  const [contact_last_name, setContactLastName] = useState({
    text: "",
    error: false,
    textError: "",
  });

  // const [descError, setDescError] = useState(false);

  useEffect(() => {
    (async () => {
        try {
          const response = await CrudService.getEntityTypes();
          setEntityTypes(response.data);
        } catch (err) {
          console.error(err);
          return null;
        }
    })();
    (async () => {
        try {
          const response = await CrudService.getCompanies();
          setCompanies(response.data);
        } catch (err) {
          console.error(err);
          return null;
        }
    })();
    (async () => {
      const response = await CrudService.getContacts();
      setContacts(response.data);
    })();

    (async () => {
      try {
        const response = await CrudService.getAddressTypes();
        setAddressTypes(response.data);
      } catch (err) {
        console.error(err);
        return null;
      }
    })();

    (async () => {
      try {
        const response = await CrudService.getStatusTypes(MODULE_MASTER.ADDRESS);
        setStatusAddress(response.data);
      } catch (err) {
        console.error(err);
        return null;
      }
    })();

    (async () => {
        try {
          const response = await CrudService.getStatusTypes(MODULE_MASTER.ENTITIES);
          setStatusEntity(response.data);
          setStatusType(response.default_id);
        } catch (err) {
          console.error(err);
          return null;
        }
    })();

    (async () => {
      const response = await CrudService.getItems();
      const formattedItems = response.data.map(element => {
        // Rename 'item_id' field to 'id' and include the existing 'id' field
        const { item_id, id, ...attributes } = element.attributes;
        return { id: item_id, AttributeValue: [], ...attributes };
      });
      setItems(formattedItems);
    })();
    
  }, []);
//   const changeAddressHandler = (index, field, value) => {
//     console.log(index, field, value);
//     const updatedAddresses = [...addresses];
//     updatedAddresses[index][field] = value;
//     setAddresses(updatedAddresses);
//   };

//   const addAddress = () => {
//     setAddresses([...addresses, { street_address1: "", street_address2: "", city: "", state: "", postal_code: "", country: "", latitude: "", longitude: "", address_type_id: "", status_type_id: "" }]);
//   };

//   const removeAddress = (index) => {
//     const updatedAddresses = [...addresses];
//     if(updatedAddresses.length === 1)
//       return;
//     updatedAddresses.splice(index, 1);
//     setAddresses(updatedAddresses);
//   };

  const submitHandler = async (e) => {
    e.preventDefault();

    // let descNoTags = description.replace(/(<([^>]+)>)/gi, "");
    // if (descNoTags < 1) {
    //   setDescError(true);
    //   return;
    // }
    let hasInvalidAddress = false;

    addresses.forEach(address => {
      if(address.status_type_id === '') {
        toast.warning('Please set Status of Address!', {
          position: 'top-right',
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        hasInvalidAddress = true; // Set the flag to true if an invalid address is found
        return;
      }
      if(address.address_type_id === '') {
        toast.warning('Please set Type of Address!', {
          position: 'top-right',
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        hasInvalidAddress = true
        return;
      }

    })

    if (hasInvalidAddress) {
      return;
    }  

    let selectedContactIDs = selectedContacts.map(contact => contact?.attributes?.contact_id);

    const entity = {
      data: {
        type: "entities",
        attributes: {
          name: name.text,
          first_name: firstName.text,
          last_name: lastName.text,
          company: company?.attributes,
          entityType: entityType?.attributes,
          statusType: statusType?.attributes,
          addresses,
          contact: {
            contact_first_name: contact_first_name.text,
            contact_last_name: contact_last_name.text,
            contactType: contactType?.attributes,
            contactStatusType: contactStatusType?.attributes,
            phoneAddresses,
            emailAddresses,
            faxAddresses,
            selectedPhoneID: selectedPhoneId,
            selectedEmailID: selectedEmailId,
            selectedFaxID: selectedFaxId  
          },
          selectedContactIDs: selectedContactIDs
        },
        selectedId: selectedId,
      },
    };

    try {
      console.log(entity, 'entity')
      await CrudService.createEntity(entity);
      navigate("/entity-management", {
        state: { value: true, text: "The entity was successfully created" },
      });
    } catch (err) {
      if (err.hasOwnProperty("errors")) {
        setName({ ...name, error: true, textError: err.errors[0].detail });
      }
      console.error(err);
    }
  };

  const isOptionEqualToValueEntityStatus = (option, value) => {
    return option.attributes?.StatusType.status_name === value.attributes?.StatusType.status_name;
  };
  
  const isOptionEqualToValueEntityCompany = (option, value) => {
    return option?.attributes?.company_id === value?.attributes?.company_id;
  };

  const isOptionEqualToValueEntityType = (option, value) => {
    return option?.attributes?.entity_type_id === value?.attributes?.entity_type_id;
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleNewClick = () => {
    setAnchorEl(null);
    setOpen(true);
  };

  const handleSelectClick = () => {
    setAnchorEl(null);
    setOpenSelect(true);
  };

  const handleClose = () => {
    setAnchorEl(null);
  }

  const handleMenuClick = (event) => {
    // Prevent the menu from closing when clicking inside it
    event.stopPropagation();
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <ToastContainer/>

      <MDBox mt={5} mb={9}>
        <Grid container justifyContent="center">
          <Grid item xs={12} lg={8}>
            <MDBox mt={6} mb={8} textAlign="center">
              <MDBox mb={1}>
                <MDTypography variant="h3" fontWeight="bold">
                  Add New Entity
                </MDTypography>
              </MDBox>
              <MDTypography variant="h5" fontWeight="regular" color="secondary">
                This information will describe more about the entity.
              </MDTypography>
            </MDBox>
            <Card>
              <MDBox component="form" method="POST" onSubmit={submitHandler}>
                <MDBox display="flex" flexDirection="column" px={3} my={2}>
                  <MDBox p={1}>
                    <Autocomplete
                        defaultValue=""
                        options={entityTypes}
                        getOptionLabel={(option) => (option.attributes ? option.attributes.type_name : "")}
                        value={entityTypes.find(option => isOptionEqualToValueEntityType(option, entityType)) ?? null} // Find matching option or set to null if not found
                        onChange={(event, newEntityType) => {
                            setEntityType(newEntityType);
                        }}
                        isOptionEqualToValue={isOptionEqualToValueEntityType}
                        renderInput={(params) => (
                            <FormField {...params} label="Entity Type" InputLabelProps={{ shrink: true }} required />
                        )}
                    />

                    {entityType.id === 1 && (
                        <>
                            <FormField
                                required
                                type="text"
                                label="First Name"
                                name="firstName"
                                value={firstName.text || ""}
                                onChange={(e) => setFirstName({ ...firstName, text: e.target.value })}
                                error={firstName.error}
                            />
                            {firstName.error && (
                                <MDTypography variant="caption" color="error" fontWeight="light">
                                    {firstName.textError}
                                </MDTypography>
                            )}

                            <FormField
                                required
                                type="text"
                                label="Last Name"
                                name="lastName"
                                value={lastName.text || ""}
                                onChange={(e) => setLastName({ ...lastName, text: e.target.value })}
                                error={lastName.error}
                            />
                            {lastName.error && (
                                <MDTypography variant="caption" color="error" fontWeight="light">
                                    {lastName.textError}
                                </MDTypography>
                            )}
                        </>
                    )}    

                    
                    {entityType.id === 2 && (
                        <>
                            <FormField
                                required
                                type="text"
                                label="Name"
                                name="name"
                                value={name.text || ""}
                                onChange={(e) => setName({ ...name, text: e.target.value })}
                                error={name.error}
                            />
                            {name.error && (
                                <MDTypography variant="caption" color="error" fontWeight="light">
                                    {name.textError}
                                </MDTypography>
                            )}
                        </>
                    )}    
                     
                     <Autocomplete
                        defaultValue=""
                        options={companies}
                        getOptionLabel={(option) => (option.attributes ? option.attributes.name : "")}
                        value={companies.find(option => isOptionEqualToValueEntityCompany(option, company)) ?? null} // Find matching option or set to null if not found
                        onChange={(event, newCompany) => {
                            setCompany(newCompany);
                        }}
                        isOptionEqualToValue={isOptionEqualToValueEntityCompany}
                        renderInput={(params) => (
                            <FormField {...params} label="Company" InputLabelProps={{ shrink: true }} required />
                        )}
                    />

                    <Autocomplete
                        defaultValue=""
                        options={statusEntity}
                        getOptionLabel={(option) => (option.attributes ? option.attributes?.StatusType.status_name : "")}
                        value={statusType ?? null}
                        onChange={(event, newStatus) => {
                            setStatusType(newStatus);
                        }}
                        isOptionEqualToValue={isOptionEqualToValueEntityStatus} // Custom equality function
                        renderInput={(params) => (
                            <FormField {...params} label="Status" InputLabelProps={{ shrink: true }} required />
                        )}
                    />    
                    
                  </MDBox>
                  <ModalModuleAddress addressTypes={addressTypes} statusOptions={statusAddress} addresses={addresses} setAddresses={setAddresses}  selectedId={selectedId} setSelectedId={setSelectedId} moduleData={items} moduleType="Item" attributeValue={attributeValue} setAttributeValue={setAttributeValue} module={module} setModule={setModule}/>
                  <Card>
                    <MDBox
                      display="flex" px={3} my={2}
                    >
                        <MDTypography variant="h5" color="secondary"  fontWeight="bold">
                        Contacts 
                        </MDTypography>
                        <MDButton variant="gradient" color="dark" size="small" style={{marginLeft: "1.8rem"}} onClick={handleClick}>
                          + Add Contact
                          <Menu
                            anchorEl={anchorEl}
                            open={Boolean(anchorEl)}
                            onClose={handleClose}
                            onClick={handleMenuClick}
                          >
                            <MenuItem onClick={handleNewClick}>New Contact</MenuItem>
                            <MenuItem onClick={handleSelectClick}>Select Contact(s)</MenuItem>
                          </Menu>
                        </MDButton>
                    </MDBox>
                    {
                      
                      <ModalContact 
                        open={open} setOpen={setOpen}
                        contactType={contactType} setContactType={setContactType}
                        contactStatusType={contactStatusType} setContactStatusType={setContactStatusType}
                        statusContact={statusContact} setStatusContact={setStatusContact}
                        phoneAddresses={phoneAddresses} setPhoneAddresses={setPhoneAddresses}
                        emailAddresses={emailAddresses} setEmailAddresses={setEmailAddresses}
                        faxAddresses={faxAddresses} setFaxAddresses={setFaxAddresses}
                        selectedPhoneId={selectedPhoneId} setSelectedPhoneId={setSelectedPhoneId}
                        selectedEmailId={selectedEmailId} setSelectedEmailId={setSelectedEmailId}
                        selectedFaxId={selectedFaxId} setSelectedFaxId={setSelectedFaxId}
                        contact_first_name={contact_first_name} setContactFirstName={setContactFirstName}
                        contact_last_name={contact_last_name} setContactLastName={setContactLastName}
                      />
                    }
                    {
                      
                      <ModalSelectContact
                        open={openSelect} setOpen={setOpenSelect} contacts={contacts} selectedContacts={selectedContacts} setSelectedContacts={setSelectedContacts}
                      />
                    }

                  </Card>

                  <MDBox ml="auto" mt={4} mb={2} display="flex" justifyContent="flex-end">
                    <MDBox mx={2}>
                      <MDButton
                        variant="gradient"
                        color="dark"
                        size="small"
                        px={2}
                        mx={2}
                        onClick={() =>
                          navigate("/entity-management", {
                            state: { value: false, text: "" },
                          })
                        }
                      >
                        Back
                      </MDButton>
                    </MDBox>
                    <MDButton variant="gradient" color="dark" size="small" type="submit">
                      Save
                    </MDButton>
                  </MDBox>
                </MDBox>
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
};

export default NewEntity;
