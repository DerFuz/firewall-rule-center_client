import { ChangeEvent, useEffect, useMemo, useState } from 'react';
import { ActionEnum, RuleStatusEnum, ProtocolEnum, RuleRequest, UserPublic } from '../api';
import MyApi from '../api/myapi';
import Papa from 'papaparse';
import {
  MaterialReactTable,
  useMaterialReactTable,
  type MRT_ColumnDef,
  type MRT_TableOptions,
  type MRT_Row,
  type MRT_TableInstance,
} from 'material-react-table';
import { toast } from 'react-toastify';
import { styled } from '@mui/material/styles';
import {
  Button,
  Box,
  IconButton,
  Tooltip,
  Typography,
  Container,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent
} from '@mui/material';
import {
  CloudUpload as CloudUploadIcon,
  Delete as DeleteIcon,
  Edit as EditIcon
} from '@mui/icons-material';
import { AxiosError } from "axios";
import { FirewallRuleCenterClientToastContainer } from '../../Generics';

export default function CreateRuleSetRequest() {

  const api = new MyApi();
  const rulesapi = api.rulesApi();
  const usersapi = api.usersApi();

  const [rules, setRules] = useState<RuleRequest[]>([]);
  const [users, setUsers] = useState<UserPublic[]>([]);
  const [approver, setApprover] = useState<UserPublic>();

  const getUsers = async () => {
    try {
      console.log("getUsers");
      const responseUsers = await usersapi.usersList();
      console.log(responseUsers.data);
      setUsers(responseUsers.data);
      toast.success("Loaded users successful");
    } catch (error) {
      console.log(error);
      if (error instanceof AxiosError && error.response) {
        toast.error("Loading failed: " + JSON.stringify(error.response.data.detail));
      }
    }
  }

  useEffect(() => {
    getUsers();
  }, []
  );

  const columns = useMemo<MRT_ColumnDef<RuleRequest>[]>(
    () => [
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


  const handleEditRule: MRT_TableOptions<RuleRequest>['onEditingRowSave'] = ({ row, table, values }) => {
    console.log("updatingRule");
    console.log("update: row", row);
    console.log("update: table", table);
    console.log("update: values", values);
    let rulesCopy = [...rules];
    rulesCopy[row.index] = {
      ...rulesCopy[row.index],
      'action': values.action,
      'protocol': values.protocol,
      'source_name': values.source_name,
      'source_ip_orig': values.source_ip_orig,
      'source_ip_nat': values.source_ip_nat,
      'source_port': !Number.isNaN(parseInt(values.source_port)) ? parseInt(values.source_port) : 0,
      'destination_name': values.destination_name,
      'destination_ip_orig': values.destination_ip_orig,
      'destination_ip_nat': values.destination_ip_nat,
      'destination_port': !Number.isNaN(parseInt(values.destination_port)) ? parseInt(values.destination_port) : 0,
      'requester': values.requester,
      'ticket': values.ticket,
      'notes': values.notes,
      'status': RuleStatusEnum.Req
    };
    setRules(rulesCopy);
    toast.success("Updated rule successful");
    table.setEditingRow(null); //exit editing mode
  };

  const handleCreateRule: MRT_TableOptions<RuleRequest>['onCreatingRowSave'] = ({ row, table, values }) => {
    console.log("creatingRule");
    console.log("update: row", row);
    console.log("update: table", table);
    console.log("update: values", values);
    console.log(rules);
    setRules(oldRules => [
      ...oldRules,
      {
        "action": values.action,
        "protocol": values.protocol,
        "source_name": values.source_name,
        "source_ip_orig": values.source_ip_orig,
        "source_ip_nat": values.source_ip_nat,
        "source_port": !Number.isNaN(parseInt(values.source_port)) ? parseInt(values.source_port) : 0,
        "destination_name": values.destination_name,
        "destination_ip_orig": values.destination_ip_orig,
        "destination_ip_nat": values.destination_ip_nat,
        "destination_port": !Number.isNaN(parseInt(values.destination_port)) ? parseInt(values.destination_port) : 0,
        "requester": values.requester,
        "ticket": values.ticket,
        "notes": values.notes,
        "status": RuleStatusEnum.Req,
      }
    ]);
    toast.success("Updated rule successful");
    console.log(rules);
    table.setCreatingRow(null); //exit creating mode
  };

  const handleDeleteRule = (row: MRT_Row<RuleRequest>) => {
    console.log("deleting Rule " + row.index + " from state");
    console.log(row.original);
    console.log(rules);
    setRules(rules.filter((_, index) => (index !== row.index))); // TODO better to compare objects
    console.log(rules);
  };

  const createRuleSetRequest = async () => {
    try {
      console.log("createRuleSet");
      if (approver) {
        const responseRuleSetRequestCreate = await rulesapi.rulesRequestsCreate(
          { "approver": approver }
        );
        console.log(responseRuleSetRequestCreate.data);
        toast.success("Created ruleSetRequest successful");
        return responseRuleSetRequestCreate.data.pk;
      }
    } catch (error) {
      console.log(error);
      if (error instanceof AxiosError && error.response) {
        toast.error("Loading failed: " + JSON.stringify(error.response.data));
      }
      return null;
    }
  }

  const createRule = async (rule: RuleRequest, ruleSetNumber: number) => {
    try {
      console.log("getRule");
      const responseRuleCreate = await rulesapi.rulesCreate({ ...rule, 'rule_set_request': ruleSetNumber });
      console.log(responseRuleCreate.data);
      toast.success("Created rule successful");
    } catch (error) {
      console.log(error);
      if (error instanceof AxiosError && error.response) {
        toast.error("Loading failed: " + JSON.stringify(error.response.data));
      }
    }
  }

  const handleCreateRuleSetRequest = async (table: MRT_TableInstance<RuleRequest>) => {
    console.log("creating rulesetrequest");
    console.log(rules);
    console.log(table.getRowModel().rows);

    const ruleSetRequestId = await createRuleSetRequest();
    if (ruleSetRequestId) {
      // TODO Change Create Serializer to accept many Rules at once
      // many=True
      // TODO RuleSetRequest is created, even if the rules are invalid
      rules.forEach(rule => {
        createRule(rule, ruleSetRequestId);
      });
    }
  };

  const handleFileUpload = (event: ChangeEvent<HTMLInputElement>) => {
    console.log("upload");
    const eventFiles: FileList | null = event.target.files;
    if (eventFiles && eventFiles.length == 1 && eventFiles[0] instanceof File) {
      Papa.parse<RuleRequest, File>(
        eventFiles[0],
        {
          delimiter: ',',
          header: true,
          dynamicTyping: true,
          complete: (results, file) => {
            if (results.errors.length !== 0) {
              console.log("CSV-parsing-errors", results.errors);
              toast.error(`Some errors appear when reading ${file.name}`);
            } else {
              console.log(results);
              const newResults = results.data.map(element => {
                return {
                  "action": element.action,
                  "protocol": element.protocol,
                  "source_name": element.source_name,
                  "source_ip_orig": element.source_ip_orig,
                  "source_ip_nat": element.source_ip_nat,
                  "source_port": element.source_port,
                  "destination_name": element.destination_name,
                  "destination_ip_orig": element.destination_ip_orig,
                  "destination_ip_nat": element.destination_ip_nat,
                  "destination_port": element.destination_port,
                  "requester": element.requester,
                  "ticket": element.ticket,
                  "rule_set_request": 0,
                  "notes": element.notes,
                  "firewalls": element.firewalls,
                  "status": RuleStatusEnum.Req,
                  "is_deleted": false,
                }
              });
              console.log(newResults);
              setRules(oldRules => [
                ...oldRules,
                ...newResults
              ]);
              toast.success(`Import of file ${file.name} successful`);
            }
          },
          error: (error, file) => {
            console.log(error, file);
          }
        }
      );
    }
  };

  const handleSelectChange = (event: SelectChangeEvent) => {
    const { name, value } = event.target;
    console.log(name, value);
    if (users) {
      setApprover(users.filter((user) => user.id == parseInt(value))[0]);
    }
  };

  const table = useMaterialReactTable({
    columns: columns,
    data: rules,
    enableColumnResizing: true,
    enableDensityToggle: false,
    enableEditing: true,
    editDisplayMode: 'row', // row fixes the problem in table mode
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
    displayColumnDefOptions: {
      'mrt-row-actions': {
        size: 92, // 2*40px per icon + 0.75rem gap
      },
    },
    renderRowActions: ({ row }) => (
      <Box sx={{ display: 'flex', gap: '0.75rem' }}>
        <Tooltip title="Delete">
          <IconButton color="error" onClick={() => handleDeleteRule(row)}>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Edit">
          <IconButton color="warning" onClick={() => table.setEditingRow(row)}>
            <EditIcon />
          </IconButton>
        </Tooltip>
      </Box>
    ),
    renderTopToolbarCustomActions: ({ table }) => (
      <Box sx={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <Button component="label" variant="contained" startIcon={<CloudUploadIcon />}>
          Upload file
          <VisuallyHiddenInput type="file" id="fileUpload" onChange={handleFileUpload} />
        </Button>
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
          Create New Rule
        </Button>
      </Box>
    ),
    renderBottomToolbarCustomActions: () => (
      <Box sx={{ display: 'flex', gap: '1rem', alignItems: 'center', width: '300px' }}>
        <FormControl fullWidth size="small">
          <InputLabel id="action-label">Approver</InputLabel>
          <Select
            id="approver"
            name="approver"
            labelId="approver-label"
            label="Approver"
            onChange={handleSelectChange}
            value={approver?.id ? approver.id.toString() : ''}
          >
            {
              Object.values(users).map((value) => {
                return <MenuItem value={value.id}>{value.username}</MenuItem>
              })
            }
          </Select>
        </FormControl>
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
    <Container maxWidth={false}>
      <Typography variant="h4" gutterBottom>
        Create RuleSetRequest
      </Typography>

      <MaterialReactTable table={table} />

      <FirewallRuleCenterClientToastContainer />
    </Container>
  );
}