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
import { jwtDecode } from 'jwt-decode';

import CrudService from "services/cruds-service";

const NewAPI = () => {
  const navigate = useNavigate();
  const [parameter_name, setParameterName] = useState({
    text: "",
    error: false,
    textError: "",
  });
  const [parameter_value, setParameterValue] = useState({
    text: "",
    error: false,
    textError: "",
  });

  const [company, setCompany] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [apiName, setAPIName] = useState("");
  const [apiNames, setAPINames] = useState([]);
  const [organization, setOrganization] = useState("");

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decoded = jwtDecode(token);
      setOrganization(decoded.organization);
    }

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
        try {
          const response = await CrudService.getAPINames();
          setAPINames(response.data);
        } catch (err) {
          console.error(err);
          return null;
        }
    })();
  }, []);

  const submitHandler = async (e) => {
    e.preventDefault();

    // const formattedCompany = company.map((element) => element.attributes);
    const api = {
      data: {
        type: "apis",
        attributes: {
          organization: organization,
          company: company?.attributes,
          parameter_name: parameter_name.text,
          parameter_value: parameter_value.text,
          apiName: apiName
        },
      },
    };

    try {
      console.log(api, 'api')
      await CrudService.createAPI(api);
      navigate("/api-management", {
        state: { value: true, text: "The api was successfully created" },
      });
    } catch (err) {
      if (err.hasOwnProperty("errors")) {
        setParameterName({ ...parameter_name, error: true, textError: err.errors[0].detail });
      }
      console.error(err);
    }
  };

  const changeParameterNameHandler = (e) => {
    setParameterName({ ...parameter_name, text: e.target.value });
  };

  const changeParameterValueHandler = (e) => {
    setParameterValue({ ...parameter_value, text: e.target.value });
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
                  Add New API Parameter
                </MDTypography>
              </MDBox>
              <MDTypography variant="h5" fontWeight="regular" color="secondary">
                This information will describe more about the api.
              </MDTypography>
            </MDBox>
            <Card>
              <MDBox component="form" method="POST" onSubmit={submitHandler}>
                <MDBox display="flex" flexDirection="column" px={3} my={2}>
                    <FormField
                        type="text"
                        label="Organization"
                        name="organization"
                        value={organization}
                        error={organization.error}
                        disabled={true}
                    />

                    <Autocomplete
                        defaultValue={[]}
                        options={companies}
                        getOptionLabel={(option) => (option.attributes ? option.attributes.name : "")}
                        onChange={(event, newCompany) => {
                            setCompany(newCompany);

                        }}
                        renderInput={(params) => (
                            <FormField {...params} label="Company" InputLabelProps={{ shrink: true }} />
                        )}
                    />  

                    <Autocomplete
                        defaultValue=""
                        options={apiNames}
                        getOptionLabel={(option) => (option ? option.api_name : "")}
                        onChange={(event, newApiName) => {
                            setAPIName(newApiName);
                        }}
                        renderInput={(params) => (
                            <FormField {...params} label="API Name" InputLabelProps={{ shrink: true }} />
                        )}
                    />

                    <FormField
                        type="text"
                        label="Parameter Name"
                        name="parameter_name"
                        value={parameter_name.text}
                        onChange={changeParameterNameHandler}
                        error={parameter_name.error}
                    />                    

                    <FormField
                        type="text"
                        label="Parameter Value"
                        name="parameter_value"
                        value={parameter_value.text}
                        onChange={changeParameterValueHandler}
                        error={name.error}
                    />

                  <MDBox ml="auto" mt={4} mb={2} display="flex" justifyContent="flex-end">
                    <MDBox mx={2}>
                      <MDButton
                        variant="gradient"
                        color="dark"
                        size="small"
                        px={2}
                        mx={2}
                        onClick={() =>
                          navigate("/api-management", {
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

export default NewAPI;
