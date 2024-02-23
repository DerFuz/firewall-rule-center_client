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
  Divider,
  Stack
} from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import { AxiosError } from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import HistoryTable, { returnHistoryTypeIcon } from '../HistoryTable/HistoryTable';
import { FirewallRuleCenterClientToastContainer, dateTimeFormatLong } from '../../Generics';
import CustomAppBar from '../CustomAppBar/CustomAppBar';

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
      console.log('RuleSetRequestEntry |', 'Fetching rulesetrequest data for id', id);
      const responseRuleSetRequest = await rulesapi.rulesRequestsRetrieve(id);
      console.log('RuleSetRequestEntry |', 'Fetched rulesetrequest data:', responseRuleSetRequest.data);
      setRuleSetRequest(responseRuleSetRequest.data);
      toast.success(`Loaded rulesetrequest ${id} successful`);
    } catch (error) {
      console.log('RuleSetRequestEntry |', 'Error fetching rulesetrequest data:', error);
      if (error instanceof AxiosError && error.response) {
        toast.error(`Loading rulesetrequest ${id} failed: ` + JSON.stringify(error.response.data.detail));
      }
    }
  }

  useEffect(() => {
    if (rulesetrequestId !== undefined && !Number.isNaN(parseInt(rulesetrequestId))) {
      const id = parseInt(rulesetrequestId);
      console.log('RuleSetRequestEntry |', 'Parsed rulesetrequest id:', id);
      getRuleSetRequest(id);
    } else {
      navigate('..');
    }
  }, [rulesetrequestId, navigate]
  );

  const approveRuleSetRequest = async () => {
    if (ruleSetRequest?.pk === undefined) {
      console.log('RuleSetRequestEntry |', 'No rulesetrequest-ID');
      return
    }
    try {
      console.log('RuleSetRequestEntry |', 'Approving rulesetrequest', ruleSetRequest.pk);
      const responseApproveRuleSetRequest = await rulesapi.rulesRequestsApproveRetrieve(ruleSetRequest.pk);
      console.log('RuleSetRequestEntry |', 'Approved rulesetrequest:', responseApproveRuleSetRequest.data);
      toast.success(`Approved rulesetrequest ${ruleSetRequest.pk} successful`);
    } catch (error) {
      console.log('RuleSetRequestEntry |', 'Error approving rulesetrequest:', error);
      if (error instanceof AxiosError && error.response) {
        toast.error(`Approving rulesetrequest ${ruleSetRequest.pk} failed: ` + JSON.stringify(error.response.data));
      }
    }
  };

  const refuseRuleSetRequest = async () => {
    if (ruleSetRequest?.pk === undefined) {
      console.log('RuleSetRequestEntry |', 'No rulesetrequest-ID');
      return
    }
    try {
      console.log('RuleSetRequestEntry |', 'Refusing rulesetrequest', ruleSetRequest.pk);
      const responseApproveRuleSetRequest = await rulesapi.rulesRequestsRefuseRetrieve(ruleSetRequest.pk);
      console.log('RuleSetRequestEntry |', 'Refused rulesetrequest:', responseApproveRuleSetRequest.data);
      toast.success(`Refused rulesetrequest ${ruleSetRequest.pk} successful`);
    } catch (error) {
      console.log('RuleSetRequestEntry |', 'Error refusing rulesetrequest:', error);
      if (error instanceof AxiosError && error.response) {
        toast.error(`Refusing rulesetrequest ${ruleSetRequest.pk} failed: ` + JSON.stringify(error.response.data));
      }
    }
  };

  interface historyColumn {
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

  const historyColumns: historyColumn[] = [
    { id: 'history_type', label: 'History Type', format: (value: string) => returnHistoryTypeIcon(value) },
    { id: 'history_id', label: 'History ID' },
    { id: 'history_date', label: 'History Date', format: (value: string) => dateTimeFormatLong.format(new Date(value)) },
    { id: 'status', label: 'Status' },
    { id: 'approver_id', label: 'Approver' },
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
          color='success'
          variant='contained'
          onClick={approveRuleSetRequest}
          disabled={ruleSetRequest?.status !== RuleSetStatusEnum.Req || localStorage.getItem('username') !== ruleSetRequest.approver.username}
        >
          Approve
        </Button>
        <Button
          color='error'
          variant='contained'
          onClick={refuseRuleSetRequest}
          disabled={ruleSetRequest?.status !== RuleSetStatusEnum.Req || localStorage.getItem('username') !== ruleSetRequest.approver.username}
        >
          Refuse
        </Button>
      </Box>
    )
  });


  return (
    <Container maxWidth={false} disableGutters>
      <CustomAppBar />

      <Container maxWidth={false}>
        <Typography variant='h4' gutterBottom>
          RuleSetRequest {ruleSetRequest?.pk} Info
        </Typography>

        <Grid container spacing={2} sx={{ marginTop: 1, marginBottom: 1 }}>
          <Grid xs={12} sm={6} md={6}>
            Current Status: <Chip size='small' label={ruleSetRequest?.status} />
          </Grid>
          <Grid xs={12} sm={6} md={6}>
            Requester: <Chip size='small' avatar={<Avatar>{ruleSetRequest?.created_by.username ? ruleSetRequest.created_by.username[0].toUpperCase() : ''}</Avatar>} label={ruleSetRequest?.created_by.username} />
          </Grid>
          <Grid xs={12} sm={6} md={6}>
            Approver: <Chip size='small' avatar={<Avatar>{ruleSetRequest?.approver.username ? ruleSetRequest.approver.username[0].toUpperCase() : ''}</Avatar>} label={ruleSetRequest?.approver.username} />
          </Grid>
          <Grid xs={12} sm={6} md={6}>
            <Stack direction='column' spacing={0.5}>
              <span>
                <span>Created: </span>
                <Chip size='small' label={ruleSetRequest?.created_on ? dateTimeFormatLong.format(new Date(ruleSetRequest.created_on)) : ''} />
                <span> by </span>
                <Chip size='small' avatar={<Avatar>{ruleSetRequest?.created_by ? ruleSetRequest.created_by.username[0].toUpperCase() : ''}</Avatar>} label={ruleSetRequest?.created_by ? ruleSetRequest.created_by.username : ''} />
              </span>
            </Stack>
          </Grid>
          <Grid xs={12} sm={6} md={6}>
            <Stack direction='column' spacing={0.5}>
              <span>
                <span>Last updated: </span>
                <Chip size='small' label={ruleSetRequest?.last_updated_on ? dateTimeFormatLong.format(new Date(ruleSetRequest.last_updated_on)) : ''} />
                <span> by </span>
                <Chip size='small' avatar={<Avatar>{ruleSetRequest?.last_updated_by ? ruleSetRequest.last_updated_by.username[0].toUpperCase() : ''}</Avatar>} label={ruleSetRequest?.last_updated_by ? ruleSetRequest.last_updated_by.username : ''} />
              </span>
            </Stack>
          </Grid>
        </Grid>
        <MaterialReactTable table={table} />

        <Divider sx={{ marginTop: 5, marginBottom: 5 }} />
        <HistoryTable tableData={ruleSetRequest?.history ? ruleSetRequest.history : []} historyColumns={historyColumns} />

        <FirewallRuleCenterClientToastContainer />
      </Container>
    </Container>
  );
}