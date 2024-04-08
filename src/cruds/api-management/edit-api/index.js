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

import CrudService from "services/cruds-service";

const EditAPI = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [api, setAPI] = useState({
    id: "",
    parameter_name: "",
    parameter_value: "",
    organization: "",
  });
  const [error, setError] = useState({
    parameter_name: "",
    parameter_value: "",
    organization: "",
    error: false,
    textError: "",
  });

  const [company, setCompany] = useState("");
  const [companies, setCompanies] = useState([]);
  const [apiName, setAPIName] = useState("");
  const [apiNames, setAPINames] = useState([]);

  useEffect(() => {
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
          console.log(response.data, 'apinames')
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

        const res = await CrudService.getAPI(id);
        console.log(res, 'res')
        setAPI({
          id: res.data.id,
          organization: res.data.attributes?.Organization?.name,
          company: res.data.attributes?.Company,
          parameter_name: res.data.attributes?.parameter_name,
          parameter_value: res.data.attributes?.parameter_value,
          apiName: res.data.attributes?.apiName
        });
        setCompany({attributes: res.data.attributes?.Company});
        setAPIName(res.data.attributes?.ApiName);
        console.log(res.data.attributes?.ApiName, 'res.data.attributes?.ApiName')
      } catch (err) {
        console.error(err);
      }
    })();
  }, [id]);

  const submitHandler = async (e) => {
    e.preventDefault();
   
    const apiUpdated = {
      data: {
        type: "apis",
        id: api.id.toString(),
        attributes: {
            organization: api.organization,
            company: company?.attributes,
            parameter_name: api.parameter_name,
            parameter_value: api.parameter_value,
            apiName: apiName
          },
      },
    };

    try {
      console.log(apiUpdated, 'apiUpdated')
      await CrudService.updateAPI(apiUpdated, apiUpdated.data.id);
      navigate("/api-management", {
        state: { value: true, text: "The api was successfully updated" },
      });
    } catch (err) {
      if (err.hasOwnProperty("errors")) {
        setError({ ...error, error: true, textError: err.errors[0].detail });
      }
      console.error(err);
    }
  };

  const changeParameterNameHandler = (e) => {
    setAPI({ ...api, parameter_name: e.target.value });
  };

  const changeParameterValueHandler = (e) => {
    setAPI({ ...api, parameter_value: e.target.value });
  };

  return (
    <DashboardLayout>
      <DashboardNavbar breadcrumbTitle={api.name}/>
      <MDBox mt={5} mb={9}>
        <Grid container justifyContent="center">
          <Grid item xs={12} lg={8}>
            <MDBox mt={6} mb={8} textAlign="center">
              <MDBox mb={1}>
                <MDTypography variant="h3" fontWeight="bold">
                  Edit API {id}
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
                        value={api?.organization}
                        error={error.organization}
                        disabled={true}
                    />

                    <Autocomplete
                        defaultValue=""
                        options={companies}
                        getOptionLabel={(option) => (option.attributes ? option.attributes.name : "")}
                        value={company ?? ""}
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
                        value={apiName ?? ""}
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
                        value={api.parameter_name}
                        onChange={changeParameterNameHandler}
                        error={error.parameter_name}
                    />                    

                    <FormField
                        type="text"
                        label="Parameter Value"
                        name="parameter_value"
                        value={api.parameter_value}
                        onChange={changeParameterValueHandler}
                        error={error.parameter_value}
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

export default EditAPI;
