import { useEffect, useMemo, useState } from 'react';
import { RuleSetStatusEnum, Rule, RuleSetRequest } from '../api';
import MyApi from '../api/myapi';
import {
  MaterialReactTable,
  useMaterialReactTable,
  type MRT_ColumnDef,
} from 'material-react-table';
import { toast } from 'react-toastify';
import {
  Button,
  Box,
  Typography,
  Container,
  Chip,
  Avatar,
  Divider
} from '@mui/material';
import { AxiosError } from "axios";
import { useNavigate, useParams } from "react-router-dom";
import HistoryTable, { returnHistoryTypeIcon } from '../HistoryTable/HistoryTable';
import { FirewallRuleCenterClientToastContainer, dateTimeFormatLong } from '../../Generics';

export default function RuleSetRequestEntry() {

  const { rulesetrequestId } = useParams();
  const navigate = useNavigate();

  const api = new MyApi();
  const rulesapi = api.rulesApi();

  const [ruleSetRequest, setRuleSetRequest] = useState<RuleSetRequest>();

  const columns = useMemo<MRT_ColumnDef<Rule>[]>(
    () => [
      {
        accessorKey: 'action',
        header: 'Action',
        editVariant: 'select',
      },
      {
        accessorKey: 'protocol',
        header: 'Protocol',
        editVariant: 'select',
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

  const getRuleSetRequest = async (id: number) => {
    try {
      console.log("getRuleSetRequest");
      const responseRuleSetRequest = await rulesapi.rulesRequestsRetrieve(id);
      console.log(responseRuleSetRequest.data);
      setRuleSetRequest(responseRuleSetRequest.data);
      toast.success("Loaded rulesetrequest successful");
    } catch (error) {
      console.log(error);
      if (error instanceof AxiosError && error.response) {
        toast.error("Loading failed: " + JSON.stringify(error.response.data));
      }
    }
  }

  useEffect(() => {
    if (rulesetrequestId !== undefined && !Number.isNaN(parseInt(rulesetrequestId))) {
      const id = parseInt(rulesetrequestId);
      console.log("parsed", id);
      getRuleSetRequest(id);
    } else {
      navigate("..");
    }
  }, [rulesetrequestId, navigate]
  );

  const approveRuleSetRequest = async () => {
    console.log("approving rulesetrequest");
    try {
      console.log("approveRuleSetRequest");
      if (ruleSetRequest?.pk) {
        const responseApproveRuleSetRequest = await rulesapi.rulesRequestsApproveRetrieve(ruleSetRequest.pk);
        console.log(responseApproveRuleSetRequest.data);
        toast.success("Approved rulesetrequest successful");
      }
    } catch (error) {
      console.log(error);
      if (error instanceof AxiosError && error.response) {
        toast.error("Loading failed: " + JSON.stringify(error.response.data));
      }
    }
  };

  const refuseRuleSetRequest = async () => {
    console.log("refusing rulesetrequest");
    try {
      console.log("refusingRuleSetRequest");
      if (ruleSetRequest?.pk) {
        const responseApproveRuleSetRequest = await rulesapi.rulesRequestsRefuseRetrieve(ruleSetRequest.pk);
        console.log(responseApproveRuleSetRequest.data);
        toast.success("Refused rulesetrequest successful");
      }
    } catch (error) {
      console.log(error);
      if (error instanceof AxiosError && error.response) {
        toast.error("Loading failed: " + JSON.stringify(error.response.data));
      }
    }
  };

  interface historyColumns {
    id: 'history_type' |
      'history_id' |
      'history_date' | 
      'status' |
      'approver_id' |
      'created_on' |
      'last_updated_on' |
      'created_by_id' |
      'last_updated_by_id';
    label: string;
    minWidth?: number;
    align?: 'left';
    format?: (value: any) => string | JSX.Element;
  }

  const historyColumns: historyColumns[] = [
    { id: 'history_type', label: 'History Type', format: (value: string) => returnHistoryTypeIcon(value) },
    { id: 'history_id', label: 'History ID' },
    { id: 'history_date', label: 'History Date', format: (value: string) => dateTimeFormatLong.format(new Date(value)) },
    { id: 'status', label: 'Status' },
    { id: 'approver_id', label: 'Approver'},
    { id: 'created_on', label: 'Created On', format: (value: string) => dateTimeFormatLong.format(new Date(value)) },
    { id: 'last_updated_on', label: 'Last Updated On', format: (value: string) => dateTimeFormatLong.format(new Date(value)) },
    { id: 'created_by_id', label: 'Created By (ID)' },
    { id: 'last_updated_by_id', label: 'Last Updated By (ID)' },
  ];


  const table = useMaterialReactTable({
    columns: columns,
    data: ruleSetRequest?.related_rules ? ruleSetRequest.related_rules : [],
    enableColumnResizing: true,
    enableDensityToggle: false,
    initialState: {
      showColumnFilters: false,
      density: 'compact',
      showGlobalFilter: false,
      pagination: {
        pageSize: 50,
        pageIndex: 0
      },
    },
    renderBottomToolbarCustomActions: () => (
      <Box sx={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <Button
          color="success"
          variant="contained"
          onClick={approveRuleSetRequest}
          disabled={ruleSetRequest?.status !== RuleSetStatusEnum.Req}
        >
          Approve
        </Button>
        {/* {Object.values(validationErrors).some((error) => !!error) && (
                  <Typography color="error">Fix errors before submitting</Typography>
                )} */}
        <Button
          color="error"
          variant="contained"
          onClick={refuseRuleSetRequest}
          disabled={ruleSetRequest?.status !== RuleSetStatusEnum.Req}
        >
          Refuse
        </Button>
        {/* {Object.values(validationErrors).some((error) => !!error) && (
                  <Typography color="error">Fix errors before submitting</Typography>
                )} */}
      </Box>
    )
  });


  return (
    <div>
      <Container>
        <Typography variant="h4" gutterBottom>
          RuleSetRequest {ruleSetRequest?.pk}
        </Typography>
        <Box>
          Current Status: <Chip size="small" label={ruleSetRequest?.status} />
          Requester: <Chip size="small" avatar={<Avatar>{ruleSetRequest?.created_by.username ? ruleSetRequest.created_by.username[0].toUpperCase() : ""}</Avatar>} label={ruleSetRequest?.created_by.username} />
          Approver: <Chip size="small" avatar={<Avatar>{ruleSetRequest?.approver.username ? ruleSetRequest.approver.username[0].toUpperCase() : ""}</Avatar>} label={ruleSetRequest?.approver.username} />
        </Box>
      </Container>
      <MaterialReactTable table={table} />

      <Divider sx={{marginTop: 5, marginBottom: 5}} />        
      <HistoryTable tableData={ruleSetRequest?.history ? ruleSetRequest.history : []} historyColumns={historyColumns} />

      <FirewallRuleCenterClientToastContainer />
    </div>
  );
}