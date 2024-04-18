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
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';

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

const NewParameter = () => {
    const navigate = useNavigate();

    const [name, setName] = useState({
        text: "",
        error: false,
        textError: "",
    });

    const [label, setLabel] = useState({
        text: "",
        error: false,
        textError: "",
    });

    const [tooltip, setTooltip] = useState({
        text: "",
        error: false,
        textError: "",
    });

    const [apiNames, setApiNames] = useState([]);
    const [apiName, setApiName] = useState("");
    const [parameterType, setParameterType] = useState("");
    const [parameterTypes, setParameterTypes] = useState([]);
    const [icon, setIcon] = useState("");
    const [icons, setIcons] = useState([]);
    const [fieldType, setFieldType] = useState("");
    const [fieldTypes, setFieldTypes] = useState([]);
    const [isThreRequired, setIsThreRequired] = useState(false);

    useEffect(() => {
        (async () => {
            const response = await CrudService.getAPINames();
            setApiNames(response.data);
        })();

        (async () => {
            const response = await CrudService.getDeviceParameterTypes();
            setParameterTypes(response.data);
        })();

        (async () => {
            const response = await CrudService.getIcons();
            setIcons(response.data);
        })();

        (async () => {
            const response = await CrudService.getFieldTypes();
            setFieldTypes(response.data);
        })();

        document.title = `RIVIO | Internal Parameters`;
    }, []);

    const changeNameHandler = (e) => {
        setName({ ...name, text: e.target.value });
    };

    const changeLabelHandler = (e) => {
        setLabel({ ...label, text: e.target.value });
    };

    const changeTooltipHandler = (e) => {
        setTooltip({ ...tooltip, text: e.target.value });
    };

    const handleCheckboxChange = (event) => {
        setIsThreRequired(event.target.checked);
    };

    const submitHandler = async (e) => {
        e.preventDefault();

        const parameter = {
        data: {
            type: "parameters",
            attributes: {
                name: name.text,
                tooltip: tooltip.text,
                label: label.text,
                parameterType: parameterType,
                icon: icon,
                fieldType: fieldType,
                isThreRequired: isThreRequired,
                api_id: apiName.api_id
            }
        },
        };

        console.log(parameter, 'Parameter')
        try {
            await CrudService.createInternalParameter(parameter);
            
            navigate("/internal-parameter-management", {
              state: { value: true, text: "The Parameter was successfully created" },
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
                                Add New Parameter
                                </MDTypography>
                            </MDBox>
                            <MDTypography variant="h5" fontWeight="regular" color="secondary">
                                This information will describe more about the Parameter.
                            </MDTypography>
                        </MDBox>
                        <Card>
                            <MDBox component="form" method="POST" onSubmit={submitHandler}>
                                <MDBox display="flex" flexDirection="column" px={3} my={2}>
                                    <MDBox
                                        sx={{
                                            maxHeight: '70vh', // Set max height to enable scrolling
                                            overflowY: 'auto',    
                                            overflowX: 'hidden'                      
                                        }}
                                    >
                                    <MDBox p={1}>
                                        <Autocomplete
                                            defaultValue=""
                                            options={apiNames}
                                            getOptionLabel={(option) => (option ? option?.api_name : "")}
                                            value={apiName ?? ""}
                                            onChange={(event, newApiName) => {
                                                setApiName(newApiName);
                                            }}
                                            renderInput={(params) => (
                                                <FormField {...params} label="API Name" InputLabelProps={{ shrink: true }} required />
                                            )}
                                        />    
                                    </MDBox>                
                                    <MDBox p={1}>
                                        <FormField
                                            type="text"
                                            label="Name"
                                            name="name"
                                            value={name.text}
                                            onChange={changeNameHandler}
                                            InputLabelProps={{ shrink: true }}
                                            error={name.error}
                                        />
                                        {name.error && (
                                            <MDTypography variant="caption" color="error" fontWeight="light">
                                            {name.textError}
                                            </MDTypography>
                                        )}
                                    </MDBox>

                                    <MDBox p={1}>
                                        <FormField
                                            required
                                            type="text"
                                            label="Label"
                                            name="label"
                                            value={label.text}
                                            onChange={changeLabelHandler}
                                            InputLabelProps={{ shrink: true }}
                                            error={label.error}
                                        />
                                        {label.error && (
                                            <MDTypography variant="caption" color="error" fontWeight="light">
                                            {label.textError}
                                            </MDTypography>
                                        )}
                                    </MDBox>

                                    <MDBox p={1}>
                                        <FormField
                                            required
                                            type="text"
                                            label="Toottip"
                                            name="tooltip"
                                            value={tooltip.text}
                                            onChange={changeTooltipHandler}
                                            error={tooltip.error}
                                            InputLabelProps={{ shrink: true }}
                                        />
                                        {tooltip.error && (
                                            <MDTypography variant="caption" color="error" fontWeight="light">
                                                {tooltip.textError}
                                            </MDTypography>
                                        )}
                                    </MDBox>

                                    <Autocomplete
                                        defaultValue=""
                                        options={parameterTypes}
                                        getOptionLabel={(option) => (option ? option?.type_name : "")}
                                        value={parameterType ?? ""}
                                        onChange={(event, newType) => {
                                            setParameterType(newType);
                                        }}
                                        renderInput={(params) => (
                                            <FormField {...params} label="Type" InputLabelProps={{ shrink: true }} required />
                                        )}
                                    />    

                                    <Autocomplete
                                        defaultValue=""
                                        options={icons}
                                        getOptionLabel={(option) => (option ? option?.icon_name : "")}
                                        value={icon ?? ""}
                                        onChange={(event, newIcon) => {
                                            setIcon(newIcon);
                                        }}
                                        renderInput={(params) => (
                                            <FormField {...params} label="Icon" InputLabelProps={{ shrink: true }} required />
                                        )}
                                    />                  

                                    <Autocomplete
                                        defaultValue=""
                                        options={fieldTypes}
                                        getOptionLabel={(option) => (option ? option?.name : "")}
                                        value={fieldType ?? ""}
                                        onChange={(event, newFieldType) => {
                                            setFieldType(newFieldType);
                                        }}
                                        renderInput={(params) => (
                                            <FormField {...params} label="Field Type" InputLabelProps={{ shrink: true }} required />
                                        )}
                                    />    

                                    <Autocomplete
                                        defaultValue=""
                                        options={["Yes", "No"]}
                                        getOptionLabel={(option) => (option ? option : "")}
                                        onChange={(event, newFieldType) => {
                                            if(newFieldType === "Yes")
                                                setIsThreRequired(true)
                                            else
                                                setIsThreRequired(false)
                                        }}
                                        renderInput={(params) => (
                                            <FormField {...params} label="Is Threshold Allowed" InputLabelProps={{ shrink: true }} required />
                                        )}
                                    />    
             
                                </MDBox>

                                <MDBox ml="auto" mt={4} mb={2} display="flex" justifyContent="flex-end">
                                <MDBox mx={2}>
                                    <MDButton
                                        variant="gradient"
                                        color="dark"
                                        size="small"
                                        px={2}
                                        mx={2}
                                        onClick={() =>
                                            navigate("/internal-parameter-management", {
                                              state: { value: false, text: "" },
                                            })
                                        }
                                    >
                                    Back
                                    </MDButton>
                                </MDBox>
                                <MDButton variant="gradient" color="dark" size="small" type="submit">
                                    Map
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

export default NewParameter;
