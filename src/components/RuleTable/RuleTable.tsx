import { useEffect, useMemo, useRef, useState } from 'react';
import { ActionEnum, RuleStatusEnum, ProtocolEnum, Rule } from '../api';
import MyApi from '../api/myapi';
import { toast } from 'react-toastify';
import {
  MaterialReactTable,
  useMaterialReactTable,
  type MRT_ColumnDef,
  type MRT_SortingState,
  type MRT_Virtualizer,
  type MRT_TableOptions,
} from 'material-react-table';
import { 
  Box, 
  IconButton,
  Chip
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Pageview as PageviewIcon,
} from '@mui/icons-material';
import { AxiosError } from 'axios';
import { useNavigate } from 'react-router-dom';
import { dateTimeFormatShort, FirewallRuleCenterClientToastContainer } from '../../Generics';


export default function RuleTable() {
  const navigate = useNavigate();

  const api = new MyApi();
  const rulesapi = api.rulesApi();

  const [rules, setRules] = useState<Rule[]>([]);
  // const [validationErrors, setValidationErrors] = useState<Record<string, string | undefined>>({});

  const getRules = async () => {
    try {
      console.log("getRules");
      const response = await rulesapi.rulesList();
      setRules(response.data);
      toast.success("Loaded rules successful");
    } catch (error) {
      console.log(error);
      if (error instanceof AxiosError && error.response) {
        toast.error("Loading failed: " + error.response.data.detail);
      }
    }
  }

  const deleteRule = async (id: number | undefined) => {
    if (id === undefined) {
      console.log("ID is not valid")
      toast.error("ID is not valid")
      return
    }
    try {
      console.log("deleteRule");
      const responseDeleteRule = await rulesapi.rulesDeleteDestroy(id);
      console.log(responseDeleteRule.data);
      toast.success("Deleted rule successful");
    } catch (error) {
      console.log(error);
      if (error instanceof AxiosError && error.response) {
        toast.error("Loading failed: " + error.response.data.detail);
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
        Cell: ({cell}) => (
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
        Cell: ({cell}) => (dateTimeFormatShort.format(cell.getValue<Date>())),
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
        Cell: ({cell}) => (dateTimeFormatShort.format(cell.getValue<Date>())),
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

  const rowVirtualizerInstanceRef =
    useRef<MRT_Virtualizer<HTMLDivElement, HTMLTableRowElement>>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [sorting, setSorting] = useState<MRT_SortingState>([]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      getRules();
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    //scroll to the top of the table when the sorting changes
    try {
      rowVirtualizerInstanceRef.current?.scrollToIndex?.(0);
    } catch (error) {
      console.error(error);
    }
  }, [sorting]);

  const handleSaveRule: MRT_TableOptions<Rule>['onEditingRowSave'] = async ({row, table, values}) => {

    try {
      console.log("updatingRule");
      console.log("update: row", row);
      console.log("update: table", table);
      console.log("update: values", values);
      const responseUpdateRule = await rulesapi.rulesUpdatePartialUpdate(row.original.pk, values);
      console.log(responseUpdateRule.data);
      toast.success("Updated rule successful");
    } catch (error) {
      console.log(error);
      if (error instanceof AxiosError && error.response) {
        toast.error("Loading failed: " + error.response.statusText);
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
        "pk": false,
        "source_ip_nat": false,
        "source_port": false,
        "destination_ip_nat": false,
        "last_updated_on": false,
        "last_updated_by.username": false,
        "created_on": false,
        "created_by.username": false
      }
    },
    enableRowVirtualization: true,
    onSortingChange: setSorting,
    state: { isLoading, sorting },
    rowVirtualizerInstanceRef, //optional
    rowVirtualizerOptions: { overscan: 5 }, //optionally customize the row virtualizer
    enableRowActions: true,
    displayColumnDefOptions: {
      'mrt-row-actions': {
        size: 120,
      },
    },
    renderRowActions: ({ row, table }) => (
      <Box>
        <IconButton color="primary" onClick={() => navigate(`/rules/${row.original.pk}`)}>
          <PageviewIcon />
        </IconButton>
        <IconButton color="secondary" onClick={() => {table.setEditingRow(row)}}>
          <EditIcon />
        </IconButton>
        <IconButton color="error" onClick={() => deleteRule(row.original.pk)}>
          <DeleteIcon />
        </IconButton>
      </Box>
    ),
  });

  return (
    <div>
      <MaterialReactTable table={table} />
      <FirewallRuleCenterClientToastContainer />
    </div>
  );
}