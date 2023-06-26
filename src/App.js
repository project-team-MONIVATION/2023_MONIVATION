import { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { userLogin } from './member_PC_HS/slice/userSlice';

import Home from './member_PCH/pages/Home';
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
import MypageEditPu from './member_HHS/components/MypageEditPu';
import MypageEditFm from './member_HHS/components/MypageEditFm';
import MypageReservationPu from './member_HHS/pages/MypageReservationPu';
import MypageReservationFm from './member_HHS/pages/MypageReservationFm';
import SavingInput from './member_LJC/pages/SavingInput';
import SavingList from './member_LJC/pages/SavingList';

import LoginForm from './member_PC_HS/page/LoginForm';
import Login from './member_PC_HS/page/Login';
import Create from './member_PC_HS/page/Create';
import SignupFM from './member_PC_HS/components/SignupFM';
import SignupPU from './member_PC_HS/components/SignupPU';
// 실험용
import Display from './member_PC_HS/page/Display';


// css
import './styles/reset.css';
import './styles/style.css';
import './App.css';
import './member_PCH/styles/home.css';
import './member_PCH/styles/modal.css';
import './member_PCH/styles/modalCalendar.css';
import MoneyChartIncome from './member_LJC/pages/MoneyChartIncome';
import MoneyChartExpense from './member_LJC/pages/MoneyChartExpense';
import DefaultChallengeView from './member_JSH/pages/DefaultChallengeView';

function App() {

  const dispatch = useDispatch();
  // 화면 새로고침(F5)할 때마다 확인
  // app컴포넌트는 한번 마운트되고 새로고침 또는 꺼질때까지 마운트되지않는다
  useEffect(()=>{
    const user = JSON.parse(sessionStorage.getItem('user'));
    if(user) {
      dispatch(userLogin(user))
    }
  }, []);

  return (
    <div className="App">
      <Routes>
        <Route path='/' element={<Home/>}/>

        <Route path='/account' element={<LoginForm/>}>
          <Route path='/account/create' element={<Create />}/>
          <Route path='/account/login' element={<Login />}/>
        </Route>

        <Route path='/account/create/personal-user' element={<SignupPU/>}/>
        <Route path='/account/create/financial-manager' element={<SignupFM/>}/>
        <Route path='/display' element={<Display />} />

        <Route element={<Layout/>}>
          <Route path='/calendar' element={<MoneyCalendar/>}/>

          {/* 통계 페이지+수입/지출 라우터 */}
          <Route path='/calendar/chart' element={<MoneyChart/>}/>
          <Route path='/calendar/chart/income' element={<MoneyChartIncome/>}/>
          <Route path='/calendar/chart/expense' element={<MoneyChartExpense/>}/>
          
          <Route path='/challenge' element={<ChallengeList/>}/>
          <Route path='/challenge/create' element={<ChallengeCreate/>}/>
          <Route path='/challenge/:id/view' element={<ChallengeView/>}/>
          <Route path='/challenge/:id/defaultview' element={<DefaultChallengeView />}/>

          <Route path='/asset' element={<Asset/>}/>
          <Route path='/asset/managerlist' element={<AssetManagerList/>}/>
          <Route path='/asset/managerlist/:id' element={<AssetManagerProfile/>}/>
          <Route path='/asset/managerID/profile/reservation/:id' element={<AssetReservation/>}/>

          <Route path='/mypage' element={<Mypage/>}/>
          <Route path='/mypage/editpu/:id' element={<MypageEditPu/>}/>
          <Route path='/mypage/editfm/:id' element={<MypageEditFm/>} />
          <Route path='/mypage/reservationpu/:id' element={<MypageReservationPu/>} />
          <Route path='/mypage/reservationfm/:id' element={<MypageReservationFm/>}/>

          {/* 저금 페이지 */}
          <Route path='/savinginput' element={<SavingInput/>}/>
          <Route path='/savinglist' element={<SavingList/>}/>

          
          
          
          <Route/>
        </Route>
      </Routes>
    </div>
  );
}

export default App;
