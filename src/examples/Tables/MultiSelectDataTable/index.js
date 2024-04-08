import React, { useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Badge } from '@mui/material';
import { makeStyles } from '@mui/styles';

const MultiSelectDataTable = ({rowData, selectedRows, setSelectedRows}) => {
  const useStyles = makeStyles({
    root: {
      '& .MuiDataGrid-row.Mui-selected': {
        backgroundColor: 'rgba(0, 0, 255, 0.3)', // Customize selected row background color
      },
      '& .MuiDataGrid-row.Mui-selected:hover': {
        backgroundColor: 'rgba(0, 0, 255, 0.3)', // Keep the same background color on hover
      },
      '& .MuiDataGrid-cell:focus-within': {
        outline: 'none', // Remove outline on cell focus
      },
    },
  });
  const classes = useStyles();

  const handleRowSelection = (selectedItems) => {
    setSelectedRows(selectedItems);
    console.log(selectedItems, selectedItems.selectionModel, 'selectedItems')
  };

  const columns = rowData.length > 0 ? Object.keys(rowData[0]).map((key) => {
    let column = {
      field: key,
      headerName: key.toUpperCase().replace('_', ' '), // Convert underscore to space and uppercase
      flex: 1,
    };
  
    // Custom rendering for the status field
    if (key === 'StatusType') {
        column.headerName = 'Status';
        column.renderCell = (params) => {
            const status = params.row.StatusType?.StatusType?.status_name;
            const badge = params.row.StatusType?.BadgeDetail;
            console.log(params, 'params')

            return (
                <Badge
                  color={badge?.color || 'primary'}
                  variant={badge?.variant}
                  badgeContent={status}
                  style={{ marginLeft: '15px' }}
                />
            );
        };
    }

    if (key === 'AddressType') {
        column.headerName = 'Type';
        column.renderCell = (params) => {
          return params.row?.AddressType?.type_name;
        };
    }

    if (key === 'Company') {
        column.renderCell = (params) => {
          return params.row?.Company?.name;
        };
    }

    if (key === 'ItemType') {
        column.renderCell = (params) => {
          return params.row?.ItemType?.type_name;
        };
    }

    return column;
  }).filter(column => column.field !== 'StatusOption' && column.field !== 'Attributes' && column.field !== 'Company' && column.field !== 'created_at' && column.field !== 'updated_at') : [];

  return (
      <DataGrid
        className={classes.root}
        rows={rowData}
        columns={columns}
        checkboxSelection
        onRowSelectionModelChange={handleRowSelection}
        selectionModel={selectedRows}
        getRowId={(row) => row.id}
        sx={{
          maxHeight: '70vh', // Limit the modal height to 80% of viewport height
        }}
      />
  );
};

export default MultiSelectDataTable;
