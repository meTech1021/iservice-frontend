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

// Material Dashboard 2 PRO React components
import MDBox from "components/MDBox";
import MDButton from "components/MDButton";
import MDTypography from "components/MDTypography";

// Material Dashboard 2 PRO React examples
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import FormField from "layouts/applications/wizard/components/FormField";
import { useNavigate, useParams } from "react-router-dom";
import { Autocomplete } from "@mui/material";
import { MODULE_MASTER } from "utils/constant"
import { ToastContainer, toast } from 'react-toastify';
import 'material-react-toastify/dist/ReactToastify.css';

import CrudService from "services/cruds-service";
import ModalAddress from "cruds/address-management";

const EditCompany = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [organization, setOrganization] = useState();
  const [organizations, setOrganizations] = useState([]);
  const [addressTypes, setAddressTypes] = useState([]);
  const [statusOptions, setStatusOptions] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [selectedId, setSelectedId] = useState(0);

  const [company, setCompany] = useState({
    id: "",
    name: "",
  });
  const [error, setError] = useState({
    name: false,
    organization: false,
    error: false,
    textError: "",
  });

  useEffect(() => {
    (async () => {
      try {
        const response = await CrudService.getOrganizations();
        setOrganizations(response.data);
      } catch (err) {
        console.error(err);
        return null;
      }
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
        const response = await CrudService.getStatusTypes(MODULE_MASTER.COMPANIES);
        setStatusOptions(response.data);
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
        const res = await CrudService.getCompany(id);
        setCompany({
          id: res.data.attributes.company_id,
          name: res.data.attributes?.name,
          organization: res.data.attributes?.Organization,
        });
        setOrganization({attributes: res.data.attributes.Organization});
        const moduleLocations = res.data.included?.moduleLocations;
        if (moduleLocations) {
          const addresses = moduleLocations.map(location => location.Address);
          const defaultIndex = moduleLocations.findIndex(location => location.is_default === true)
          setAddresses(addresses);
          setSelectedId(defaultIndex);
        } else {
          // Handle the case where moduleLocations is null or undefined
          setAddresses([]);
        }
        // setAddresses(res.data.included?.moduleLocations);
      } catch (err) {
        console.error(err);
      }
    })();
  }, [id]);

  const changeNameHandler = (e) => {
    setCompany({ ...company, name: e.target.value });
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    if (company.name.trim().length < 1) {
      setError({ ...error, name: true, textError: "The company name is required" });
      return;
    }

    if (!organization) {
      setError({ ...error, organization: true, textError: "The company name is required" });
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

    const companyUpdated = {
      data: {
        type: "companies",
        id: company.id.toString(),
        attributes: {
          name: company.name,
          organization: organization.attributes,
          addresses
        },
        selectedId: selectedId
      },
    };

    try {
      console.log(companyUpdated, 'companyUpdated')
      await CrudService.updateCompany(companyUpdated, companyUpdated.data.id);
      navigate("/company-management", {
        state: { value: true, text: "The company was successfully updated" },
      });
    } catch (err) {
      if (err.hasOwnProperty("errors")) {
        setError({ ...company, error: true, textError: err.errors[0].detail });
      }
      console.error(err);
    }
  };

  return (
    <DashboardLayout>
      <DashboardNavbar breadcrumbTitle={company.name}/>
      <ToastContainer/>
      <MDBox mt={5} mb={9}>
        <Grid container justifyContent="center">
          <Grid item xs={12} lg={8}>
            <MDBox mt={6} mb={8} textAlign="center">
              <MDBox mb={1}>
                <MDTypography variant="h3" fontWeight="bold">
                  Edit company {id}
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
                      value={company.name}
                      onChange={changeNameHandler}
                      error={error.name}
                    />
                    {error.name && (
                      <MDTypography variant="caption" color="error" fontWeight="light">
                        {error.textError}
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
                      <Autocomplete
                        defaultValue=""
                        options={organizations}
                        getOptionLabel={(option) => (option.attributes ? option.attributes.name : "")}
                        value={organization ?? ""}
                        onChange={(event, newOrganization) => {
                          setOrganization(newOrganization);
                        }}
                        renderInput={(params) => (
                          <FormField {...params} label="Organization" InputLabelProps={{ shrink: true }} />
                        )}
                        disabled={true}
                      />
                    </MDBox>
                  </MDBox>

                  <ModalAddress addressTypes={addressTypes} statusOptions={statusOptions} addresses={addresses} setAddresses={setAddresses} selectedId={selectedId} setSelectedId={setSelectedId}/>

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

export default EditCompany;
