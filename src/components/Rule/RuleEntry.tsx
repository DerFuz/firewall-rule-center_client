import React, { useEffect, useState } from 'react';
import { Rule, ActionEnum, ProtocolEnum, StatusEnum, FirewallObject } from '../api/api';
import MyApi from '../api/myapi';
import { ToastContainer, toast, Flip } from 'react-toastify';
import "react-toastify/dist/ReactToastify.min.css";

import { AxiosError } from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

import {
  Container,
  Avatar,
  Chip,
  Typography,
  Box,
  Link,
  TextField,
  FormControl,
  Button,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  SelectChangeEvent,
  Stack,
} from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import { 
  DoubleArrowRounded as DoubleArrowRoundedIcon,
  SaveOutlined as SaveOutlinedIcon,
  DeleteOutlined as DeleteOutlinedIcon
} from '@mui/icons-material';



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
  const [allFirewalls, setAllFirewalls] = useState<FirewallObject[]>([]);

  const dateTimeFormatLong = new Intl.DateTimeFormat('de-AT', 
    {
      weekday: "long",
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit"
    }
  );

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
      setAllFirewalls(responseFirewalls.data);
      toast.success("Loaded firewalls successful");
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

  const updateRule = async () => {
    console.log(rule);
    try {
      if (rule) {
        console.log("updatingRule");
        const responseUpdateRule = await rulesapi.rulesUpdatePartialUpdate(rule.pk, rule);
        console.log(responseUpdateRule.data);
        toast.success("Updated rule successful");
      }
    } catch (error) {
      console.log(error);
      if (error instanceof AxiosError && error.response) {
        toast.error("Loading failed: " + error.response.statusText);
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
      console.log("No existing rule instance");
    }
  };



  const handleSelectChange = (event: SelectChangeEvent) => {
    const { name, value } = event.target;
    if (rule) {
      console.log(name);
      switch (name) {
        case "status":
          setRule({
            ...rule,
            [name]: value as StatusEnum
          }); 
          break;
        case "action":
          setRule({
            ...rule,
            [name]: value as ActionEnum
          }); 
          break;
        case "protocol":
          setRule({
            ...rule,
            [name]: value as ProtocolEnum
          }); 
          break;
      }     
    }
    else {
      console.log("No existing rule instance");
    }
  };

 
  const handleChangeFirewalls = (event: SelectChangeEvent<string[]>) => {
    const { name, value } = event.target;
    if (rule) {
      console.log("firewalls", value, Object.values(allFirewalls).filter(firewall => value.includes(firewall.hostname)));
      setRule({
        ...rule,
        "firewalls": Object.values(allFirewalls).filter(firewall => value.includes(firewall.hostname))
      });
    }
    else {
      console.log("No existing rule instance");
    }
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
                  name="status"
                  labelId="status-label"
                  label="Status"
                  onChange={handleSelectChange}
                  value={rule?.status ? rule.status : ''}
                >
                  {
                    Object.values(StatusEnum).map((value) => {
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
                  name="action"
                  labelId="action-label"
                  label="Action"
                  onChange={handleSelectChange}
                  value={rule?.action ? rule.action : ''}
                >
                  {
                    Object.values(ActionEnum).map((value) => {
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
                  name="protocol"
                  labelId="protocol-label"
                  label="Protocol"
                  onChange={handleSelectChange}
                  value={rule?.protocol ? rule.protocol : ''}
                >
                  {
                    Object.values(ProtocolEnum).map((value) => {
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
                id="source_name"
                name="source_name"
                label="Source Name"
                InputLabelProps={{ shrink: true }}
                value={rule?.source_name}
                onChange={handleTextFieldChange}
              />
            </Grid>
            <Grid xs={12} sm={6} md={6}>
              <TextField 
                fullWidth 
                id="source_ip_orig" 
                name="source_ip_orig" 
                label="Source IP (Original)" 
                InputLabelProps={{ shrink: true }} 
                value={rule?.source_ip_orig}
                onChange={handleTextFieldChange}
              />
            </Grid>
            <Grid xs={12} sm={6} md={6}>
              <TextField 
                fullWidth 
                id="source_ip_nat" 
                name="source_ip_nat" 
                label="Source IP (NAT)" 
                InputLabelProps={{ shrink: true }} 
                value={rule?.source_ip_nat}                
                onChange={handleTextFieldChange}
              />
            </Grid>
            <Grid xs={12} sm={6} md={6}>
              <TextField 
                fullWidth 
                id="source_port" 
                name="source_port" 
                label="Source Port" 
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
                id="destination_name" 
                name="destination_name" 
                label="Destination Name" 
                InputLabelProps={{ shrink: true }} 
                value={rule?.destination_name}
                onChange={handleTextFieldChange}
              />
            </Grid>
            <Grid xs={12} sm={6} md={6}>
              <TextField 
                fullWidth 
                id="destination_ip_orig" 
                name="destination_ip_orig" 
                label="Destination IP (Original)" 
                InputLabelProps={{ shrink: true }} 
                value={rule?.destination_ip_orig}
                onChange={handleTextFieldChange}
              />
            </Grid>
            <Grid xs={12} sm={6} md={6}>
              <TextField 
                fullWidth 
                id="destination_ip_nat" 
                name="destination_ip_nat" 
                label="Destination IP (NAT)"
                InputLabelProps={{ shrink: true }}
                value={rule?.destination_ip_nat}
                onChange={handleTextFieldChange}
              />
            </Grid>
            <Grid xs={12} sm={6} md={6}>
              <TextField 
                fullWidth 
                id="destination_port" 
                name="destination_port" 
                label="Destination Port" 
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
                id="ticket" 
                name="ticket" 
                label="Ticket" 
                InputLabelProps={{ shrink: true }} 
                value={rule?.ticket}
                onChange={handleTextFieldChange}
              />
            </Grid>
            <Grid xs={12} sm={6} md={6}>
              <TextField 
                fullWidth 
                id="requester" 
                name="requester" 
                label="Requester" 
                InputLabelProps={{ shrink: true }} 
                value={rule?.requester}
                onChange={handleTextFieldChange}
              />
            </Grid>
            <Grid xs={12} sm={12} md={12}>
              <TextField 
                fullWidth 
                id="notes" 
                name="notes" 
                label="Notes"
                InputLabelProps={{ shrink: true }}
                value={rule?.notes}
                onChange={handleTextFieldChange}
              />
            </Grid>
          </Grid>
          <Grid container>
            <Grid xs={12} sm={6} md={6}>
              <FormControl sx={{ width: 300 }}>
                <InputLabel id="firewalls-label">Firewalls</InputLabel>
                <Select
                  id="firewalls"
                  name="firewalls"
                  labelId="firewalls-label"
                  label="Firewalls"
                  multiple
                  value={rule?.firewalls ? Object.values(rule.firewalls).map(firewall => firewall.hostname) : []}
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
                    allFirewalls.map((firewall) => (
                      <MenuItem key={firewall.hostname} value={firewall.hostname}>{firewall.hostname}</MenuItem>
                    ))
                  }
                </Select>
              </FormControl>
            </Grid>
          </Grid>
          <Grid container>
            <Chip label={`Rulesetrequest ${rule?.rule_set_request}`} onClick={() => navigate(`/rulesetrequest/${rule?.rule_set_request}`)} />
          </Grid>
          <Grid container>
            <Stack direction="column" spacing={0.5}>
              <span>
                <span>Created: </span>
                <Chip size="small" label={rule?.created_on ? dateTimeFormatLong.format(new Date(rule.created_on)) : ""} />
                <span> by </span>
                <Chip size="small" avatar={<Avatar>{rule?.created_by ? rule.created_by.username[0].toUpperCase() : ""}</Avatar>} label={rule?.created_by ? rule.created_by.username : ""} />
              </span>
              <span>
                <span>Last updated: </span>
                <Chip size="small" label={rule?.last_updated_on ? dateTimeFormatLong.format(new Date(rule.last_updated_on)) : ""} />
                <span> by </span> 
                <Chip size="small" avatar={<Avatar>{rule?.last_updated_by ? rule.last_updated_by.username[0].toUpperCase() : ""}</Avatar>} label={rule?.last_updated_by ? rule.last_updated_by.username : ""} />
              </span>
            </Stack>
          </Grid>
        </Grid>
        <h1 color='red'>ADD OTHER VALUES: History</h1>
        <Button 
          color='error'
          variant='outlined'
          endIcon={<DeleteOutlinedIcon />}
          onClick={() => deleteRule(rule?.pk)}
        >
          Delete
        </Button>
        <Button 
          color='success'
          variant='outlined'
          endIcon={<SaveOutlinedIcon />}
          onClick={updateRule}
        >
          Update
        </Button>
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