import { useEffect, useMemo, useRef, useState } from 'react';
import { Rule } from '../api';
import MyApi from '../api/myapi';
import { ToastContainer, toast, Flip } from 'react-toastify';
import "react-toastify/dist/ReactToastify.min.css";
import {
  MaterialReactTable,
  useMaterialReactTable,
  type MRT_ColumnDef,
  type MRT_SortingState,
  type MRT_Virtualizer,
} from 'material-react-table';
import { Box, IconButton } from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Mouse as MouseIcon,
} from '@mui/icons-material';
import { AxiosError } from 'axios';
import { useNavigate } from 'react-router-dom';


export default function RuleTable() {
  const navigate = useNavigate();

  const api = new MyApi();
  const rulesapi = api.rulesApi();

  const [rules, setRules] = useState<Rule[]>([]);

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

  const columns = useMemo<MRT_ColumnDef<Rule>[]>(
    () => [
      // {
      //   accessorKey: 'pk',
      //   header: 'ID',
      //   Cell: ({cell}) => (
      //     <a href={cell.row.original.detail_url}>{cell.getValue<Number>().toLocaleString()}</a>
      //   ),
      //   enableGlobalFilter: false,
      // },
      {
        accessorKey: 'status',
        header: 'Status',
        filterVariant: 'multi-select',
        enableGlobalFilter: false,
      },
      {
        accessorKey: 'action',
        header: 'Action',
        filterVariant: 'multi-select',
        enableGlobalFilter: false,
      },
      {
        accessorKey: 'protocol',
        header: 'Protocol',
        filterVariant: 'multi-select',
        enableGlobalFilter: false,
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
        enableGlobalFilter: false,
      },
      {
        accessorFn: (originalRow) => new Date(originalRow.last_updated_on),
        id: 'last_update_on',
        header: 'Last Update on',
        Cell: ({cell}) => (cell.getValue<Date>().toLocaleDateString('de-AT')),
        filterVariant: 'date-range',
        enableGlobalFilter: false,
      },
      {
        accessorKey: 'last_updated_by.username',
        header: 'Last Update by',
        filterVariant: 'multi-select',
        enableGlobalFilter: false,
      },
      {
        accessorFn: (originalRow) => new Date(originalRow.created_on),
        id: 'created_on',
        header: 'Created on',
        Cell: ({cell}) => (cell.getValue<Date>().toLocaleDateString('de-AT')),
        filterVariant: 'date-range',
        enableGlobalFilter: false,
      },
      {
        accessorKey: 'created_by.username',
        header: 'Created by',
        filterVariant: 'multi-select',
        enableGlobalFilter: false,
      },
    ],
    [],
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

  const table = useMaterialReactTable({
    columns: columns,
    data: rules,
    enableFacetedValues: true,
    enableColumnResizing: true,
    enableDensityToggle: false,
    initialState: { 
      showColumnFilters: true,
      density: 'compact',
      showGlobalFilter: true,
      pagination: {
        pageSize: 50,
        pageIndex: 0
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
          <MouseIcon />
        </IconButton>
        <IconButton color="secondary" onClick={() => {
              table.setEditingRow(row);
            }}>
          <EditIcon />
        </IconButton>
        <IconButton color="error" onClick={() => 
          window.open(
            `${row.original.delete_url}`, '_blank'
          )
        }>
          <DeleteIcon />
        </IconButton>
      </Box>
    ),
  });

  return (
    <div>
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
        limit={1}
        transition={Flip}
      />
    </div>
  );
}