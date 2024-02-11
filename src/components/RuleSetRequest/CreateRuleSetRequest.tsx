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
import { AxiosError } from 'axios';
import { FirewallRuleCenterClientToastContainer } from '../../Generics';
import CustomAppBar from '../CustomAppBar/CustomAppBar';

export default function CreateRuleSetRequest() {

  const api = new MyApi();
  const rulesapi = api.rulesApi();
  const usersapi = api.usersApi();

  const [rules, setRules] = useState<RuleRequest[]>([]);
  const [users, setUsers] = useState<UserPublic[]>([]);
  const [approver, setApprover] = useState<UserPublic>();

  const getUsers = async () => {
    try {
      console.log('CreateRuleSetRequest |', 'Fetching users');
      const responseUsers = await usersapi.usersList();
      console.log('CreateRuleSetRequest |', 'Fetched users data:', responseUsers.data);
      setUsers(responseUsers.data);
      toast.success('Loaded users successful');
    } catch (error) {
      console.log('CreateRuleSetRequest |', 'Error fetching users', error);
      if (error instanceof AxiosError && error.response) {
        toast.error('Loading users failed: ' + JSON.stringify(error.response.data.detail));
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
    console.log('CreateRuleSetRequest |', 'Updating local rulesetrequest-rule', row.index, ', values:', values);
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
      'requester': values.requester ? values.requester : localStorage.getItem('username'),
      'ticket': values.ticket,
      'notes': values.notes,
      'status': RuleStatusEnum.Req
    };
    console.log('CreateRuleSetRequest |', 'Updated local rulesetrequest-rule', row.index, ', values:', rules[row.index]);
    setRules(rulesCopy);
    table.setEditingRow(null); //exit editing mode
  };

  const handleCreateRule: MRT_TableOptions<RuleRequest>['onCreatingRowSave'] = ({ table, values }) => {
    console.log('CreateRuleSetRequest |', 'Creating local rulesetrequest-rule with values:', values);
    setRules(oldRules => [
      ...oldRules,
      {
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
        'requester': values.requester ? values.requester : localStorage.getItem('username'),
        'ticket': values.ticket,
        'notes': values.notes,
        'status': RuleStatusEnum.Req,
      }
    ]);
    // commented, because setRules is async and console.log will not print anything useful at this point
    // console.log('CreateRuleSetRequest |', 'Created local rulesetrequest-rule', rules.length, ' values:', rules[rules.length - 1]);
    table.setCreatingRow(null); //exit creating mode
  };

  const handleDeleteRule = (row: MRT_Row<RuleRequest>) => {
    console.log('CreateRuleSetRequest |', 'Deleting local rulesetrequest-rule', row.index, 'with values:', row.original);
    setRules(rules.filter((_, index) => (index !== row.index))); // TODO better to compare objects
  };

  const createRuleSetRequest = async () => {
    try {
      if (approver) {
        console.log('CreateRuleSetRequest |', 'Creating rulesetrequest');
        const responseRuleSetRequestCreate = await rulesapi.rulesRequestsCreate(
          { 'approver': approver }
        );
        console.log('CreateRuleSetRequest |', 'Created rulesetrequest (without rules yet):', responseRuleSetRequestCreate.data);
        toast.success('Created ruleSetRequest successful (without rules yet)');
        return responseRuleSetRequestCreate.data.pk;
      }
    } catch (error) {
      console.log('CreateRuleSetRequest |', 'Error creating rulesetrequest:', error);
      if (error instanceof AxiosError && error.response) {
        toast.error('Creating rulesetrequest failed: ' + JSON.stringify(error.response.data));
      }
      return null;
    }
  }

  const createRule = async (rule: RuleRequest, ruleSetNumber: number) => {
    try {
      console.log('CreateRuleSetRequest |', 'Creating rule for rulesetrequest', ruleSetNumber);
      const responseRuleCreate = await rulesapi.rulesCreate({ ...rule, 'rule_set_request': ruleSetNumber });
      console.log('CreateRuleSetRequest |', 'Created rule for rulesetrequest', ruleSetNumber, ':', responseRuleCreate.data);
      toast.success(`Created rule for rulesetrequest ${ruleSetNumber} successful`);
    } catch (error) {
      console.log('CreateRuleSetRequest |', 'Error creating rule for rulesetrequest', ruleSetNumber, ':', error);
      if (error instanceof AxiosError && error.response) {
        toast.error(`Creating rule for rulesetrequest ${ruleSetNumber} failed: ` + JSON.stringify(error.response.data));
      }
    }
  }

  const handleCreateRuleSetRequest = async (table: MRT_TableInstance<RuleRequest>) => {
    console.log('CreateRuleSetRequest |', 'Start creating rulesetrequest and its attached rules');

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
    console.log('CreateRuleSetRequest |', 'Rulesetrequest-rules are uploaded. Parsing...');
    const eventFiles: FileList | null = event.target.files;
    if (eventFiles && eventFiles.length === 1 && eventFiles[0] instanceof File) {
      Papa.parse<RuleRequest, File>(
        eventFiles[0],
        {
          delimiter: ',',
          header: true,
          dynamicTyping: true,
          complete: (results, file) => {
            if (results.errors.length !== 0) {
              console.log('CreateRuleSetRequest |', 'CSV-parsing-errors', results.errors);
              toast.error(`Some errors appear when reading ${file.name}`);
            } else {
              console.log('CreateRuleSetRequest |', 'CSV is parsed - not mapped yet:', results);
              const newResults = results.data.map(element => {
                return {
                  'action': element.action,
                  'protocol': element.protocol,
                  'source_name': element.source_name,
                  'source_ip_orig': element.source_ip_orig,
                  'source_ip_nat': element.source_ip_nat,
                  'source_port': element.source_port,
                  'destination_name': element.destination_name,
                  'destination_ip_orig': element.destination_ip_orig,
                  'destination_ip_nat': element.destination_ip_nat,
                  'destination_port': element.destination_port,
                  'requester': element.requester,
                  'ticket': element.ticket,
                  'rule_set_request': 0,
                  'notes': element.notes,
                  'firewalls': element.firewalls,
                  'status': RuleStatusEnum.Req,
                  'is_deleted': false,
                }
              });
              console.log('CreateRuleSetRequest |', 'CSV is parsed - and mapped:', newResults);
              setRules(oldRules => [
                ...oldRules,
                ...newResults
              ]);
              toast.success(`Import of file ${file.name} successful`);
            }
          },
          error: (error, file) => {
            console.log('CreateRuleSetRequest |', 'Error with CSV-parser:', error, file);
          }
        }
      );
    }
  };

  const handleSelectChange = (event: SelectChangeEvent) => {
    const { value } = event.target;
    if (users) {
      setApprover(users.filter((user) => user.id === parseInt(value))[0]);
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
        <Tooltip title='Delete'>
          <IconButton color='error' onClick={() => handleDeleteRule(row)}>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title='Edit'>
          <IconButton color='warning' onClick={() => table.setEditingRow(row)}>
            <EditIcon />
          </IconButton>
        </Tooltip>
      </Box>
    ),
    renderTopToolbarCustomActions: ({ table }) => (
      <Box sx={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <Button component='label' variant='contained' startIcon={<CloudUploadIcon />}>
          Upload file
          <VisuallyHiddenInput type='file' id='fileUpload' onChange={handleFileUpload} />
        </Button>
        <Button
          variant='contained'
          onClick={() => {
            table.setCreatingRow(true);
          }}
        >
          Create New Rule
        </Button>
      </Box>
    ),
    renderBottomToolbarCustomActions: () => (
      <Box sx={{ display: 'flex', gap: '1rem', alignItems: 'center', width: '300px' }}>
        <FormControl fullWidth size='small'>
          <InputLabel id='action-label'>Approver</InputLabel>
          <Select
            id='approver'
            name='approver'
            labelId='approver-label'
            label='Approver'
            onChange={handleSelectChange}
            value={approver?.id ? approver.id.toString() : ''}
          >
            {
              Object.values(users).map((value) => {
                return <MenuItem key={value.id} value={value.id}>{value.username}</MenuItem>
              })
            }
          </Select>
        </FormControl>
        <Button
          color='success'
          variant='contained'
          onClick={() => handleCreateRuleSetRequest(table)}
          disabled={
            Object.keys(rules).length === 0 || !approver?.id
          }
        >
          Save
        </Button>
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
    <Container maxWidth={false} disableGutters>
      <CustomAppBar />

      <Container maxWidth={false}>
        <Typography variant='h4' gutterBottom>
          Create RuleSetRequest
        </Typography>

        <MaterialReactTable table={table} />

        <FirewallRuleCenterClientToastContainer />
      </Container>
    </Container>
  );
}