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
import MDEditor from "components/MDEditor";

// Material Dashboard 2 PRO React examples
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import FormField from "layouts/applications/wizard/components/FormField";
import { useNavigate, useParams } from "react-router-dom";
import { Autocomplete } from "@mui/material";
import { MODULE_MASTER } from "utils/constant"

import CrudService from "services/cruds-service";
import ModalAddressSelect from "cruds/common/select-address";

const EditItem = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [description, setDescription] = useState("");
  const [item, setItem] = useState({
    id: "",
    name: "",
    company: "",
    itemType: "",
    statusType: "",
  });
  const [error, setError] = useState({
    name: false,
    description: false,
    error: false,
    textError: "",
  });

  const [company, setCompany] = useState("");
  const [companies, setCompanies] = useState([]);
  const [addressTypes, setAddressTypes] = useState([]);
  const [itemType, setItemType] = useState([]);
  const [itemTypes, setItemTypes] = useState([]);
  const [oItemTypes, setOItemTypes] = useState([]);
  const [statusAddress, setStatusAddress] = useState([]);
  const [statusType, setStatusType] = useState([]);
  const [statusItem, setStatusItem] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [moduleaddresses, setModuleAddresses] = useState([]);
  const [selectedId, setSelectedId] = useState(0);

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
        const response = await CrudService.getAddressTypes();
        setAddressTypes(response.data);
        console.log(response.data, MODULE_MASTER.ADDRESS, 'ADDRESS')
      } catch (err) {
        console.error(err);
        return null;
      }
    })();

    (async () => {
      try {
        const response = await CrudService.getStatusTypes(MODULE_MASTER.ADDRESS);
        setStatusAddress(response.data);
        console.log(response.data, MODULE_MASTER.ADDRESS, 'ADDRESS')
      } catch (err) {
        console.error(err);
        return null;
      }
    })();

    (async () => {
        try {
          const response = await CrudService.getStatusTypes(MODULE_MASTER.ITEMS);
          setStatusItem(response.data);
          setStatusType(response.default_id);
        } catch (err) {
          console.error(err);
          return null;
        }
    })();

    (async () => {
      try {
        const response = await CrudService.getModuleAddresses(MODULE_MASTER.ENTITIES);
        setModuleAddresses(response.data);
        console.log(response.data, MODULE_MASTER.ITEMS, 'ITEMS')
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
        const responseItemTypes = await CrudService.getItemTypes();
        setOItemTypes(responseItemTypes.data);

        const res = await CrudService.getItem(id);
        setItem({
          id: res.data.id,
          name: res.data.attributes.name,
          company: res.data.attributes?.Company,
          itemType: res.data.attributes?.itemType,
          statusType: res.data.attributes?.StatusType,
        });
        setDescription(res.data.attributes.description);
        setCompany({attributes: res.data.attributes?.Company});
        setItemType({attributes: res.data.attributes?.ItemType});
        setStatusType({attributes: {StatusType: res.data.attributes?.StatusOption?.StatusType}});
        const updatedItemTypes = responseItemTypes.data.filter(item => item?.attributes?.company_id === res.data.attributes?.Company?.company_id);
        setItemTypes(updatedItemTypes);

        const entityAddressItems = res.data.included?.entityAddressItems;
        if (entityAddressItems) {
          const formattedaddresses = entityAddressItems.map(entityAddressItem => entityAddressItem.Address);
          const defaultIndex = entityAddressItems.findIndex(entityAddressItem => entityAddressItem.is_default === true)
          setAddresses(formattedaddresses);
          setSelectedId(defaultIndex);
        } else {
            // Handle the case where entityAddressItems is null or undefined
            setAddresses([]);
        }

      } catch (err) {
        console.error(err);
      }
    })();
  }, [id]);

  const changeNameHandler = (e) => {
    setItem({ ...item, name: e.target.value });
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    if (item.name.trim().length < 1) {
      setError({ ...error, name: true, textError: "The item name is required" });
      return;
    }

    let descNoTags = description.replace(/(<([^>]+)>)/gi, "");
    if (descNoTags < 1) {
      setError({
        ...error,
        description: true,
        textError: "The item description is required",
      });
      return;
    }

    const itemUpdated = {
      data: {
        type: "items",
        id: item.id.toString(),
        attributes: {
          name: item.name,
          description,
          company: company?.attributes,
          itemType: itemType?.attributes,
          statusType: statusType?.attributes,
          addresses 
        },
        selectedId: selectedId
      },
    };

    try {
      console.log(itemUpdated, 'itemUpdated')
      await CrudService.updateItem(itemUpdated, itemUpdated.data.id);
      navigate("/item-management", {
        state: { value: true, text: "The item was successfully updated" },
      });
    } catch (err) {
      if (err.hasOwnProperty("errors")) {
        setError({ ...item, error: true, textError: err.errors[0].detail });
      }
      console.error(err);
    }
  };

  return (
    <DashboardLayout>
      <DashboardNavbar breadcrumbTitle={item.name}/>
      <MDBox mt={5} mb={9}>
        <Grid container justifyContent="center">
          <Grid item xs={12} lg={8}>
            <MDBox mt={6} mb={8} textAlign="center">
              <MDBox mb={1}>
                <MDTypography variant="h3" fontWeight="bold">
                  Edit item {id}
                </MDTypography>
              </MDBox>
              <MDTypography variant="h5" fontWeight="regular" color="secondary">
                This information will describe more about the item.
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
                      value={item.name}
                      onChange={changeNameHandler}
                      error={error.name}
                    />
                    {error.name && (
                      <MDTypography variant="caption" color="error" fontWeight="light">
                        {error.textError}
                      </MDTypography>
                    )}
                  </MDBox>
                  
                  <Autocomplete
                      defaultValue=""
                      options={companies}
                      getOptionLabel={(option) => (option.attributes ? option.attributes.name : "")}
                      value={company ?? ""}
                      onChange={(event, newCompany) => {
                          setCompany(newCompany);
                          setItemType([]);
                          const updatedItemTypes = oItemTypes.filter(item => item?.attributes?.company_id === newCompany?.attributes?.company_id);
                          setItemTypes(updatedItemTypes);  
                      }}
                      renderInput={(params) => (
                          <FormField {...params} label="Company" InputLabelProps={{ shrink: true }} required />
                      )}
                  />  

                  <Autocomplete
                      defaultValue=""
                      options={itemTypes}
                      getOptionLabel={(option) => (option.attributes ? option.attributes.type_name : "")}
                      value={itemType ?? ""}
                      onChange={(event, newItemType) => {
                          setItemType(newItemType);
                      }}
                      renderInput={(params) => (
                          <FormField {...params} label="Entity Type" InputLabelProps={{ shrink: true }} required />
                      )}
                  />

                  <Autocomplete
                      defaultValue=""
                      options={statusItem}
                      getOptionLabel={(option) => (option.attributes ? option.attributes?.StatusType.status_name : "")}
                      value={statusType ?? ""}
                      onChange={(event, newStatus) => {
                          setStatusType(newStatus);
                      }}
                      renderInput={(params) => (
                          <FormField {...params} label="Status" InputLabelProps={{ shrink: true }} required />
                      )}
                  /> 
                  <MDBox mt={2}>
                    <MDBox mb={1} ml={0.5} lineHeight={0} display="inline-block">
                      <MDTypography
                        component="label"
                        variant="button"
                        fontWeight="regular"
                        color="text"
                      >
                        Description&nbsp;&nbsp;
                      </MDTypography>
                    </MDBox>
                    <MDEditor value={description} onChange={setDescription} />
                    {error.description && (
                      <MDTypography variant="caption" color="error" fontWeight="light">
                        {error.textError}
                      </MDTypography>
                    )}
                  </MDBox>

                  <ModalAddressSelect addressTypes={addressTypes} statusOptions={statusAddress} addresses={addresses} setAddresses={setAddresses} moduleaddresses={moduleaddresses} selectedId={selectedId} setSelectedId={setSelectedId}/>

                  <MDBox ml="auto" mt={4} mb={2} display="flex" justifyContent="flex-end">
                    <MDBox mx={2}>
                      <MDButton
                        variant="gradient"
                        color="dark"
                        size="small"
                        px={2}
                        mx={2}
                        onClick={() =>
                          navigate("/item-management", {
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

export default EditItem;
