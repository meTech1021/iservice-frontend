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
import { Autocomplete } from "@mui/material";

// Material Dashboard 2 PRO React components
import MDBox from "components/MDBox";
import MDButton from "components/MDButton";
import MDTypography from "components/MDTypography";
import MDEditor from "components/MDEditor";

// Material Dashboard 2 PRO React examples
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import FormField from "layouts/applications/wizard/components/FormField";
import { useNavigate, useParams } from "react-router-dom";

import CrudService from "services/cruds-service";
import ModalContactAddressSelect from "cruds/common/contact";
import { MODULE_MASTER } from "utils/constant";

const EditContact = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [first_name, setFirstName] = useState({
    text: "",
    error: false,
    textError: "",
  });
  const [last_name, setLastName] = useState({
    text: "",
    error: false,
    textError: "",
  });

  const [contactType, setContactType] = useState([]);
  const [contactTypes, setContactTypes] = useState([]);
  const [statusType, setStatusType] = useState([]);
  const [statusContact, setStatusContact] = useState([]);
  const [contact, setContact] = useState(0);
  const [phoneAddresses, setPhoneAddresses] = useState([]);
  const [emailAddresses, setEmailAddresses] = useState([]);
  const [faxAddresses, setFaxAddresses] = useState([]);
  const [selectedPhoneId, setSelectedPhoneId] = useState(0);
  const [selectedEmailId, setSelectedEmailId] = useState(0);
  const [selectedFaxId, setSelectedFaxId] = useState(0);

  const [error, setError] = useState({
    first_name: false,
    last_name: false,
    error: false,
    textError: "",
  });

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
          setStatusType(response.default_id);
        } catch (err) {
          console.error(err);
          return null;
        }
    })();
  }, []);

  useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        const res = await CrudService.getContact(id);
        setContact({
          id: res.data.id,
          first_name: res.data.attributes?.first_name,
          last_name: res.data.attributes?.last_name,
          contactType: res.data.attributes?.contactType,
          statusType: res.data.attributes?.StatusType,
        });
        setContactType({attributes: res.data.attributes?.ContactType});
        setStatusType({attributes: {StatusType: res.data.attributes?.StatusOption?.StatusType}});
        const contactAddresses = res.data.included;
        if (contactAddresses) {
          const phoneAddress = contactAddresses.filter(address => address.address_type_id === 1);
          const emailAddress = contactAddresses.filter(address => address.address_type_id === 2);
          const faxAddress = contactAddresses.filter(address => address.address_type_id === 3);
          const phoneIndex = phoneAddress.findIndex(contactAddress => contactAddress.is_default === true && contactAddress.address_type_id === 1)
          const emailIndex = emailAddress.findIndex(contactAddress => contactAddress.is_default === true && contactAddress.address_type_id === 2)
          const faxIndex = faxAddress.findIndex(contactAddress => contactAddress.is_default === true && contactAddress.address_type_id === 3)
          setPhoneAddresses(phoneAddress);
          setEmailAddresses(emailAddress);
          setFaxAddresses(faxAddress);
          setSelectedPhoneId(phoneIndex);
          setSelectedEmailId(emailIndex);
          setSelectedFaxId(faxIndex);
        } else {
            // Handle the case where entityAddressItems is null or undefined
            setPhoneAddresses([]);
            setEmailAddresses([]);
            setFaxAddresses([]);
        }

      } catch (err) {
        console.error(err);
      }
    })();
  }, [id]);

  const changeFirstNameHandler = (e) => {
    setContact({ ...contact, first_name: e.target.value });
  };

  const changeLastNameHandler = (e) => {
    setContact({ ...contact, last_name: e.target.value });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    if (contact.first_name.trim().length < 1) {
        setError({ ...error, first_name: true, textError: "The first name is required" });
        return;
    }

    if (contact.last_name.trim().length < 1) {
        setError({ ...error, last_name: true, textError: "The last name is required" });
        return;
    }

    const contactUpdated = {
      data: {
        type: "contacts",
        id: id,
        attributes: {
            first_name: contact.first_name,
            last_name: contact.last_name,
            contactType: contactType?.attributes,
            statusType: statusType?.attributes?.StatusType,
            phoneAddresses,
            emailAddresses,
            faxAddresses
        },
        selectedPhoneId: selectedPhoneId,
        selectedEmailId: selectedEmailId,
        selectedFaxId: selectedFaxId

      },
    };

    try {
      console.log(contactUpdated, 'contact')
      await CrudService.updateContact(contactUpdated, id);
      navigate("/contact-management", {
        state: { value: true, text: "The item was successfully updated" },
      });
    } catch (err) {
      if (err.hasOwnProperty("errors")) {
        setFirstName({ ...first_name, error: true, textError: err.errors[0].detail });
        setLastName({ ...last_name, error: true, textError: err.errors[0].detail });
      }
      console.error(err);
    }
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox mt={5} mb={9}>
        <Grid container justifyContent="center">
          <Grid item xs={12} lg={8}>
            <MDBox mt={6} mb={8} textAlign="center">
              <MDBox mb={1}>
                <MDTypography variant="h3" fontWeight="bold">
                  Edit Contact {id}
                </MDTypography>
              </MDBox>
              <MDTypography variant="h5" fontWeight="regular" color="secondary">
                This information will describe more about the contact.
              </MDTypography>
            </MDBox>
            <Card>
              <MDBox component="form" method="POST" onSubmit={submitHandler}>
                <MDBox display="flex" flexDirection="column" px={3} my={2}>
                  <MDBox p={1}>
                    <FormField
                      type="text"
                      label="First Name"
                      name="first_name"
                      value={contact.first_name}
                      onChange={changeFirstNameHandler}
                      InputLabelProps={{ shrink: true }}
                      required
                    />
                    {error.first_name && (
                      <MDTypography variant="caption" color="error" fontWeight="light">
                        {error.textError}
                      </MDTypography>
                    )}
                  </MDBox>

                  <MDBox p={1}>
                    <FormField
                      type="text"
                      label="Last Name"
                      name="last_name"
                      value={contact.last_name}
                      onChange={changeLastNameHandler}
                      InputLabelProps={{ shrink: true }}
                      required
                    />
                    {error.last_name && (
                      <MDTypography variant="caption" color="error" fontWeight="light">
                        {error.textError}
                      </MDTypography>
                    )}
                  </MDBox>

                  <Autocomplete
                      defaultValue=""
                      options={contactTypes}
                      getOptionLabel={(option) => (option.attributes ? option.attributes.type_name : "")}
                      value={contactType ?? ""}
                      onChange={(event, newcontactType) => {
                          setContactType(newcontactType);
                      }}
                      renderInput={(params) => (
                          <FormField {...params} label="contact Type" InputLabelProps={{ shrink: true }} required />
                      )}
                  />

                  <Autocomplete
                      defaultValue=""
                      options={statusContact}
                      getOptionLabel={(option) => (option.attributes ? option.attributes?.StatusType.status_name : "")}
                      value={statusType ?? ""}
                      onChange={(event, newStatus) => {
                          setStatusType(newStatus);
                      }}
                      renderInput={(params) => (
                          <FormField {...params} label="Status" InputLabelProps={{ shrink: true }} required />
                      )}
                  />    

                  <ModalContactAddressSelect phoneAddresses={phoneAddresses} setPhoneAddresses={setPhoneAddresses} emailAddresses={emailAddresses} setEmailAddresses={setEmailAddresses} faxAddresses={faxAddresses} setFaxAddresses={setFaxAddresses} selectedPhoneId={selectedPhoneId} selectedEmailId={selectedEmailId} selectedFaxId={selectedFaxId} setSelectedPhoneId={setSelectedPhoneId} setSelectedEmailId={setSelectedEmailId} setSelectedFaxId={setSelectedFaxId} />

                  <MDBox ml="auto" mt={4} mb={2} display="flex" justifyContent="flex-end">
                    <MDBox mx={2}>
                      <MDButton
                        variant="gradient"
                        color="dark"
                        size="small"
                        px={2}
                        mx={2}
                        onClick={() =>
                          navigate("/contact-management", {
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

export default EditContact;
