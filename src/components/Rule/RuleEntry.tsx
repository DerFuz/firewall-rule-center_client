import React, { useEffect, useState } from 'react';
import { Rule, ActionEnum, ProtocolEnum, StatusEnum, FirewallObject } from '../api/api';
import MyApi from '../api/myapi';
import { ToastContainer, toast, Flip } from 'react-toastify';
import "react-toastify/dist/ReactToastify.min.css";

import { AxiosError } from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import Grid from '@mui/material/Unstable_Grid2';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import DoubleArrowRoundedIcon from '@mui/icons-material/DoubleArrowRounded';
import Chip from '@mui/material/Chip';
import OutlinedInput from '@mui/material/OutlinedInput';




function Copyright() {
  return (
    <Typography variant="body2" color="text.secondary" align="center">
      {'Copyright © '}
      <Link color="inherit" href="https://mui.com/">
        FRC
      </Link>{' '}
      {new Date().getFullYear()}.
    </Typography>
  );
}


export default function RuleEntry() {
  const { ruleId } = useParams();
  const navigate = useNavigate();
  console.log(useParams())
  
  const [rule, setRule] = useState<Rule>();
  const [ruleStatus, setRuleStatus] = useState('');
  const [ruleAction, setRuleAction] = useState('');
  const [ruleProtocol, setRuleProtocol] = useState('');
  const [ruleFirewalls, setRuleFirewalls] = useState<string[]>([]);
  const [firewalls, setFirewalls] = useState<FirewallObject[]>([]);


  useEffect(() => {
    if (ruleId !== undefined && !Number.isNaN(parseInt(ruleId))) {
      const id = parseInt(ruleId);
      console.log("parsed", id);
      getRule(id);
      getFirewalls();
    } else {
      navigate("..");
    }
  }, [ruleId, navigate]
  );

  const api = new MyApi();
  const rulesapi = api.rulesApi();
  const firewallsapi = api.firewallsApi();

  const getRule = async (id: number) => {
    try {
      console.log("getRule");
      const responseRule = await rulesapi.rulesRetrieve(id);
      console.log(responseRule.data);
      setRule(responseRule.data);
      setRuleStatus(responseRule.data.status);
      setRuleAction(responseRule.data.action);
      setRuleProtocol(responseRule.data.protocol);
      if (responseRule.data.firewalls) {
        setRuleFirewalls(responseRule.data.firewalls.map((firewall) => firewall.hostname));
      }
      toast.success("Loaded rule successful");
    } catch (error) {
      console.log(error);
      if (error instanceof AxiosError && error.response) {
        toast.error("Loading failed: " + error.response.data.detail);
      }
    }
  }

  const getFirewalls = async () => {
    try {
      console.log("getFirewalls");
      const responseFirewalls = await firewallsapi.firewallsList();
      console.log(responseFirewalls.data);
      setFirewalls(responseFirewalls.data);
      toast.success("Loaded firewalls successful");
    } catch (error) {
      console.log(error);
      if (error instanceof AxiosError && error.response) {
        toast.error("Loading failed: " + error.response.data.detail);
      }
    }
  }


  const handleChangeStatus = (event: SelectChangeEvent) => {
    setRuleStatus(event.target.value);
  };

  const handleChangeAction = (event: SelectChangeEvent) => {
    setRuleAction(event.target.value);
  };

  const handleChangeProtocol = (event: SelectChangeEvent) => {
    setRuleProtocol(event.target.value);
  };

  const handleChangeFirewalls = (event: SelectChangeEvent<typeof ruleFirewalls>) => {
    const {
      target: { value },
    } = event;
    setRuleFirewalls(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value,
    );  
  };

 
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
    <Container>
      <Box>
        <Typography variant="h4" component="h1" gutterBottom>
          Rule {rule?.pk} Info
        </Typography>
        <form>
        <Grid container spacing={2}>
        <Grid container>
            <Grid xs={12} sm={6} md={6}>
              <FormControl fullWidth>
                <InputLabel id="status-label">Status</InputLabel>
                <Select
                  id="status"
                  labelId="status-label"
                  label="Status"
                  onChange={handleChangeStatus}
                  value={ruleStatus}
                >
                  {
                    Object.entries(StatusEnum).map(([key, value]) => {
                      return <MenuItem value={value}>{value}</MenuItem>
                    })
                  }
                </Select>
              </FormControl>
            </Grid>
            <Grid xs={12} sm={6} md={6}>
              <FormControl fullWidth>
                <InputLabel id="action-label">Action</InputLabel>
                <Select
                  id="action"
                  labelId="action-label"
                  label="Action"
                  onChange={handleChangeAction}
                  value={ruleAction}
                >
                  {
                    Object.entries(ActionEnum).map(([key, value]) => {
                      return <MenuItem value={value}>{value}</MenuItem>
                    })
                  }
                </Select>
              </FormControl>
            </Grid>
            <Grid xs={12} sm={6} md={6}>
              <FormControl fullWidth>
                <InputLabel id="protocol-label">Protocol</InputLabel>
                <Select
                  id="protocol"
                  labelId="protocol-label"
                  label="Protocol"
                  onChange={handleChangeProtocol}
                  value={ruleProtocol}
                >
                  {
                    Object.entries(ProtocolEnum).map(([key, value]) => {
                      return <MenuItem value={value}>{value}</MenuItem>
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
                id="source-name"
                label="Source Name"
                InputLabelProps={{ shrink: true }}
                value={rule?.source_name}
              />
            </Grid>
            <Grid xs={12} sm={6} md={6}>
              <TextField 
                fullWidth 
                id="source-ip-orig" 
                label="Source IP (Original)" 
                InputLabelProps={{ shrink: true }} 
                value={rule?.source_ip_orig} 
              />
            </Grid>
            <Grid xs={12} sm={6} md={6}>
              <TextField 
                fullWidth 
                id="source-ip-nat" 
                label="Source IP (NAT)" 
                InputLabelProps={{ shrink: true }} 
                value={rule?.source_ip_nat} 
              />
            </Grid>
            <Grid xs={12} sm={6} md={6}>
              <TextField 
                fullWidth 
                id="source-port" 
                label="Source Port" 
                InputLabelProps={{ shrink: true }} 
                value={rule?.source_port === null ? '' : rule?.source_port} 
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
                id="destination-name" 
                label="Destination Name" 
                InputLabelProps={{ shrink: true }} 
                value={rule?.destination_name} 
              />
            </Grid>
            <Grid xs={12} sm={6} md={6}>
              <TextField 
                fullWidth 
                id="destination-ip-orig" 
                label="Destination IP (Original)" 
                InputLabelProps={{ shrink: true }} 
                value={rule?.destination_ip_orig} 
              />
            </Grid>
            <Grid xs={12} sm={6} md={6}>
              <TextField 
                fullWidth 
                id="destination-ip-nat" 
                label="Destination IP (NAT)"
                InputLabelProps={{ shrink: true }} 
                value={rule?.destination_ip_nat} 
              />
            </Grid>
            <Grid xs={12} sm={6} md={6}>
              <TextField 
                fullWidth 
                id="destination-port" 
                label="Destination Port" 
                InputLabelProps={{ shrink: true }} 
                value={rule?.destination_port === null ? '' : rule?.destination_port} 
              />
            </Grid>
          </Grid>
          <Grid container>
            <Grid xs={12} sm={6} md={6}>
              <FormControl sx={{ width: 300 }}>
                <InputLabel id="firewalls-label">Firewalls</InputLabel>
                <Select
                  id="firewalls"
                  labelId="firewalls-label"
                  label="Firewalls"
                  multiple
                  value={ruleFirewalls}
                  onChange={handleChangeFirewalls}
                  input={<OutlinedInput id="select-multiple-chip" label="Chip" />}
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
                    firewalls.map((firewall) => (
                      <MenuItem key={firewall.hostname} value={firewall.hostname}>{firewall.hostname}</MenuItem>
                    ))
                  }
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Grid>
        </form>
        <Copyright />
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar
          closeOnClick
          rtl={false}
          pauseOnFocusLoss={false}
          draggable={false}
          pauseOnHover
          limit={3}
          transition={Flip}
        />
      </Box>
    </Container>
  );
}