import './App.css';
import { Routes, Route } from 'react-router-dom';

import Home from './member_PCH/pages/Home';
import Login from './member_HHS/pages/Login';
import CreateAccount from './member_PC/pages/CreateAccount';
import CreateUserForm from './member_HHS/pages/CreateUserForm';
import CreateManagerForm from './member_PC/pages/CreateManagerForm';
import Layout from './pages/Layout';
import MoneyCalendar from './member_JSH/pages/MoneyCalendar';
import MoneyChart from './member_LJC/pages/MoneyChart';
import ChallengeList from './member_JSH/pages/ChallengeList';
import ChallengeCreate from './member_JSH/pages/ChallengeCreate';
import ChallengeView from './member_JSH/pages/ChallengeView';
import Asset from './member_PC/pages/Asset';
import AssetManagerList from './member_PC/pages/AssetManagerList';
import AssetManagerProfile from './member_PC/pages/AssetManagerProfile';
import AssetReservation from './member_PC/pages/AssetReservation';
import Mypage from './member_HHS/pages/Mypage';
import MypageEdit from './member_HHS/pages/MypageEdit';
import MypageReservation from './member_HHS/pages/MypageReservation';

function App() {
  return (
    <div className="App">
      <Routes>

        <Route path='/' element={<Home/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/createaccount' element={<CreateAccount/>}/>
        <Route path='/createaccount/personaluser' element={<CreateUserForm/>}/>
        <Route path='/createaccount/financialmanager' element={<CreateManagerForm/>}/>

        <Route element={<Layout/>}>
          <Route path='/calendar' element={<MoneyCalendar/>}/>
          <Route path='/calendar/chart' element={<MoneyChart/>}/>
          
          <Route path='/challenge' element={<ChallengeList/>}/>
          <Route path='/challenge/create' element={<ChallengeCreate/>}/>
          <Route path='/challenge/challengeID/view' element={<ChallengeView/>}/>

          <Route path='/asset' element={<Asset/>}/>
          <Route path='/asset/managerlist' element={<AssetManagerList/>}/>
          <Route path='/asset/managerID/profile' element={<AssetManagerProfile/>}/>
          <Route path='/asset/managerID/profile/reservation' element={<AssetReservation/>}/>

          <Route path='/mypage' element={<Mypage/>}/>
          <Route path='/mypage/edit' element={<MypageEdit/>}/>
          <Route path='/mypage/reservation' element={<MypageReservation/>}/>
          <Route/>
        </Route>
      </Routes>
    </div>
  );
}

export default App;
