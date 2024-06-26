import { useEffect, useMemo, useState } from 'react';
import { ActionEnum, RuleStatusEnum, ProtocolEnum, Rule } from '../api';
import MyApi from '../api/myapi';
import { toast } from 'react-toastify';
import {
  MaterialReactTable,
  useMaterialReactTable,
  type MRT_ColumnDef,
  type MRT_SortingState,
  type MRT_TableOptions,
} from 'material-react-table';
import {
  Box,
  IconButton,
  Chip,
  Container,
  Typography
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Pageview as PageviewIcon,
} from '@mui/icons-material';
import { AxiosError } from 'axios';
import { useNavigate } from 'react-router-dom';
import { dateTimeFormatShort, FirewallRuleCenterClientToastContainer } from '../../Generics';
import CustomAppBar from '../CustomAppBar/CustomAppBar';


export default function RuleTable() {
  const navigate = useNavigate();

  const api = new MyApi();
  const rulesapi = api.rulesApi();

  const [rules, setRules] = useState<Rule[]>([]);
  // const [validationErrors, setValidationErrors] = useState<Record<string, string | undefined>>({});

  const getRules = async () => {
    try {
      console.log('RuleTable |', 'Fetching rules');
      const response = await rulesapi.rulesList();
      setRules(response.data);
      toast.success('Loaded rules successful');
    } catch (error) {
      console.log('RuleTable |', 'Error fetching rules:', error);
      if (error instanceof AxiosError && error.response) {
        toast.error('Loading rules failed: ' + JSON.stringify(error.response.data.detail));
      }
    }
  }

  const deleteRule = async (id: number | undefined) => {
    if (id === undefined) {
      console.log('RuleTable |', 'Given rule-ID', id, 'is invalid');
      toast.error('ID is not valid')
      return
    }
    try {
      console.log('RuleTable |', 'Deleting rule id', id);
      const responseDeleteRule = await rulesapi.rulesDeleteDestroy(id);
      console.log('RuleTable |', 'Deleted rule id:', responseDeleteRule);
      toast.success(`Deleted rule ${id} successful`);
    } catch (error) {
      console.log('RuleTable |', 'Error deleting rule:', error);
      if (error instanceof AxiosError && error.response) {
        toast.error(`Deleting rule ${id} failed: ` + JSON.stringify(error.response.data.detail));
      }
    }
  }

  const columns = useMemo<MRT_ColumnDef<Rule>[]>(
    () => [
      {
        accessorKey: 'pk',
        header: 'ID',
        enableGlobalFilter: false,
        enableEditing: false,
      },
      {
        accessorKey: 'status',
        header: 'Status',
        filterVariant: 'multi-select',
        enableGlobalFilter: false,
        editVariant: 'select',
        editSelectOptions: Object.values(RuleStatusEnum),
        // muiEditTextFieldProps: {
        //   select: true,
        //   error: !!validationErrors?.state,
        //   helperText: validationErrors?.state,
        // },
      },
      {
        accessorKey: 'action',
        header: 'Action',
        filterVariant: 'multi-select',
        enableGlobalFilter: false,
        editVariant: 'select',
        editSelectOptions: Object.values(ActionEnum),
      },
      {
        accessorKey: 'protocol',
        header: 'Protocol',
        filterVariant: 'multi-select',
        enableGlobalFilter: false,
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
        filterVariant: 'multi-select',
      },
      {
        accessorKey: 'source_ip_nat',
        header: 'Source IP (NAT)',
        filterVariant: 'multi-select',
      },
      {
        accessorFn: (originalRow) => (originalRow.source_port?.toLocaleString()),
        id: 'source_port',
        header: 'Source Port',
        filterVariant: 'multi-select',
        enableGlobalFilter: false,
      },
      {
        accessorKey: 'destination_name',
        header: 'Destination Name',
      },
      {
        accessorKey: 'destination_ip_orig',
        header: 'Destination IP',
        filterVariant: 'multi-select',
      },
      {
        accessorKey: 'destination_ip_nat',
        header: 'Destination IP (NAT)',
        filterVariant: 'multi-select',
      },
      {
        accessorFn: (originalRow) => (originalRow.destination_port?.toLocaleString()),
        id: 'destination_port',
        header: 'Destination Port',
        filterVariant: 'multi-select',
        enableGlobalFilter: false,
      },
      {
        accessorKey: 'notes',
        header: 'Notes',
      },
      {
        accessorKey: 'requester',
        header: 'Requester',
        enableGlobalFilter: false,
      },
      {
        accessorKey: 'ticket',
        header: 'Ticket',
      },
      {
        accessorKey: 'rule_set_request',
        header: 'Rule Set Request',
        Cell: ({ cell }) => (
          cell.getValue<number>()
            ? <Chip label={`${cell.getValue<number>()}`} onClick={() => navigate(`/rulesetrequest/${cell.getValue<number>()}/`)} />
            : ''
        ),
        enableGlobalFilter: false,
        enableEditing: false,
      },
      {
        accessorFn: (originalRow) => new Date(originalRow.last_updated_on),
        id: 'last_updated_on',
        header: 'Last Update on',
        Cell: ({ cell }) => (dateTimeFormatShort.format(cell.getValue<Date>())),
        filterVariant: 'date-range',
        enableGlobalFilter: false,
        enableEditing: false,
      },
      {
        accessorKey: 'last_updated_by.username',
        header: 'Last Update by',
        filterVariant: 'multi-select',
        enableGlobalFilter: false,
        enableEditing: false,
      },
      {
        accessorFn: (originalRow) => new Date(originalRow.created_on),
        id: 'created_on',
        header: 'Created on',
        Cell: ({ cell }) => (dateTimeFormatShort.format(cell.getValue<Date>())),
        filterVariant: 'date-range',
        enableGlobalFilter: false,
        enableEditing: false,
      },
      {
        accessorKey: 'created_by.username',
        header: 'Created by',
        filterVariant: 'multi-select',
        enableGlobalFilter: false,
        enableEditing: false,
      },
    ],
    []
    // [validationErrors],
  );

  const [isLoading, setIsLoading] = useState(true);
  const [sorting, setSorting] = useState<MRT_SortingState>([]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      getRules();
      setIsLoading(false);
    }
  }, []);

  const handleSaveRule: MRT_TableOptions<Rule>['onEditingRowSave'] = async ({ row, table, values }) => {
    try {
      console.log('RuleTable |', 'Updating rule', row.original.pk, ', values:', values);
      const responseUpdateRule = await rulesapi.rulesUpdatePartialUpdate(row.original.pk, values);
      console.log('RuleTable |', 'Updated rule id', row.original.pk, ':', responseUpdateRule.data);
      toast.success(`Updated rule ${row.original.pk} successful`);
    } catch (error) {
      console.log('RuleTable |', 'Error updating rule for id', row.original.pk, ':', error);
      if (error instanceof AxiosError && error.response) {
        toast.error(`Updating rule ${row.original.pk} failed: ` + JSON.stringify(error.response.statusText));
      }
    }
    table.setEditingRow(null); //exit editing mode
  };


  const table = useMaterialReactTable({
    columns: columns,
    data: rules,
    enableFacetedValues: true,
    enableColumnResizing: true,
    enableDensityToggle: false,
    enableEditing: true,
    editDisplayMode: 'row',
    onEditingRowSave: handleSaveRule,
    // onEditingRowCancel: () => setValidationErrors({}),
    initialState: {
      showColumnFilters: true,
      density: 'compact',
      showGlobalFilter: true,
      pagination: {
        pageSize: 50,
        pageIndex: 0
      },
      columnVisibility: {
        'pk': false,
        'source_ip_nat': false,
        'source_port': false,
        'destination_ip_nat': false,
        'last_updated_on': false,
        'last_updated_by.username': false,
        'created_on': false,
        'created_by.username': false
      }
    },
    onSortingChange: setSorting,
    state: { isLoading, sorting },
    enableRowActions: true,
    displayColumnDefOptions: {
      'mrt-row-actions': {
        size: 120,
      },
    },
    renderRowActions: ({ row, table }) => (
      <Box>
        <IconButton color='primary' onClick={() => navigate(`/rules/${row.original.pk}`)}>
          <PageviewIcon />
        </IconButton>
        <IconButton color='secondary' onClick={() => { table.setEditingRow(row) }}>
          <EditIcon />
        </IconButton>
        <IconButton color='error' onClick={() => deleteRule(row.original.pk)}>
          <DeleteIcon />
        </IconButton>
      </Box>
    ),
  });

  return (
    <Container maxWidth={false} disableGutters>
      <CustomAppBar />

      <Container maxWidth={false}>
      <Typography variant='h4' gutterBottom>
        Ruletable
      </Typography>

      <MaterialReactTable table={table} />
      
      <FirewallRuleCenterClientToastContainer />
      </Container>
    </Container>
  );
}