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
import Checkbox from "@mui/material/Checkbox";
import { useNavigate } from "react-router-dom";

import CrudService from "services/cruds-service";
import { MODULE_MASTER } from "utils/constant";
import DataTable from "examples/Tables/DataTable";

const NewMonitorDevice = () => {
    const navigate = useNavigate();

    const [device, setDevice] = useState([]);
    const [devices, setDevices] = useState([]);
    const [deviceParameters, setDeviceParameters] = useState([]);
    const [selectedParameters, setSelectedParameters] = useState([]);

    const [statusType, setStatusType] = useState([]);
    const [statusDevice, setStatusDevice] = useState([]);

    useEffect(() => {
        (async () => {
        try {
            const response = await CrudService.getInternalDevices();
            setDevices(response.data);
            console.log(response.data, 'response device');
        } catch (err) {
            console.error(err);
            return null;
        }
        })();

        (async () => {
            try {
            const response = await CrudService.getStatusTypes(MODULE_MASTER.DEVICES);
            setStatusDevice(response.data);
            setStatusType(response.default_id);
            } catch (err) {
            console.error(err);
            return null;
            }
        })();

        (async () => {
            try {
            const response = await CrudService.getDeviceParameters();
                setDeviceParameters(response.data);
            } catch (err) {
                console.error(err);
                return null;
            }
        })();

    }, []);

    const getRows = () => {
        console.log(selectedParameters, 'selectedParameters')
        return selectedParameters.map((row, index) => ({
            parameter_name: row.parameter_name,
            threshold_type: (
                <FormField
                    required
                    value={row.threshold_type}
                    onChange={(e) => handlethresholdTypeChange(index, e.target.value)}
                />
            ),
            threshold_value: (
                <FormField
                    required
                    value={row.threshold_value}
                    onChange={(e) => handlethresholdValueChange(index, e.target.value)}
                />
            ),
            comparison_operator: (
                <FormField
                    required
                    value={row.comparison_operator}
                    onChange={(e) => handleThresholdOperatorChange(index, e.target.value)}
                />
            ),
            alert_enabled: (
                <Checkbox
                    checked={row.alert_enabled}
                    onChange={(e) => handlealertEnabledChange(index, e.target.checked)}
                />
            ),
        }));
    };

    const dataTableData = {
        columns: [
            { Header: "Parameter Name", accessor: "parameter_name" },
            { Header: "Threshold Type", accessor: "threshold_type" },
            { Header: "Threshold Value", accessor: "threshold_value" },
            { Header: "Comparison Operator", accessor: "comparison_operator" },
            {
                Header: "Alert Enabled",
                accessor: 'alert_enabled'
            },
        ],
        rows: getRows(),
    };


    const handlethresholdTypeChange = (index, value) => {
        const updatedDataTable = [...selectedParameters];
        updatedDataTable[index].threshold_type = value;
        setSelectedParameters(updatedDataTable);
    };

    const handlethresholdValueChange = (index, value) => {
        const updatedDataTable = [...selectedParameters];
        updatedDataTable[index].threshold_value = value;
        setSelectedParameters(updatedDataTable);
    };

    const handleThresholdOperatorChange = (index, value) => {
        const updatedDataTable = [...selectedParameters];
        updatedDataTable[index].comparison_operator = value;
        setSelectedParameters(updatedDataTable);
    };

    const handlealertEnabledChange = (index, value) => {
        const updatedDataTable = [...selectedParameters];
        updatedDataTable[index].alert_enabled = value;
        setSelectedParameters(updatedDataTable);
    };
    
    const submitHandler = async (e) => {
        e.preventDefault();

        const monitor = {
            data: {
                type: "monitors",
                attributes: {
                    device: device?.attributes,
                    statusType: statusType?.attributes,
                    deviceParameters: selectedParameters
                }
            },
        };

        console.log(monitor, 'monitor')
        try {
            await CrudService.createDeviceMonitor(monitor);
            navigate("/monitor-management", {
                state: { value: true, text: "The device was successfully created" },
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
                                Add New Device Monitor
                                </MDTypography>
                            </MDBox>
                            <MDTypography variant="h5" fontWeight="regular" color="secondary">
                                This information will describe more about the Device Monitor.
                            </MDTypography>
                        </MDBox>
                        <Card>
                            <MDBox component="form" method="POST" onSubmit={submitHandler}>
                                <MDBox display="flex" flexDirection="column" px={3} my={2}>
                                    <Autocomplete
                                        defaultValue=""
                                        options={devices}
                                        getOptionLabel={(option) => (option.attributes ? option.attributes.name : "")}
                                        value={device ?? ""}
                                        onChange={(event, NewDevice) => {
                                            setDevice(NewDevice);
                                        }}
                                        
                                        renderInput={(params) => (
                                            <FormField {...params} label="Device" InputLabelProps={{ shrink: true }} required />
                                        )}
                                    />

                                    <Autocomplete
                                        defaultValue=""
                                        options={statusDevice}
                                        getOptionLabel={(option) => (option.attributes ? option.attributes?.StatusType.status_name : "")}
                                        value={statusType ?? ""}
                                        onChange={(event, newStatus) => {
                                            setStatusType(newStatus);
                                        }}
                                        renderInput={(params) => (
                                            <FormField {...params} label="Status" InputLabelProps={{ shrink: true }}  />
                                        )}
                                    />    

                                    <Autocomplete
                                        multiple
                                        defaultValue={[]}
                                        options={deviceParameters}
                                        getOptionLabel={(option) => (option ? option.label : "")}
                                        value={selectedParameters ?? ""}
                                        onChange={(event, newParameter) => {
                                            setSelectedParameters(newParameter);
                                        }}
                                        renderInput={(params) => (
                                            <FormField {...params} label="Parameter" InputLabelProps={{ shrink: true }}  />
                                        )}
                                    />    

                                    <DataTable table={dataTableData} canSearch={true} />
                                    <MDBox ml="auto" mt={4} mb={2} display="flex" justifyContent="flex-end">
                                        <MDBox mx={2}>
                                            <MDButton
                                            variant="gradient"
                                            color="dark"
                                            size="small"
                                            px={2}
                                            mx={2}
                                            onClick={() =>
                                                navigate("/monitor-management", {
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

export default NewMonitorDevice;
