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

// Material Dashboard 2 PRO React examples
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import FormField from "layouts/applications/wizard/components/FormField";
import { useNavigate } from "react-router-dom";

import CrudService from "services/cruds-service";
import ModalContactAddressSelect from "cruds/address-management/contact";
import { MODULE_MASTER } from "utils/constant";

const NewContact = () => {
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
  const [phoneAddresses, setPhoneAddresses] = useState([]);
  const [emailAddresses, setEmailAddresses] = useState([]);
  const [faxAddresses, setFaxAddresses] = useState([]);
  const [selectedPhoneId, setSelectedPhoneId] = useState(0);
  const [selectedEmailId, setSelectedEmailId] = useState(0);
  const [selectedFaxId, setSelectedFaxId] = useState(0);

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

  const changeFirstNameHandler = (e) => {
    setFirstName({ ...first_name, text: e.target.value });
  };

  const changeLastNameHandler = (e) => {
    setLastName({ ...last_name, text: e.target.value });
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    if (first_name.text.trim().length < 1) {
      setLastName({ ...first_name, error: true, textError: "The contact name is required" });
      return;
    }

    if (first_name.text.trim().length < 1) {
        setFirstName({ ...first_name, error: true, textError: "The contact name is required" });
        return;
    }
  
    const contact = {
      data: {
        type: "contacts",
        attributes: {
            first_name: first_name.text,
            last_name: last_name.text,
            contactType: contactType?.attributes,
            statusType: statusType?.attributes,
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
      console.log(contact, 'contact')
      await CrudService.createContact(contact);
      navigate("/contact-management", {
        state: { value: true, text: "The contact was successfully created" },
      });
    } catch (err) {
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
                  Add New Contact
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
                      value={first_name.text}
                      onChange={changeFirstNameHandler}
                      error={first_name.error}
                    />
                    {first_name.error && (
                      <MDTypography variant="caption" color="error" fontWeight="light">
                        {first_name.textError}
                      </MDTypography>
                    )}
                  </MDBox>

                  <MDBox p={1}>
                    <FormField
                      type="text"
                      label="Last Name"
                      name="last_name"
                      value={last_name.text}
                      onChange={changeLastNameHandler}
                      error={first_name.error}
                    />
                    {last_name.error && (
                      <MDTypography variant="caption" color="error" fontWeight="light">
                        {last_name.textError}
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
                          <FormField {...params} label="Status" InputLabelProps={{ shrink: true }} />
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

export default NewContact;
