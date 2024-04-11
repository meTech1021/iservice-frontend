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
import { Autocomplete, Tooltip, IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

// Material Dashboard 2 PRO React components
import MDBox from "components/MDBox";
import MDButton from "components/MDButton";
import MDTypography from "components/MDTypography";

// Material Dashboard 2 PRO React examples
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import FormField from "layouts/applications/wizard/components/FormField";
import Checkbox from "@mui/material/Checkbox";
import { useNavigate, useParams } from "react-router-dom";

import CrudService from "services/cruds-service";
import { MODULE_MASTER } from "utils/constant";
import DataTable from "examples/Tables/DataTable";

const EditMonitorDevice = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [name, setName] = useState({
        text: "",
        error: false,
        textError: "",
    });    

    const [frequency, setFrequency] = useState({
        text: "",
        error: false,
        textError: "",
    });    
    const [timeUnit, setTimeUnit] = useState("Hour");

    const [device, setDevice] = useState([]);
    const [devices, setDevices] = useState([]);
    const [comparisonOperators, setComparisonOperators] = useState([]);
    const [thresholdTypes, setThresholdTypes] = useState([]);

    const [deviceParameters, setDeviceParameters] = useState([{label: "Select All", value: "all"}]);
    const [selectedParameters, setSelectedParameters] = useState([]);
    
    const [statusType, setStatusType] = useState([]);
    const [statusDevice, setStatusDevice] = useState([]);

    useEffect(() => {
        (async () => {
            try {
                const response = await CrudService.getInternalDevices();
                setDevices(response.data);
                console.log(response.data, 'devicesss')
            } catch (err) {
                console.error(err);
                return null;
            }
        })();

        (async () => {
            try {
                const response = await CrudService.getStatusTypes(MODULE_MASTER.DEVICES);
                setStatusDevice(response.data);
            } catch (err) {
                console.error(err);
                return null;
            }
        })();

        (async () => {
            try {
                const response = await CrudService.getDeviceParameters();
                const parametersWithSelectAll = [
                    { label: "Select All", value: "all" },
                    ...response.data
                ];
                setDeviceParameters(parametersWithSelectAll);
            } catch (err) {
                console.error(err);
                return null;
            }
        })();

        (async () => {
            try {
                const response = await CrudService.getThresholdTypes();
                setThresholdTypes(response.data);
            } catch (err) {
                console.error(err);
                return null;
            }
        })();

        (async () => {
            try {
                const response = await CrudService.getComparisonOperators();
                setComparisonOperators(response.data);
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
            const res = await CrudService.getDeviceMonitor(id);
            setName({ ...name, text: res.data.attributes?.name });
            setFrequency({ ...frequency, text: res.data.attributes?.frequency });
            console.log(res.data, 'res.data.attributes?.time_unit')
            setTimeUnit(res.data.attributes?.time_unit)
            const deviceArray = res.data.attributes?.DeviceMonitorAssociations.map((device) => ({
                ...device,
                attributes: device?.Device
            }));
            
            setDevice(deviceArray);
            setStatusType({attributes: {StatusType: res.data.attributes?.StatusOption?.StatusType}});
            const newDeviceParameters = res.data.included.deviceParameters.map((parameter) => ({
                ...parameter,
                label: parameter?.DeviceParameter?.parameter_name,
                parameter_name: parameter?.DeviceParameter?.parameter_name,
                is_threshold_required: parameter?.DeviceParameter?.is_threshold_required,
                field_type_id: parameter?.DeviceParameter?.field_type_id
            }));
            setSelectedParameters(newDeviceParameters)
            
          } catch (err) {
            console.error(err);
          }
        })();
      }, [id]);

    const changeNameHandler = (e) => {
        setName({ ...name, text: e.target.value });
    };

    const changeFrequencyHandler = (e) => {
        setFrequency({ ...frequency, text: e.target.value });
    };

    const validateInput = (field_type_id, value) => {
        switch (field_type_id) {
            case 2:
                if (!Number.isInteger(parseInt(value, 10))) {
                    return 'Value must be an integer';
                }
                break;
            case 3:
                if (!/^-?\d+\.\d+$/.test(value)) {
                    return 'Value must be a float';
                }
                break;
            case 4:
                if (!['true', 'false', '1', '0'].includes(value.toLowerCase())) {
                    return 'Value must be a boolean (true/false or 1/0)';
                }
                break;
            case 5:
                if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
                    return 'Value must be a valid date (YYYY-MM-DD)';
                }
                break;
            case 6:
                if (!/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/.test(value)) {
                    return 'Value must be a valid datetime (YYYY-MM-DD HH:MM:SS)';
                }
                break;
            case 7:
                if (!/^\d{10}$/.test(value)) {
                    return 'Value must be a valid timestamp (10 digits)';
                }
                break;
            case 8:
                if (value.length > 255) {
                    return 'Value must be less than or equal to 255 characters';
                }
                break;
            case 9:
                // Add specific validation logic for list type
                if(!Array.isArray(value)) {
                    return 'Value must be list';
                }
                break;
            default:
                // No specific validation for other field types
                return null;
        }

        // If validation passes
        return null;
    };

    const removeParameter = (index) => {
        const updatedParameters = [...selectedParameters];
        updatedParameters.splice(index, 1);
        setSelectedParameters(updatedParameters);
    }

    const getRows = () => {
        return selectedParameters.map((row, index) => {
            const fields = [
                {
                    parameter_name: row.parameter_name
                }
            ];

            if (row?.is_threshold_required) {
                fields.push(
                    {
                        threshold_type: (
                            <Autocomplete
                                defaultValue={row?.DeviceMonitorThresholdType || null}
                                options={thresholdTypes}
                                getOptionLabel={(option) => (option ? option.threshold_name : "")}
                                onChange={(event, NewThresholdType) => {
                                    handlethresholdTypeChange(index, NewThresholdType);
                                }}
                                style={{ width: "140px" }}  
                                renderInput={(params) => (
                                    <FormField {...params} label="Type" InputLabelProps={{ shrink: true }} required />
                                )}
                            />
                        ),
                        threshold_value: (
                            <MDBox>
                                <FormField
                                    required
                                    value={row.threshold_value}
                                    label="Value"
                                    onChange={(e) => handlethresholdValueChange(index, e.target.value)}
                                />
                                {row?.validationError && <div style={{ color: 'red' }}>{row?.validationError}</div>}
                            </MDBox>
                        ),    
                        comparison_operator: (
                            <Autocomplete
                                defaultValue={row.ComparisonOperator || null}
                                options={comparisonOperators}
                                getOptionLabel={(option) => (option ? option.comparison_operator : "")}
                                onChange={(event, NewComparisonOperator) => {
                                    handleThresholdOperatorChange(index, NewComparisonOperator);
                                }}
                                style={{ width: "80px" }}  
                                renderInput={(params) => (
                                    <FormField {...params} label="Operator" InputLabelProps={{ shrink: true }} required />
                                )}
                            />
                        ),
                        alert_enabled: (
                            <Checkbox
                                checked={row.alert_enabled}
                                onChange={(e) => handlealertEnabledChange(index, e.target.checked)}
                            />
                        )
                    }
                );
            }

            return Object.assign({}, ...fields);
        });
    };

    const dataTableData = {
        columns: [
            { Header: "Parameter Name", accessor: "parameter_name" },
            { Header: "Threshold Type", accessor: "threshold_type" },
            { Header: "Comparison Operator", accessor: "comparison_operator" },
            { Header: "Threshold Value", accessor: "threshold_value" },
            {
                Header: "Alert Enabled",
                accessor: 'alert_enabled'
            },
            {
                Header: "actions",
                disableSortBy: true,
                accessor: "",
                Cell: (info) => {
                  return (
                    <MDBox display="flex" alignItems="center">
                      {(
                        <Tooltip title="Delete Parameter">
                          <IconButton onClick={() => removeParameter(info.cell.row.index)}>
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      )}
                    </MDBox>
                  );
                },
            }
        ],
        rows: getRows(),
    };

    const handlethresholdTypeChange = (index, NewThresholdType) => {
        const updatedDataTable = [...selectedParameters];
        updatedDataTable[index].threshold_type_id = NewThresholdType?.id;
        setSelectedParameters(updatedDataTable);
    };

    const handlethresholdValueChange = (index, value) => {
        const updatedDataTable = [...selectedParameters];
        updatedDataTable[index].threshold_value = value;
        setSelectedParameters(updatedDataTable);
    };

    const handleThresholdOperatorChange = (index, NewComparisonOperator) => {
        const updatedDataTable = [...selectedParameters];
        updatedDataTable[index].comparison_operator_id = NewComparisonOperator?.id;
        setSelectedParameters(updatedDataTable);
    };

    const handlealertEnabledChange = (index, value) => {
        const updatedDataTable = [...selectedParameters];
        updatedDataTable[index].alert_enabled = value;
        setSelectedParameters(updatedDataTable);
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        let hasValidationError = false;
        const updatedSelectedParameters = [...selectedParameters];
        updatedSelectedParameters.forEach(updatedSelectedParameter => {
            const validError = validateInput(updatedSelectedParameter?.field_type_id, updatedSelectedParameter?.threshold_value)
            console.log(validError, 'validError')
            updatedSelectedParameter.validationError = validError;
            if (validError) {
                hasValidationError = validError;
                return;
            }    
        })
        console.log(hasValidationError,updatedSelectedParameters, 'hasValidationError')

        setSelectedParameters(updatedSelectedParameters);

        if(hasValidationError)
            return;

        const monitor = {
            data: {
                type: "monitors",
                attributes: {
                    name: name.text,
                    frequency: frequency.text,
                    devices: device,
                    timeUnit: timeUnit,
                    statusType: statusType?.attributes,
                    deviceParameters: selectedParameters
                }
            },
        };

        console.log(monitor, 'monitor')
        try {
            await CrudService.updateDeviceMonitor(monitor, id);
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
                                Device Monitor {id}
                                </MDTypography>
                            </MDBox>
                            <MDTypography variant="h5" fontWeight="regular" color="secondary">
                                This information will describe more about the Device Monitor.
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
                                            value={name?.text || ""}
                                            onChange={changeNameHandler}
                                            error={name?.error}
                                        />
                                        {name.error && (
                                        <MDTypography variant="caption" color="error" fontWeight="light">
                                            {name.textError}
                                        </MDTypography>
                                        )}
                                    </MDBox>

                                    <MDBox p={1} display="flex" alignItems="center">
                                        <FormField
                                            type="text"
                                            label="frequency"
                                            name="frequency"
                                            value={frequency.text || ""}
                                            onChange={changeFrequencyHandler}
                                            error={frequency.error}
                                        />
                                        <MDBox style={{ marginLeft: '10px' }}>
                                            <Autocomplete
                                                options={["Hour", "Minute", "Second"]}
                                                value={timeUnit}
                                                getOptionLabel={(option) => (option ? option : "")}
                                                onChange={(event, newUnit) => {
                                                    setTimeUnit(newUnit);
                                                }}
                                                style={{width: '120px'}}
                                                renderInput={(params) => (
                                                    <FormField {...params} label="Time Unit" InputLabelProps={{ shrink: true }} />
                                                )}
                                            />
                                        </MDBox>                                        
                                        {frequency.error && (
                                        <MDTypography variant="caption" color="error" fontWeight="light">
                                            {frequency.textError}
                                        </MDTypography>
                                        )}
                                    </MDBox>
                                    
                                    <Autocomplete
                                        multiple
                                        disableCloseOnSelect
                                        defaultValue={[]}
                                        options={devices}
                                        getOptionLabel={(option) => (option.attributes ? option.attributes.name : "")}
                                        value={device ?? ""}
                                        onChange={(event, NewDevice) => {
                                            console.log(NewDevice, 'NewDevice')
                                            setDevice(NewDevice);
                                        }}
                                        
                                        renderInput={(params) => (
                                            <FormField {...params} label="Device" InputLabelProps={{ shrink: true }} />
                                        )}
                                    />

                                    <Autocomplete
                                        defaultValue=""
                                        options={statusDevice}
                                        getOptionLabel={(option) => (option.attributes ? option.attributes?.StatusType.status_name : "")}
                                        value={statusType ?? ""}
                                        onChange={(event, newStatus) => {
                                            setStatusType(newStatus);
                                            console.log(newStatus, 'newStatus')
                                        }}
                                        renderInput={(params) => (
                                            <FormField {...params} label="Status" InputLabelProps={{ shrink: true }}  />
                                        )}
                                    />    

                                    <Autocomplete
                                        multiple
                                        disableCloseOnSelect
                                        defaultValue={selectedParameters}
                                        options={deviceParameters}
                                        getOptionLabel={(option) => (option ? option.label : "")}
                                        value={selectedParameters}
                                        onChange={(event, newParameter) => {
                                            if (newParameter.some((option) => option.value === "all")) {
                                                setSelectedParameters(deviceParameters.filter((option) => option.value !== "all"));
                                            } else {
                                                setSelectedParameters(newParameter);
                                            }
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

export default EditMonitorDevice;
