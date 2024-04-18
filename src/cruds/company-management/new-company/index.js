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
import ModalAddress from "cruds/common/add-address";
import { useNavigate } from "react-router-dom";
import { MODULE_MASTER } from "utils/constant"
import { jwtDecode } from 'jwt-decode';
import { ToastContainer, toast } from 'react-toastify';
import 'material-react-toastify/dist/ReactToastify.css';

import CrudService from "services/cruds-service";

const NewCompany = () => {
  const navigate = useNavigate();

  const [name, setName] = useState({
    text: "",
    error: false,
    textError: "",
  });

  const [organization, setOrganization] = useState("");
  const [addressTypes, setAddressTypes] = useState([]);
  const [statusOptions, setStatusOptions] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [selectedId, setSelectedId] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decoded = jwtDecode(token);
      setOrganization(decoded.organization);
    }

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
        const response = await CrudService.getStatusTypes(MODULE_MASTER.COMPANIES);
        setStatusOptions(response.data);
      } catch (err) {
        console.error(err);
        return null;
      }
    })();
  }, []);

  const changeNameHandler = (e) => {
    setName({ ...name, text: e.target.value });
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    if (name.text.trim().length < 1) {
      setName({ ...name, error: true, textError: "The company name is required" });
      return;
    }

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
        toast.warning('Please set Status of Address!', {
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

    const company = {
      data: {
        type: "companies",
        attributes: {
          name: name.text,
          organization,
          addresses 
        },
        selectedId: selectedId
      },
    };
    

    try {
      await CrudService.createCompany(company);
      navigate("/company-management", {
        state: { value: true, text: "The company was successfully created" },
      });
    } catch (err) {
      if (err.hasOwnProperty("errors")) {
        setName({ ...name, error: true, textError: err.errors[0].detail });
      }
      console.error(err);
    }
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
                  Add New Company
                </MDTypography>
              </MDBox>
              <MDTypography variant="h5" fontWeight="regular" color="secondary">
                This information will describe more about the company.
              </MDTypography>
            </MDBox>
            <Card>
              <MDBox component="form" method="POST" onSubmit={submitHandler}>
                <MDBox display="flex" flexDirection="column" px={3} my={2}>
                  <MDBox p={1}>
                    <FormField
                      type="text"
                      label="Name"
                      name="name"
                      value={name.text || ""}
                      onChange={changeNameHandler}
                      error={name.error}
                    />
                    {name.error && (
                      <MDTypography variant="caption" color="error" fontWeight="light">
                        {name.textError}
                      </MDTypography>
                    )}
                  </MDBox>
                  <MDBox display="flex" flexDirection="column">
                    <MDBox
                      display="flex"
                      flexDirection="column"
                      marginBottom="1rem"
                      marginTop="2rem"
                    >
                      <MDInput
                        fullWidth
                        label="Organization"
                        inputProps={{ type: "text", autoComplete: ""  }}
                        name="organization"
                        value={organization}
                        disabled={true}
                      />
                    </MDBox>
                  </MDBox>
                  <ModalAddress addressTypes={addressTypes} statusOptions={statusOptions} addresses={addresses} setAddresses={setAddresses} selectedId={selectedId} setSelectedId={setSelectedId} />
                  <MDBox ml="auto" mt={4} mb={2} display="flex" justifyContent="flex-end">
                    <MDBox mx={2}>
                      <MDButton
                        variant="gradient"
                        color="dark"
                        size="small"
                        px={2}
                        mx={2}
                        onClick={() =>
                          navigate("/company-management", {
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

export default NewCompany;
