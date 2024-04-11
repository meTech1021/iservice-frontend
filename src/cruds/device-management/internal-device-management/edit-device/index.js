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
import { MODULE_MASTER } from "utils/constant";
import ModalEntityAddressItemSelect from "cruds/device-management/select-entity";

const EditDevice = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [name, setName] = useState({
    text: "",
    error: false,
    textError: "",
  });

  const [deviceType, setDeviceType] = useState([]);
  const [deviceTypes, setDeviceTypes] = useState([]);
  const [entityAddressItem, setEntityAddressItem] = useState([]);
  const [entityAddressItems, setEntityAddressItems] = useState([]);
  const [statusType, setStatusType] = useState([]);
  const [statusDevice, setStatusDevice] = useState([]);
  const [brand, setBrand] = useState([]);
  const [brands, setBrands] = useState([]);
  const [obrands, setOBrands] = useState([]);
  const [model, setModel] = useState([]);
  const [models, setModels] = useState([]);
  const [omodels, setOModels] = useState([]);
  const [typebrand, setTypeBrand] = useState([]);
  const [brandmodel, setBrandModel] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const response = await CrudService.getDeviceTypes();
        setDeviceTypes(response.data);
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
          const response = await CrudService.getEntityAddressItems();
          const transformedResponse = response.map(item => ({
            ...item,
            id: item.address_item_id // Assuming address_item_id is the correct field name in your response
          }));

          setEntityAddressItems(transformedResponse);
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
        const responseBrands = await CrudService.getDeviceBrands();
        setOBrands(responseBrands.data);

        const responseModels = await CrudService.getDeviceModels();
        setOModels(responseModels.data);

        const responseTypeBrand = await CrudService.getDeviceTypeBrand();
        setTypeBrand(responseTypeBrand.data);

        const responseBrandModel = await CrudService.getDeviceBrandModel();
        setBrandModel(responseBrandModel.data);

        const res = await CrudService.getDevice(id);
        setDeviceType({attributes: res.data.attributes?.DeviceType});
        setStatusType({attributes: {StatusType: res.data.attributes?.StatusOption?.StatusType}});
        setName({ ...name, text: res.data.attributes?.name });

        if(res.data.attributes?.EntityAddressItem)
          setEntityAddressItem([res.data.attributes?.EntityAddressItem]);

        setBrand({attributes: res.data.attributes?.DeviceBrand})  
        setModel({attributes: res.data.attributes?.DeviceModel}) 

        const filteredtypebrand = responseTypeBrand.data
          .filter((assoc) => assoc.type_id === res.data.attributes?.DeviceType?.device_type_id)
          .map((assoc) => responseBrands.data.find((brand) => brand?.attributes?.brand_id === assoc?.brand_id));
        setBrands(filteredtypebrand);

        const filteredbrandmodel = responseBrandModel.data
          .filter((assoc) => assoc.brand_id === res.data.attributes?.DeviceBrand?.brand_id)
          .map((assoc) => responseModels.data.find((model) => model?.attributes?.model_id === assoc?.model_id));
        setModels(filteredbrandmodel);
 
      } catch (err) {
        console.error(err);
      }
    })();
  }, [id]);

  const changeNameHandler = (e) => {
    setName({ ...name, text: e.target.value });
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    const deviceUpdated = {
      data: {
        type: "devices",
        id: id,
        attributes: {
          name: name.text,
          deviceType: deviceType?.attributes,
          statusType: statusType?.attributes,
          entityAddressItem: entityAddressItem[0],
          brand: brand?.attributes,
          model: model?.attributes
        }
      },
    };

    try {
      await CrudService.updateDevice(deviceUpdated, deviceUpdated.data.id);
      navigate("/internal-device-management", {
        state: { value: true, text: "The device was successfully created" },
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handleBrandChange = (event, newBrand) => {
    setBrand(newBrand);
    if (newBrand) {
      const filtered = brandmodel
        .filter((assoc) => assoc.brand_id === newBrand?.attributes?.brand_id)
        .map((assoc) => omodels.find((model) => model?.attributes?.model_id === assoc?.model_id));
      console.log(filtered, 'filtered')
        setModels(filtered);
      setModel([])
    } else {
      // Reset filtered brands if no type is selected
      setModels([]);
      setModel([])
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
                  Device {id}
                </MDTypography>
              </MDBox>
              <MDTypography variant="h5" fontWeight="regular" color="secondary">
                This information will describe more about the Device.
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
                  <Autocomplete
                      defaultValue=""
                      options={deviceTypes}
                      getOptionLabel={(option) => (option.attributes ? option.attributes.type_name : "")}
                      value={deviceType ?? ""}
                      onChange={(event, newdeviceType) => {
                          setDeviceType(newdeviceType);
                          if (newdeviceType) {
                            const filtered = typebrand
                              .filter((assoc) => assoc.type_id === newdeviceType?.attributes?.device_type_id)
                              .map((assoc) => obrands.find((brand) => brand?.attributes?.brand_id === assoc?.brand_id));
                            setBrands(filtered);
                            setBrand([]);
                            setModel([]);
                          } else {
                            // Reset filtered brands if no type is selected
                            setBrands([]);
                            setBrand([]);
                            setModel([]);
                          }

                      }}
                      renderInput={(params) => (
                          <FormField {...params} label="Device Type" InputLabelProps={{ shrink: true }} required />
                      )}
                  />

                  <Autocomplete
                      defaultValue=""
                      options={brands}
                      getOptionLabel={(option) => (option.attributes ? option.attributes?.brand_name : "")}
                      value={brand ?? ""}
                      onChange={handleBrandChange}
                      renderInput={(params) => (
                          <FormField {...params} label="Device Brand" InputLabelProps={{ shrink: true }} required />
                      )}
                  />

                  <Autocomplete
                      defaultValue=""
                      options={models}
                      getOptionLabel={(option) => (option.attributes ? option.attributes?.model_name : "")}
                      value={model ?? ""}
                      onChange={(event, newModel) => {
                          setModel(newModel);
                      }}
                      renderInput={(params) => (
                          <FormField {...params} label="Device Brand" InputLabelProps={{ shrink: true }} required />
                      )}
                  />

                  {/* <Autocomplete
                      defaultValue=""
                      options={entityAddressItems}
                      getOptionLabel={(option) => (option.attributes ? option.attributes?.name : "")}
                      value={entityAddressItem ?? ""}
                      onChange={(event, newEntityAddressItem) => {
                          setEntityAddressItem(newEntityAddressItem);
                      }}
                      renderInput={(params) => (
                          <FormField {...params} label="Entity Address Item" InputLabelProps={{ shrink: true }} />
                      )}
                  /> */}

                  <Autocomplete
                      defaultValue=""
                      options={statusDevice}
                      getOptionLabel={(option) => (option.attributes ? option.attributes?.StatusType?.status_name : "")}
                      value={statusType ?? ""}
                      onChange={(event, newStatus) => {
                          setStatusType(newStatus);
                          console.log(newStatus, 'newStatus')
                      }}
                      renderInput={(params) => (
                          <FormField {...params} label="Status" InputLabelProps={{ shrink: true }}  />
                      )}
                  />    

                  <ModalEntityAddressItemSelect entityAddressItems={entityAddressItems} entityAddressItem={entityAddressItem} setEntityAddressItem={setEntityAddressItem} />

                  <MDBox ml="auto" mt={4} mb={2} display="flex" justifyContent="flex-end">
                    <MDBox mx={2}>
                      <MDButton
                        variant="gradient"
                        color="dark"
                        size="small"
                        px={2}
                        mx={2}
                        onClick={() =>
                          navigate("/internal-device-management", {
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

export default EditDevice;
