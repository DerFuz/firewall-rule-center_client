import logo from './logo.svg';
import './App.css';
import { Link } from 'react-router-dom';

function Home() {

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <h1>Home</h1>
        <Link to="/login">Login</Link>
        <Link to="/rules">Rules</Link>
        <Link to="/rulesetrequest">RuleSetRequest</Link>
        </header>
    </div>
  );

}

export default Home;
