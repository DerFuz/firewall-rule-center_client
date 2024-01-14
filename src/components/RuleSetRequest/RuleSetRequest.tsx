import "react-toastify/dist/ReactToastify.min.css";
import { useEffect, useMemo, useRef, useState } from 'react';
import { ActionEnum, StatusEnum, ProtocolEnum, Rule, RuleSetRequest, FirewallObjectShort } from '../api';
import MyApi from '../api/myapi';
import {
    MaterialReactTable,
    useMaterialReactTable,
    type MRT_ColumnDef,
    type MRT_SortingState,
    type MRT_Virtualizer,
    type MRT_TableOptions,
    MRT_Row,
    MRT_TableInstance,
  } from 'material-react-table';
import { ToastContainer, toast, Flip } from 'react-toastify';
import { styled } from '@mui/material/styles';
import { 
    Button,
    Box,
    IconButton,
    Tooltip
} from '@mui/material';
import {
    CloudUpload as CloudUploadIcon,
    Delete as DeleteIcon
 } from '@mui/icons-material';
import { validateSections } from "@mui/x-date-pickers/internals/hooks/useField/useField.utils";



export function CreateRuleSetRequest() {

  const [rules, setRules] = useState<Rule[]>(
    [
      {
        "pk": 2,
        "action": "DEN",
        "protocol": "UDP",
        "source_name": "any",
        "source_ip_orig": "0.0.0.0/0",
        "source_ip_nat": "",
        "source_port": null,
        "destination_name": "Google-DNS",
        "destination_ip_orig": "8.8.8.8",
        "destination_ip_nat": "",
        "destination_port": 53,
        "requester": "1",
        "ticket": "#126",
        "rule_set_request": null,
        "notes": "No DNS to Google-DNS (UDP)",
        "firewalls": [
          {
            "hostname": "Firewall2"
          }
        ],
        "status": "CON",
        "created_on": "2023-08-24T12:11:21.910000+02:00",
        "created_by": {
          "id": 2,
          "username": "user1"
        },
        "last_updated_on": "2024-01-06T20:01:53.989028+01:00",
        "last_updated_by": {
          "id": 1,
          "username": "jakob"
        },
        "is_deleted": false,
        "detail_url": "http://127.0.0.1:8000/api/rules/2/",
        "edit_url": "http://127.0.0.1:8000/api/rules/2/update/",
        "delete_url": "http://127.0.0.1:8000/api/rules/2/delete/",
        "history": []
      },
      {
        "pk": 2,
        "action": "DEN",
        "protocol": "TCP",
        "source_name": "any",
        "source_ip_orig": "0.0.0.0/0",
        "source_ip_nat": "",
        "source_port": null,
        "destination_name": "Google-DNS",
        "destination_ip_orig": "8.8.8.8",
        "destination_ip_nat": "",
        "destination_port": 53,
        "requester": "1",
        "ticket": "#126",
        "rule_set_request": null,
        "notes": "No DNS to Google-DNS (UDP)",
        "firewalls": [
          {
            "hostname": "Firewall2"
          }
        ],
        "status": "CON",
        "created_on": "2023-08-24T12:11:21.910000+02:00",
        "created_by": {
          "id": 2,
          "username": "user1"
        },
        "last_updated_on": "2024-01-06T20:01:53.989028+01:00",
        "last_updated_by": {
          "id": 1,
          "username": "jakob"
        },
        "is_deleted": false,
        "detail_url": "http://127.0.0.1:8000/api/rules/2/",
        "edit_url": "http://127.0.0.1:8000/api/rules/2/update/",
        "delete_url": "http://127.0.0.1:8000/api/rules/2/delete/",
        "history": []
      },
      {
        "pk": 2,
        "action": "DEN",
        "protocol": "TCPUDP",
        "source_name": "any",
        "source_ip_orig": "0.0.0.0/0",
        "source_ip_nat": "",
        "source_port": null,
        "destination_name": "Google-DNS",
        "destination_ip_orig": "8.8.8.8",
        "destination_ip_nat": "",
        "destination_port": 53,
        "requester": "1",
        "ticket": "#126",
        "rule_set_request": null,
        "notes": "No DNS to Google-DNS (UDP)",
        "firewalls": [
          {
            "hostname": "Firewall2"
          }
        ],
        "status": "CON",
        "created_on": "2023-08-24T12:11:21.910000+02:00",
        "created_by": {
          "id": 2,
          "username": "user1"
        },
        "last_updated_on": "2024-01-06T20:01:53.989028+01:00",
        "last_updated_by": {
          "id": 1,
          "username": "jakob"
        },
        "is_deleted": false,
        "detail_url": "http://127.0.0.1:8000/api/rules/2/",
        "edit_url": "http://127.0.0.1:8000/api/rules/2/update/",
        "delete_url": "http://127.0.0.1:8000/api/rules/2/delete/",
        "history": []
      }
    ]
    );

   

    const columns = useMemo<MRT_ColumnDef<Rule>[]>(
        () => [
          {
            accessorKey: 'status',
            header: 'Status',
            editVariant: 'select',
            editSelectOptions: Object.values(StatusEnum),
          },
          {
            accessorKey: 'action',
            header: 'Action',
            editVariant: 'select',
            editSelectOptions: Object.values(ActionEnum),
          },
          {
            accessorKey: 'protocol',
            header: 'Protocol',
            editVariant: 'select',
            editSelectOptions: Object.values(ProtocolEnum),
          },
          {
            accessorKey: 'source_name',
            header: 'Source Name',
          },
          {
            accessorKey: 'source_ip_orig',
            header: 'Source IP',
          },
          {
            accessorKey: 'source_ip_nat',
            header: 'Source IP (NAT)',
          },
          {
            accessorFn: (originalRow) => (originalRow.source_port?.toLocaleString()),
            id: 'source_port',
            header: 'Source Port',        
          },
          {
            accessorKey: 'destination_name',
            header: 'Destination Name',
          },
          {
            accessorKey: 'destination_ip_orig',
            header: 'Destination IP',
          },
          {
            accessorKey: 'destination_ip_nat',
            header: 'Destination IP (NAT)',
          },
          {
            accessorFn: (originalRow) => (originalRow.destination_port?.toLocaleString()),
            id: 'destination_port',
            header: 'Destination Port',
          },
          {
            accessorKey: 'notes',
            header: 'Notes',
          },
          {
            accessorKey: 'requester',
            header: 'Requester',
          },
          {
            accessorKey: 'ticket',
            header: 'Ticket',
          }
        ],
        []
      );


  const handleEditRule: MRT_TableOptions<Rule>['onEditingRowSave'] = ({ row, table, values }) => {
          console.log("updatingRule");
          console.log("update: row", row);
          console.log("update: table", table);
          console.log("update: values", values);
          toast.success("Updated rule successful");
        table.setEditingRow(null); //exit editing mode
      };

  const handleCreateRule: MRT_TableOptions<Rule>['onCreatingRowSave'] = ({ row, table, values }) => {
        console.log("creatingRule");
        console.log("update: row", row);
        console.log("update: table", table);
        console.log("update: values", values);
        console.log(rules);
        toast.success("Updated rule successful");
        setRules(oldRules => [
            ...oldRules,
            {
                "pk": 0,
                "action": values.action,
                "protocol": values.protocol,
                "source_name": values.source_name,
                "source_ip_orig": values.source_ip_orig,
                "source_ip_nat": values.source_ip_nat,
                "source_port": values.source_port,
                "destination_name": values.destination_name,
                "destination_ip_orig": values.destination_ip_orig,
                "destination_ip_nat": values.destination_ip_nat,
                "destination_port": values.destination_port,
                "requester": values.requester,
                "ticket": values.ticket,
                "rule_set_request": 0,
                "notes": values.notes,
                "firewalls": values.firewalls,
                "status": values.status,
                "created_on": "",
        "created_by": { "id": 0, "username": "" },
                "last_updated_on": "",
        "last_updated_by": { "id": 0, "username": "" },
                "is_deleted": false,
                "detail_url": "",
                "edit_url": "",
                "delete_url": "",
                "history": []
            }
        ]);
        console.log(rules);
        table.setCreatingRow(null); //exit creating mode
    };

      const handleDeleteRule = (row: MRT_Row<Rule>) => {
        console.log("deleting Rule " + row.index + " from state");
        console.log(row.original);
        console.log(rules);
        rules.splice(row.index, 1);
        setRules([...rules]);
        // TODO Table displays wrong data; backenddata looks correct
        console.log(rules);
        console.log(table.getRowModel().rows);
      };

      const handleCreateRuleSetRequest = (table: MRT_TableInstance<Rule>) => {
        console.log("creating rulesetrequest");
        console.log(rules);
        console.log(table);
      };


      const table = useMaterialReactTable({
        columns: columns,
        data: rules,
        enableColumnResizing: true,
        enableDensityToggle: false,
        enableEditing: true,
        editDisplayMode: 'table',
        createDisplayMode: 'row',
        onEditingRowSave: handleEditRule,
        // onEditingRowCancel: () => setValidationErrors({}),
        onCreatingRowSave: handleCreateRule,
        // onCreatingRowCancel: () => setValidationErrors({}),
        initialState: { 
          showColumnFilters: false,
          density: 'compact',
          showGlobalFilter: false,
          pagination: {
            pageSize: 50,
            pageIndex: 0
          },
        },
        enableRowActions: true,
        renderRowActions: ({ row }) => (
            <Box sx={{ display: 'flex', gap: '1rem' }}>
              <Tooltip title="Delete">
                <IconButton color="error" onClick={() => handleDeleteRule(row)}>
                  <DeleteIcon />
                </IconButton>
              </Tooltip>
            </Box>
        ),
        renderTopToolbarCustomActions: ({ table }) => (
            <Button
              variant="contained"
              onClick={() => {
                table.setCreatingRow(true); //simplest way to open the create row modal with no default values
                //or you can pass in a row object to set default values with the `createRow` helper function
                // table.setCreatingRow(
                //   createRow(table, {
                //     //optionally pass in default values for the new row, useful for nested data or other complex scenarios
                //   }),
                // );
              }}
            >
              Create New User
            </Button>
        ),
        renderBottomToolbarCustomActions: () => (
            <Box sx={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <Button
                color="success"
                variant="contained"
                onClick={() => handleCreateRuleSetRequest(table)}
                // disabled={
                //   Object.keys(editedUsers).length === 0 ||
                //   Object.values(validationErrors).some((error) => !!error)
                // }
              >
                Save
              </Button>
              {/* {Object.values(validationErrors).some((error) => !!error) && (
                <Typography color="error">Fix errors before submitting</Typography>
              )} */}
            </Box>
    )
      });

    const VisuallyHiddenInput = styled('input')({
        clip: 'rect(0 0 0 0)',
        clipPath: 'inset(50%)',
        height: 1,
        overflow: 'hidden',
        position: 'absolute',
        bottom: 0,
        left: 0,
        whiteSpace: 'nowrap',
        width: 1,
      });

    return (
        <div>
        <h1>TEST CreateRuleSetRequest</h1>
        <Button component="label" variant="contained" startIcon={<CloudUploadIcon />}>
            Upload file
            <VisuallyHiddenInput type="file" />
        </Button>
        <MaterialReactTable table={table} />
          <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar
            closeOnClick
            rtl={false}
            pauseOnFocusLoss={false}
            draggable={false}
            pauseOnHover
            limit={5}
            transition={Flip}
          />
        </div>
      );
}

export default function RuleSetRequestEntry() {


  return (
    <div>
    <h1>TEST RuleSetRequest</h1>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar
        closeOnClick
        rtl={false}
        pauseOnFocusLoss={false}
        draggable={false}
        pauseOnHover
        limit={5}
        transition={Flip}
      />
    </div>
  );
}