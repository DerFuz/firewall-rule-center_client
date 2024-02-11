import React, { useEffect, useState } from 'react';
import { Rule, ActionEnum, ProtocolEnum, RuleStatusEnum, FirewallObject } from '../api/api';
import MyApi from '../api/myapi';
import { toast } from 'react-toastify';
import { AxiosError } from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import HistoryTable, { returnHistoryTypeIcon } from '../HistoryTable/HistoryTable';
import { dateTimeFormatLong, FirewallRuleCenterClientToastContainer } from '../../Generics';
import {
  Container,
  Avatar,
  Chip,
  Typography,
  Box,
  TextField,
  FormControl,
  Button,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  SelectChangeEvent,
  Stack,
  Divider
} from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import {
  DoubleArrowRounded as DoubleArrowRoundedIcon,
  Save as SaveIcon,
  Delete as DeleteIcon,
  Info as InfoIcon
} from '@mui/icons-material';
import CustomAppBar from '../CustomAppBar/CustomAppBar';


export default function RuleEntry() {
  const { ruleId } = useParams();
  const navigate = useNavigate();

  const [rule, setRule] = useState<Rule>();
  const [allFirewalls, setAllFirewalls] = useState<FirewallObject[]>([]);

  useEffect(() => {
    if (ruleId !== undefined && !Number.isNaN(parseInt(ruleId))) {
      const id = parseInt(ruleId);
      console.log('RuleEntry |', 'Parsed rule id:', id);
      getRule(id);
      getFirewalls();
    } else {
      navigate('..');
    }
  }, [ruleId, navigate]
  );

  const api = new MyApi();
  const rulesapi = api.rulesApi();
  const firewallsapi = api.firewallsApi();

  const getRule = async (id: number) => {
    try {
      console.log('RuleEntry |', 'Fetching rule data for id', id);
      const responseRule = await rulesapi.rulesRetrieve(id);
      console.log('RuleEntry |', 'Fetched rule data:', responseRule.data);
      setRule(responseRule.data);
      toast.success(`Loaded rule ${id} successful`);
    } catch (error) {
      console.log('RuleEntry |', 'Error fetching rule data:', error);
      if (error instanceof AxiosError && error.response) {
        toast.error(`Loading rule ${id} failed: ` + JSON.stringify(error.response.data.detail));
      }
    }
  }

  const getFirewalls = async () => {
    try {
      console.log('RuleEntry |', 'Fetching firewalls');
      const responseFirewalls = await firewallsapi.firewallsList();
      console.log('RuleEntry |', 'Fetched firewalls data:', responseFirewalls.data);
      setAllFirewalls(responseFirewalls.data);
      toast.success('Loaded firewalls successful');
    } catch (error) {
      console.log('RuleEntry |', 'Error fetching firewalls', error);
      if (error instanceof AxiosError && error.response) {
        toast.error('Loading firewalls failed: ' + JSON.stringify(error.response.data.detail));
      }
    }
  }

  const deleteRule = async (id: number | undefined) => {
    if (id === undefined) {
      console.log('RuleEntry |', 'Given rule-ID', id, 'is invalid');
      toast.error('ID is not valid')
      return
    }
    try {
      console.log('RuleEntry |', 'Deleting rule id', id);
      const responseDeleteRule = await rulesapi.rulesDeleteDestroy(id);
      console.log('RuleEntry |', 'Deleted rule id:', responseDeleteRule);
      toast.success(`Deleted rule ${id} successful`);
    } catch (error) {
      console.log('RuleEntry |', 'Error deleting rule:', error);
      if (error instanceof AxiosError && error.response) {
        toast.error(`Deleting rule ${id} failed: ` + JSON.stringify(error.response.data.detail));
      }
    }
  }

  const updateRule = async () => {
    try {
      if (rule) {
        console.log('RuleEntry |', 'Updating rule id', rule.pk);
        const responseUpdateRule = await rulesapi.rulesUpdatePartialUpdate(rule.pk, rule);
        console.log('RuleEntry |', 'Updated rule id:', responseUpdateRule.data);
        toast.success(`Deleted rule ${rule.pk} successful`);
      }
    } catch (error) {
      console.log('RuleEntry |', 'Error updating rule:', error);
      if (error instanceof AxiosError && error.response) {
        toast.error(`Updating rule ${rule?.pk} failed: ` + JSON.stringify(error.response.statusText));
      }
    }
  }

  const handleTextFieldChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    if (rule) {
      setRule({
        ...rule,
        [name]: value,
      });
    }
    else {
      console.log('RuleEntry |', 'No existing rule instance');
    }
  };

  const handleSelectChange = (event: SelectChangeEvent) => {
    const { name, value } = event.target;
    if (rule) {
      switch (name) {
        case 'status':
          setRule({
            ...rule,
            [name]: value as RuleStatusEnum
          });
          break;
        case 'action':
          setRule({
            ...rule,
            [name]: value as ActionEnum
          });
          break;
        case 'protocol':
          setRule({
            ...rule,
            [name]: value as ProtocolEnum
          });
          break;
      }
    }
    else {
      console.log('RuleEntry |', 'No existing rule instance');
    }
  };

  const handleChangeFirewalls = (event: SelectChangeEvent<string[]>) => {
    const { value } = event.target;
    if (rule) {
      setRule({
        ...rule,
        'firewalls': Object.values(allFirewalls).filter(firewall => value.includes(firewall.hostname))
      });
    }
    else {
      console.log('RuleEntry |', 'No existing rule instance');
    }
  };

  interface historyColumn {
    id: 'history_type' |
    'history_id' |
    'history_date' |
    'action' |
    'protocol' |
    'source_name' |
    'source_ip_orig' |
    'source_ip_nat' |
    'source_port' |
    'destination_name' |
    'destination_ip_orig' |
    'destination_ip_nat' |
    'destination_port' |
    'status' |
    'requester' |
    'created_on' |
    'last_updated_on' |
    'ticket' |
    'notes' |
    'is_deleted' |
    'created_by_id' |
    'last_updated_by_id' |
    'rule_set_request_id';
    label: string;
    minWidth?: number;
    align?: 'left';
    format?: (value: any) => string | JSX.Element;
  }

  const historyColumns: historyColumn[] = [
    { id: 'history_type', label: 'History Type', format: (value: string) => returnHistoryTypeIcon(value) },
    { id: 'history_id', label: 'History ID' },
    { id: 'history_date', label: 'History Date', format: (value: string) => dateTimeFormatLong.format(new Date(value)) },
    { id: 'action', label: 'Action' },
    { id: 'protocol', label: 'Protocol' },
    { id: 'source_name', label: 'Source Name' },
    { id: 'source_ip_orig', label: 'Source IP (Original)' },
    { id: 'source_ip_nat', label: 'Source IP (NAT)' },
    { id: 'source_port', label: 'Source Port' },
    { id: 'destination_name', label: 'Destination Name' },
    { id: 'destination_ip_orig', label: 'Destination IP (Original)' },
    { id: 'destination_ip_nat', label: 'Destination IP (NAT)' },
    { id: 'destination_port', label: 'Destination Port' },
    { id: 'status', label: 'Status' },
    { id: 'requester', label: 'Requester' },
    { id: 'created_on', label: 'Created On', format: (value: string) => dateTimeFormatLong.format(new Date(value)) },
    { id: 'last_updated_on', label: 'Last Updated On', format: (value: string) => dateTimeFormatLong.format(new Date(value)) },
    { id: 'ticket', label: 'Ticket' },
    { id: 'notes', label: 'Notes' },
    { id: 'is_deleted', label: 'Is Deleted?' },
    { id: 'created_by_id', label: 'Created By (ID)' },
    { id: 'last_updated_by_id', label: 'Last Updated By (ID)' },
    { id: 'rule_set_request_id', label: 'Rule Set Request (ID)' },
  ];

  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 250,
      },
    },
  };

  return (
    <Container maxWidth={false} disableGutters>
      <CustomAppBar />

      <Container maxWidth={false}>
        <Typography variant='h4' gutterBottom>
          Rule {rule?.pk} Info
        </Typography>

        <Grid container spacing={2} sx={{ marginTop: 1, marginBottom: 1 }}>
          <Grid container>
            <Grid xs={12} sm={6} md={6}>
              <FormControl fullWidth>
                <InputLabel id='status-label'>Status</InputLabel>
                <Select
                  id='status'
                  name='status'
                  labelId='status-label'
                  label='Status'
                  onChange={handleSelectChange}
                  value={rule?.status ? rule.status : ''}
                >
                  {
                    Object.values(RuleStatusEnum).map((value) => {
                      return <MenuItem key={value} value={value}>{value}</MenuItem>
                    })
                  }
                </Select>
              </FormControl>
            </Grid>
            <Grid xs={12} sm={6} md={6}>
              <FormControl fullWidth>
                <InputLabel id='action-label'>Action</InputLabel>
                <Select
                  id='action'
                  name='action'
                  labelId='action-label'
                  label='Action'
                  onChange={handleSelectChange}
                  value={rule?.action ? rule.action : ''}
                >
                  {
                    Object.values(ActionEnum).map((value) => {
                      return <MenuItem key={value} value={value}>{value}</MenuItem>
                    })
                  }
                </Select>
              </FormControl>
            </Grid>
            <Grid xs={12} sm={6} md={6}>
              <FormControl fullWidth>
                <InputLabel id='protocol-label'>Protocol</InputLabel>
                <Select
                  id='protocol'
                  name='protocol'
                  labelId='protocol-label'
                  label='Protocol'
                  onChange={handleSelectChange}
                  value={rule?.protocol ? rule.protocol : ''}
                >
                  {
                    Object.values(ProtocolEnum).map((value) => {
                      return <MenuItem key={value} value={value}>{value}</MenuItem>
                    })
                  }
                </Select>
              </FormControl>
            </Grid>
          </Grid>
          <Grid container>
            <Grid xs={12} sm={6} md={6}>
              <TextField
                fullWidth
                id='source_name'
                name='source_name'
                label='Source Name'
                InputLabelProps={{ shrink: true }}
                value={rule?.source_name ? rule.source_name : ''}
                onChange={handleTextFieldChange}
              />
            </Grid>
            <Grid xs={12} sm={6} md={6}>
              <TextField
                fullWidth
                id='source_ip_orig'
                name='source_ip_orig'
                label='Source IP (Original)'
                InputLabelProps={{ shrink: true }}
                value={rule?.source_ip_orig ? rule.source_ip_orig : ''}
                onChange={handleTextFieldChange}
              />
            </Grid>
            <Grid xs={12} sm={6} md={6}>
              <TextField
                fullWidth
                id='source_ip_nat'
                name='source_ip_nat'
                label='Source IP (NAT)'
                InputLabelProps={{ shrink: true }}
                value={rule?.source_ip_nat ? rule.source_ip_nat : ''}
                onChange={handleTextFieldChange}
              />
            </Grid>
            <Grid xs={12} sm={6} md={6}>
              <TextField
                fullWidth
                id='source_port'
                name='source_port'
                label='Source Port'
                InputLabelProps={{ shrink: true }}
                value={rule?.source_port ? rule.source_port : ''}
                onChange={handleTextFieldChange}
              />
            </Grid>
          </Grid>
          <Grid container>
            <Grid>
              <DoubleArrowRoundedIcon />
            </Grid>
          </Grid>
          <Grid container>
            <Grid xs={12} sm={6} md={6}>
              <TextField
                fullWidth
                id='destination_name'
                name='destination_name'
                label='Destination Name'
                InputLabelProps={{ shrink: true }}
                value={rule?.destination_name ? rule.destination_name : ''}
                onChange={handleTextFieldChange}
              />
            </Grid>
            <Grid xs={12} sm={6} md={6}>
              <TextField
                fullWidth
                id='destination_ip_orig'
                name='destination_ip_orig'
                label='Destination IP (Original)'
                InputLabelProps={{ shrink: true }}
                value={rule?.destination_ip_orig ? rule.destination_ip_orig : ''}
                onChange={handleTextFieldChange}
              />
            </Grid>
            <Grid xs={12} sm={6} md={6}>
              <TextField
                fullWidth
                id='destination_ip_nat'
                name='destination_ip_nat'
                label='Destination IP (NAT)'
                InputLabelProps={{ shrink: true }}
                value={rule?.destination_ip_nat ? rule.destination_ip_nat : ''}
                onChange={handleTextFieldChange}
              />
            </Grid>
            <Grid xs={12} sm={6} md={6}>
              <TextField
                fullWidth
                id='destination_port'
                name='destination_port'
                label='Destination Port'
                InputLabelProps={{ shrink: true }}
                value={rule?.destination_port ? rule.destination_port : ''}
                onChange={handleTextFieldChange}
              />
            </Grid>
          </Grid>
          <Grid container>
            <Grid xs={12} sm={6} md={6}>
              <TextField
                fullWidth
                id='ticket'
                name='ticket'
                label='Ticket'
                InputLabelProps={{ shrink: true }}
                value={rule?.ticket ? rule.ticket : ''}
                onChange={handleTextFieldChange}
              />
            </Grid>
            <Grid xs={12} sm={6} md={6}>
              <TextField
                fullWidth
                id='requester'
                name='requester'
                label='Requester'
                InputLabelProps={{ shrink: true }}
                value={rule?.requester ? rule.requester : ''}
                onChange={handleTextFieldChange}
              />
            </Grid>
            <Grid xs={12} sm={12} md={12}>
              <TextField
                fullWidth
                id='notes'
                name='notes'
                label='Notes'
                InputLabelProps={{ shrink: true }}
                value={rule?.notes ? rule.notes : ''}
                onChange={handleTextFieldChange}
              />
            </Grid>
          </Grid>
          <Grid container>
            <Grid xs={12} sm={6} md={6}>
              <FormControl sx={{ width: 300 }}>
                <InputLabel id='firewalls-label'>Firewalls</InputLabel>
                <Select
                  id='firewalls'
                  name='firewalls'
                  labelId='firewalls-label'
                  label='Firewalls'
                  multiple
                  value={rule?.firewalls ? Object.values(rule.firewalls).map(firewall => firewall.hostname) : []}
                  onChange={handleChangeFirewalls}
                  input={<OutlinedInput id='select-multiple-chip' label='Chip' />}
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.map((value) => (
                        <Chip key={value} label={value} />
                      ))}
                    </Box>
                  )}
                  MenuProps={MenuProps}
                >
                  {
                    allFirewalls.map((firewall) => (
                      <MenuItem key={firewall.hostname} value={firewall.hostname}>{firewall.hostname}</MenuItem>
                    ))
                  }
                </Select>
              </FormControl>
            </Grid>
          </Grid>
          {rule?.rule_set_request ?
            <Grid container>
              <Chip label={`Rulesetrequest ${rule?.rule_set_request}`} onClick={() => navigate(`/rulesetrequest/${rule?.rule_set_request}`)} />
            </Grid>
            : ''
          }
          <Grid container>
            <Stack direction='column' spacing={0.5}>
              <span>
                <span>Created: </span>
                <Chip size='small' label={rule?.created_on ? dateTimeFormatLong.format(new Date(rule.created_on)) : ''} />
                <span> by </span>
                <Chip size='small' avatar={<Avatar>{rule?.created_by ? rule.created_by.username[0].toUpperCase() : ''}</Avatar>} label={rule?.created_by ? rule.created_by.username : ''} />
              </span>
              <span>
                <span>Last updated: </span>
                <Chip size='small' label={rule?.last_updated_on ? dateTimeFormatLong.format(new Date(rule.last_updated_on)) : ''} />
                <span> by </span>
                <Chip size='small' avatar={<Avatar>{rule?.last_updated_by ? rule.last_updated_by.username[0].toUpperCase() : ''}</Avatar>} label={rule?.last_updated_by ? rule.last_updated_by.username : ''} />
              </span>
            </Stack>
          </Grid>
        </Grid>
        <Box sx={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <Button
            color='error'
            variant='contained'
            endIcon={<DeleteIcon />}
            onClick={() => deleteRule(rule?.pk)}
          >
            Delete
          </Button>
          <Button
            color='success'
            variant='contained'
            endIcon={<SaveIcon />}
            onClick={updateRule}
          >
            Update
          </Button>
        </Box>

        <Divider sx={{ marginTop: 5, marginBottom: 5 }} />
        <Typography variant='subtitle2'>
          <InfoIcon fontSize='small' />
          Firewalls history not implemented yet.
        </Typography>
        <HistoryTable tableData={rule?.history ? rule.history : []} historyColumns={historyColumns} />

        <FirewallRuleCenterClientToastContainer />
      </Container>
    </Container>
  );
}