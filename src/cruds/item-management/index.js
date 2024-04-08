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
import { useNavigate, useLocation } from "react-router-dom";

// @mui material components
import Card from "@mui/material/Card";
import Badge from "@mui/material/Badge";
import Modal from "@mui/material/Modal";

// Material Dashboard 2 PRO React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// Material Dashboard 2 PRO React examples
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import DataTable from "examples/Tables/DataTable";
import MDButton from "components/MDButton";
import MDAlert from "components/MDAlert";
import { Tooltip, IconButton } from "@mui/material";

import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

import CrudService from "services/cruds-service";
import HTMLReactParser from "html-react-parser";
import { AbilityContext } from "Can";
import { useAbility } from "@casl/react";

function ItemManagement() {
  let { state } = useLocation();
  const ability = useAbility(AbilityContext);
  const [data, setData] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [notification, setNotification] = useState({
    value: false,
    text: "",
  });
  const [openModal, setOpenModal] = useState(false);
  const [mapUrl, setMapUrl] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      const response = await CrudService.getItems();
      setData(response.data);
    })();
    document.title = `RIVIO | Items`;
  }, []);

  useEffect(() => {
    if (!state) return;
    setNotification({
      value: state.value,
      text: state.text,
    });
  }, [state]);

  useEffect(() => {
    setTableData(getRows(data));
  }, [data]);

  useEffect(() => {
    if (notification.value === true) {
      let timer = setTimeout(() => {
        setNotification({
          value: false,
          text: "",
        });
      }, 5000);
    }
  }, [notification]);

  const clickAddHandler = () => {
    navigate("/item-management/new-item");
  };

  const clickEditHandler = (id) => {
    navigate(`/item-management/edit-item/${id}`);
  };

  const clickDeleteHandler = async (e, id) => {
    try {
      if (!confirm("Are you sure you want to delete this item?")) {
        e.nativeEvent.stopImmediatePropagation();
      } else {
        await CrudService.deleteItem(id);
        // the delete does not send a response
        // so I need to get again the categories to set it and this way the table gets updated -> it goes to the useEffect with data dependecy
        const response = await CrudService.getItems();
        setData(response.data);
        setNotification({
          value: true,
          text: "The item has been successfully deleted",
        });
      }
    } catch (err) {
      // it sends error is the item is associated with an item
      console.error(err);
      if (err.hasOwnProperty("errors")) {
        setNotification({
          value: true,
          text: err.errors[0].detail,
        });
      }
      return null;
    }
  };

  const getRows = (info) => {
    let updatedInfo = info.map((row) => {
      return {
        type: "items",
        id: row.id,
        name: row.attributes.name,
        company: row.attributes.Company?.name,
        description: row.attributes.description,
        type: row.attributes.ItemType?.type_name,
        status: (
          <Badge
            color={row.attributes?.StatusOption?.BadgeDetail?.color || 'primary'}
            variant={row.attributes?.StatusOption?.BadgeDetail?.variant}
            badgeContent={row.attributes?.StatusOption?.StatusType?.status_name}
            style={{marginLeft: '30px'}}
          >
          </Badge>
        ),
        // address: row.entityAddressItems[defaultIndex]?.Address?.street_address1,
        // city: row.entityAddressItems[defaultIndex]?.Address?.city,
        // state: row.entityAddressItems[defaultIndex]?.Address?.state,
        // country: row.entityAddressItems[defaultIndex]?.Address?.country,
        // postal_code: row.entityAddressItems[defaultIndex]?.Address?.postal_code,
        // latitude: row.entityAddressItems[defaultIndex]?.Address?.latitude,
        // longitude: row.entityAddressItems[defaultIndex]?.Address?.longitude,
      };
    });
    return updatedInfo;
  };

  const dataTableData = {
    columns: [
      { Header: "Status", accessor: "status", width: "15%" },
      { Header: "Name", accessor: "name", width: "25%" },
      {
        Header: "Description",
        accessor: "description",
        width: "25%",
        Cell: ({ cell: { value } }) => HTMLReactParser(value),
      },
      { Header: "Company", accessor: "company", width: "20%" },
      { Header: "Type", accessor: "type", width: "20%" },
      // { Header: "Address 1", accessor: "address", width: "10%" },
      // { Header: "City", accessor: "city", width: "20%" },
      // { Header: "State", accessor: "state", width: "10%" },
      // { Header: "Country", accessor: "country", width: "10%" },
      // { Header: "Postal Code", accessor: "postal_code", width: "10%" },
      // { Header: "Latitude", accessor: "latitude", width: "10%" },
      // { Header: "Longitude", accessor: "longitude", width: "10%" },
      // {
      //   Header: "View on Map",
      //   accessor: "",
      //   width: "10%",
      //   Cell: (info) => (
      //     <MDButton onClick={() => handleMapButtonClick(info.cell.row.original)}>View</MDButton>
      //   ),
      // },
      {
        Header: "actions",
        disableSortBy: true,
        accessor: "",
        Cell: (info) => {
          return (
            <MDBox display="flex" alignItems="center">
              {ability.can("edit", "items") && (
                <Tooltip title="Edit Item">
                  <IconButton onClick={() => clickEditHandler(info.cell.row.original.id)}>
                    <EditIcon />
                  </IconButton>
                </Tooltip>
              )}
              {ability.can("delete", "items") && (
                <Tooltip title="Delete Item">
                  <IconButton onClick={(e) => clickDeleteHandler(e, info.cell.row.original.id)}>
                    <DeleteIcon />
                  </IconButton>
                </Tooltip>
              )}
            </MDBox>
          );
        },
      },
    ],

    rows: tableData,
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      {notification.value && (
        <MDAlert color="info" my="20px">
          <MDTypography variant="body2" color="white">
            {notification.text}
          </MDTypography>
        </MDAlert>
      )}
      <MDBox pt={6} pb={3}>
        <MDBox mb={3}>
          <Card>
            <MDBox p={3} lineHeight={1} display="flex" justifyContent="space-between">
              <MDTypography variant="h5" fontWeight="medium">
                Item Management
              </MDTypography>
              <Modal open={openModal} onClose={() => setOpenModal(false)}>
                <div>
                  <iframe
                    id="mapIframe"
                    width="100%"
                    height="450"
                    style={{ border: 0 }}
                    loading="lazy"
                    allowFullScreen
                    src={mapUrl}
                  ></iframe>
                </div>
                {/* <MapComponent location={location} /> */}
              </Modal>

              {ability.can("create", "items") && (
                <MDButton
                  variant="gradient"
                  color="dark"
                  size="small"
                  type="submit"
                  onClick={clickAddHandler}
                >
                  + Add Item
                </MDButton>
              )}
            </MDBox>
            <DataTable table={dataTableData} />
          </Card>
        </MDBox>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default ItemManagement;
